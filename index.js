

var argv = require('yargs/yargs')(process.argv.slice(2))
    .default('file', 'lib/gamedata_warsztaty.js')
    .argv
;



var gamedata = require('./'+argv.file);
var debug=gamedata.debug;


// if (process.env.MSZENV == 'nohttp') {
// 	console.log('Starting socket.io only');
// } else {
	var express = require('express');
	var app = express();

	app.get("/mszreboot/", (req, res)=>{
		res.status(200).send("ok");	
		reboot(); 
	});
	app.get("/mszstatus/", (req, res)=>{
		res.status(200).send('<pre style="overflow-wrap: break-word:">'+print_r(game)+"<hr>"+print_r(players));	
	});
	app.use(express.static('.'));

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
	});

// }

var http = require('http').createServer(app);
var io = require('socket.io')(http);
http.listen(2021, function() {
	console.log('listening on *:2021');
});

var players = {};
var pytania_tout;
var killlist=[]; 
var mutelist=[]; 

var game = {
	pytanie: 'BRAKPYT',
	pytanie_nr: -1,
	stage: null,
	liczba_pytan: gamedata.pytania.length,
	liczba_ludzkich_graczy: 0
};

var print_r = function(obj,t){

    // define tab spacing
    var tab = t || '';
	
    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]' ? true : false;
	
    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');

    // walk through it's properties
    for(var prop in obj){
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch(type){
			
                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;
					
                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;
					
                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }
	
    // remove extra comma for last property
    str = str.substring(0, str.length-2) + '\n' + tab;
	
    return isArr ? (str + ']') : (str + '}');
};

function act_zadaj_pytanie(onlytimeout) {
	pytania_tout = setTimeout(act_finiszuj_pytanie, gamedata.max_czas_pytania);
	if (onlytimeout) return true;

	game.pytanie_nr++;
	if (game.pytanie_nr == gamedata.pytania.length || gamedata.pytania[game.pytanie_nr].q=="KONIEC") {
		clearTimeout(pytania_tout); 
		game.stage = 'zakonczenie'; 
		io.emit('state', { cmd:'client_zakonczenie_start', game: game });
		console.log('KONIEC. Dziękujemy!');
		setTimeout(reboot,10000);

	} else {

		game.pytanie = gamedata.pytania[game.pytanie_nr];
		game.stage = 'zadawanie_pytania';
		io.emit('state', { cmd:'client_zadawanie_pytania_start', game: game });
		console.log(gamedata.max_czas_pytania); 
	} 

}


function act_finiszuj_pytanie() {
	setTimeout(function() { 
		game.stage = 'podsumowanie_po_pytaniach';
		io.emit('state', { cmd:'client_zadawanie_pytania_koniec', game: game });
	}, gamedata.delay_ostatnia_odpowiedz_a_podsumowanie+gamedata.pokaz_odpowiadajacego_duration);


	clearTimeout(pytania_tout);
	pytania_tout=setTimeout(function() {
		act_zadaj_pytanie();
	}, gamedata.delay_ostatnia_odpowiedz_a_podsumowanie+gamedata.podsumowanie_duration+gamedata.pokaz_odpowiadajacego_duration);
	
}

function act_game_start() {
	io.emit('Zaraz zaczynamy'); 

	var count=4;
	var tout=setInterval(function() {
			count--;
		if (count>=0) {
			io.emit('chat',count);
		} else {
			clearInterval(tout);
			game.pytanie_nr=-1; 
			act_zadaj_pytanie(); 	
		}
	},3000);
}



