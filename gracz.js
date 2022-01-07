var io = require('socket.io-client');
var lib = require('./lib/gracz-lib.js');

var tmp={}; 

let app={
	hostname:'http://localhost:2021',
	player: {
		'is_bot':1, 
		'nick': '',
		'answers': {},
		'id':''
	},
	game:{}
}



// ------------------------------------------------------------------
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


function act_register_player() {
	return new Promise(function(resolve) {
		socket.emit('cmd_register_player', {player: app.player}, function(player_id) {
			app.player.id=player_id; 
			resolve('done'); 
		});
	});
}  

function rnd(max) {
	return Math.floor(Math.random()*(max+1)); 
}

// ------------------------------------------------------------------
var socket = io(app.hostname); 

lib.emojis_src=shuffle(lib.emojis_src);
app.player.nick=lib.emojis_src[0]; 
act_register_player(); 



socket.on('disconnect', function() {
	console.log('reboot');
	reboot(); 
});

socket.on('connect', function() {
	// console.log('connected: ',socket);
});

socket.on('chat', function(msg) {
	console.log('chat in: ',msg);
});

socket.on('state', function(msg) {
	console.log('incoming state msg:',msg); 
	if (msg.cmd=='client_sync_all_players') {
		app.game=msg.game; 
		console.log(app.game); 
		// sync_all_players(msg.players,app.players);
		// app.players=msg.players; 
	}

	if (msg.cmd=='client_zadawanie_pytania_start') {
		app.game=msg.game; 
		app.player.answers[app.game.pytanie.q]=app.game.pytanie.a[rnd(app.game.pytanie.a.length)-1];
		setTimeout(function() {
			console.log('odpowiadam',app.player); 
			socket.emit('cmd_odpowiedz',{player:app.player}); 
		},500+rnd(5000));

	} 

	// if (msg.cmd=='client_zadawanie_pytania_koniec') {
	// 	app.game=msg.game; 
	// 	if (app.game.pytanie.ostatnie) return false;
	// 	world.seq_podsumowanie(); 
	// } 

	// if (msg.cmd=='client_odpowiedz') {
	// 	app.game=msg.game; 
	// 	sync_all_players(msg.players,app.players);
	// 	app.players=msg.players; 
	// 	world.seq_camera_look_at_player(msg.player_id_odpowiadajacy);
	// }

	// if (msg.cmd=='client_pause_timer') {
	// 	app.timer_pause=msg.timer; 
	// }

	// if (msg.cmd=='client_zakonczenie_start') {
	// 	app.game=msg.game; 
	// 	app.timer_pause=true; 
	// 	world.seq_koniec();
	// }


});


function reboot() {

	// process.on("exit", function () {

	// 	require("child_process").spawn(process.argv.shift(), process.argv, {
	// 		cwd: process.cwd(),
	// 		detached : false,
	// 		stdio: "inherit"
	// 	});
	// });
	process.exit();

}