io.on('connection', function(socket) {
	var id = socket.id;
	// var address = socket.handshake.address;
	var client_remote_addres = socket.request.connection.remoteAddress;
	var client_authorized_for_commands=debug? true : false;
	if (killlist.includes(client_remote_addres)) {
		socket.emit('chat','serwer niedostępny'); 
		socket.disconnect(true); 
	}

	socket.on('chat', function(msg) {
		if (mutelist.includes(id)) {
			return false; 
		}

		if (msg=="!cmd") client_authorized_for_commands=true;  

		if (msg.match(/^\!/) ) {
			if (client_authorized_for_commands) msg=msg.replace(/^\!/,''); 
			socket.emit('chat','CMD: '+msg);
			if (msg=='?') {
				socket.emit('chat','r d pause unpause next idmute mute kill idkill<id> chaton chatoff (WIDZĘ CO ROBISZ)');
			}
			if (msg == 'd') {
				console.log(players, game);
				socket.emit('chat', players);
				socket.emit('chat', game);
				return true;
			}

			if (msg=='r') {
				act_game_start();
			}
			if (msg=='next') {
				clearTimeout(pytania_tout); 
				act_zadaj_pytanie(); 
				socket.emit('chat','next'); 

			}
			if (msg=='pause') {
				clearTimeout(pytania_tout); 
				socket.emit('chat','timer zatrzymany, !go'); 
				io.emit('state',{cmd:'client_pause_timer',timer:true}); 
			}
			if (msg=='unpause') {
				socket.emit('chat','timer odpalony'); 
				act_zadaj_pytanie(true); 
				io.emit('state',{cmd:'client_pause_timer',timer:false}); 

			}
			if (msg=='k') {
				socket.emit('chat','timer odpalony'); 
				act_zadaj_pytanie(true); 
				io.emit('state',{cmd:'client_pause_timer',timer:false}); 
			}
			if (msg=='chaton') {
				io.emit('cmd_chat_control',{cmd:true});
			}
			if (msg=='chatoff') {
				io.emit('cmd_chat_control',{cmd:false});
			}

			if (msg=='kill') {
				io.emit('cmd_killmode',{cmd:true});
			}

			if (msg=='mute') {
				io.emit('cmd_mutemode',{cmd:true});
			}

			if (msg.match(/idkill/)) {
				msg=msg.replace('idkill ','');
				msg=msg.replace('idkill','');
				killlist.push(msg); 

				let namespace=io.of('/'); 
				console.log(namespace.connected); 
				if (namespace.connected[msg]) {
					namespace.connected[msg].disconnect(true); 
					socket.emit('chat',msg+' killled');
					socket.emit('chat',killlist);
				} else {
					socket.emit('chat','nie ma takiego id '+msg);

				}
			}
			if (msg.match(/idmute/)) {
				msg=msg.replace('idmute ','');
				msg=msg.replace('idmute','');
				mutelist.push(id); 
			}

			if (msg=='reboot') {
				reboot(); 
			}

			return true;
		}

		io.emit('chat', players[id].nick + ' ' + msg);
	});

	socket.on('cmd_register_player', function(msg, ackfn) {
		players[id]=msg.player; 
		players[id].id=id; 
		players[id].ip=client_remote_addres; 
		game.liczba_ludzkich_graczy=liczba_ludzkich_graczy();

		socket.emit('chat', 'Jesteś tu. Nazywasz się '+players[id].nick);
		io.emit('state',{cmd:'client_sync_all_players',players:players,game:game}); 
		io.emit('chat', players[id].nick + ' (pojawia się)');
		if (!players[id].is_bot) io.emit('botmsg_new_human', id);
		// socket.emit('chat', 'Jeszcze czekamy na wszystkich. Startujemy wkrótce.');
		console.log('cmd_register_player', players[id]); 

		if (game.stage==null && !players[id].is_bot) {
			act_game_start(); 
		}		
		ackfn(id);
	});  

	socket.on('cmd_odpowiedz', function(msg) {
		players[id]=msg.player; 

		answer = players[id].answers[game.pytanie.q];

		if (answer) {
			io.emit('chat', players[id].nick + ' ' + answer);

			payload = { key: 'last_answer_entity', id: id };


			if (czy_wszyscy_odpowiedzieli()) {
				clearTimeout(pytania_tout);
				act_finiszuj_pytanie('Wszyscy już odpowiedzieli. '); 
			}

			io.emit('state',{cmd:'client_odpowiedz',players:players, game:game,player_id_odpowiadajacy:id}); 

		}


	}); 

	socket.on('disconnect', function() {
		if (players[id] && players[id].nick) io.emit('chat', players[id].nick + ' ZNIKA');
		delete players[id]; 
		game.liczba_ludzkich_graczy=liczba_ludzkich_graczy();
		io.emit('state',{cmd:'client_sync_all_players',players:players,game:game}); 

	});


	function czy_wszyscy_odpowiedzieli() {
		let mod = 0;
		for (let player_key in players) {
			player = players[player_key];
			if (player.answers[game.pytanie.q] || player.dead) mod++;
		}

		ret = Object.keys(players).length == mod;
		return ret;
	}


	function liczba_ludzkich_graczy() {
		let mod = 0;
		for (let player_key in players) {
			player = players[player_key];
			if (!player.is_bot) mod++;
		}
		return mod; 
	}

});


function reboot() {
	console.log('reboot'); 

	// process.on("exit", function () {

	// 	require("child_process").spawn(process.argv.shift(), process.argv, {
	// 		cwd: process.cwd(),
	// 		detached : false,
	// 		stdio: "inherit"
	// 	});
	// });
	process.exit();

}
