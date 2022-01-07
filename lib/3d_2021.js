export var World2021 = function() {
	const self=this;

	let renderer;
	let scene;
	let camera;
	let controls;

	const gltf_loader = new THREE.GLTFLoader();
	
	let lights={};
	const textures={
		body: new THREE.TextureLoader().load('pix/body.jpg'),
		glazy: new THREE.TextureLoader().load('pix/mapwhite.png'),
		stolowy: new THREE.TextureLoader().load('pix/mapwhite.png'),
		mapa: new THREE.TextureLoader().load('pix/map512x512.png'),
	};
	const materials={};

	const scenografia={};

	materials.stolowy = new THREE.MeshStandardMaterial({
		color: 0x445B76,

		// map: textures.body
	});      
	materials.woda = new THREE.MeshBasicMaterial({
		opacity: 0.75,
		transparent: true,
		alphaTest: 0,
		color: 0x445B76,

	});  
	materials.slonce = new THREE.MeshBasicMaterial({
		// emissive:  0xffff00,
		color:  0xff5f00,
		fog: false
	});  
	materials.glazy = new THREE.MeshStandardMaterial( { 
		color: 0x100030, 
		// map: textures.glazy
	} );


	let players={};
	let entities_array=[];
	const defaults={
		v_camera_pos: v3(0, 50, 270),
		v_bgcolor: v3(255, 200, 128), 
		v_bgcolor_black: v3(30, 10, 5),
		v0: v3(0,0,0)
	}

	let running_tweens=[];

	const cube_geometry = new THREE.BoxGeometry();
	const cube_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	let cube;

	this.getCamera=function(){
		return camera
	}
	this.getLights=function(){
		return lights
	}
	this.getMaterials=function(){
		return materials
	}
	this.getScene=function(){
		return scene
	}
	this.getRenderer=function() {
		return renderer
	}
	this.getPlayers=function() {
		return players
	}
	this.getControls=function() {
		return controls
	}
	this.getScenografia=function() {
		return scenografia
	}

	this.seq_stolowy_blysk=function(_duration) {
		let duration=_duration||1000;
		new TWEEN.Tween(materials.stolowy)
		.to({emissiveIntensity:0.75},duration)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.repeat(1)
		.yoyo(true)
		.start();
	}

	this.seq_lights_1_dark=function(_duration) {
		return new Promise(function(resolve) {
			let duration=_duration||0;
			let duration1=duration*0.8;
			let duration2=duration*0.19;
			let duration3=duration*0.01;

			if (duration1<0) duration1=0;
			if (duration2<0) duration2=0;
			if (duration3<0) duration3=0;

			const dest_color={r:0.15,g:0.05,b:0.03}; 

			new TWEEN.Tween(scene.background)
			.to(dest_color,duration1)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start();

			new TWEEN.Tween(scene.fog.color)
			.to(dest_color,duration1)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start();

			new TWEEN.Tween(materials.woda)
			.to({opacity:0.5},duration1)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start();

			let t5=new TWEEN.Tween(lights.poczekalnia.children[0])
			// .delay(duration2)
			.to({intensity:1},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onComplete(function() {
				resolve('done');
			})
			.start(); 

			new TWEEN.Tween(lights.colordot.children[0])
			.to({intensity:0},duration1)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			// .chain(t5)
			.start();
		});

	}

	this.seq_lights_1_on=function(_duration) {
		return new Promise(function(resolve) {

			let duration=_duration||0;
			const dest_color=new THREE.Color(0x462958); 

			duration=duration/2;


			new TWEEN.Tween(lights.poczekalnia.children[0])
			.to({intensity:0},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start();

			let t1=new TWEEN.Tween(lights.colordot.children[0])
			.to({intensity:1},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut);

			let t2=new TWEEN.Tween(scene.fog.color)
			.to(dest_color,duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut);

			let t3=new TWEEN.Tween(scene.background)
			.to(dest_color,duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut);

			let t4=new TWEEN.Tween(materials.woda)
			.to({opacity:0.75},duration)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.onComplete(function() {
				resolve('done'); 
			})

			t1.chain(t2,t3,t4);

			t1.start(); 
		});
	}

	function stop_running_tweens() {
		console.log('1/2 stopping running tween',running_tweens); 
		while(running_tweens.length) {
			console.log('2/2 stopping running tween',running_tweens); 
			running_tweens.pop().stop();
		}
	}

	this.seq_koniec=function() {
		world.clear_all_txtlabels(); 
		world.seq_lights_1_dark(30000); 

		new TWEEN.Tween(scenografia.podloga.position)
		.to({y:-4000},60000)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.start();
		new TWEEN.Tween(scenografia.czubek.position)
		.to({y:-4000},60000)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.start();


		for (let pid in players) {
			let ob=players[pid].children[0];
			let t2=new TWEEN.Tween(ob.rotation)
			.to({y:ob.rotation.y+d2r(360*4),x:ob.rotation.x+d2r(360)},15000+rnd(20000))
			.repeat(Infinity)
			.start(); 

			let t1=new TWEEN.Tween(players[pid].position)
			.to({y:50},500*rnd(20))
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start();
			


		}
	}

	this.seq_zadawanie_pytania=function() {
		controls.enabled=false;
		stop_running_tweens();

		new TWEEN.Tween(scenografia.sun.scale)
		.to({x:scenografia.sun.scale.x+0.3,y:scenografia.sun.scale.y+0.3,z:1})
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.start(); 
		new TWEEN.Tween(scenografia.sun.position)
		.to({y:scenografia.sun.position.y+100})
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.start(); 


		return new Promise(function(resolve) {
			let t={count:rnd(360)};
			const initial_y=200;
			const camera_path_radius=1000;

				let targetPosition=v3(camera_path_radius*Math.sin(d2r(t.count)), initial_y, camera_path_radius*Math.cos(d2r(t.count))); // początek okręgu

				// backup originals
				let startRotation = camera.quaternion.clone();
				let startPosition = camera.position.clone();

				// final transform
				camera.position.copy(targetPosition)
				camera.lookAt( v0() );
				let endRotation = camera.quaternion.clone();

				// revert to original rotation
				camera.quaternion.copy( startRotation );
				camera.position.copy(startPosition)

				running_tweens.push(
				                    new TWEEN.Tween( camera.quaternion )
				                    .to( endRotation, gamedata.podsumowanie_duration*0.2 )
				                    .easing(TWEEN.Easing.Quadratic.InOut)
				                    .start()
				                    );

				running_tweens.push(
				                    new TWEEN.Tween(camera.position)
				                    .to(
				                        targetPosition,gamedata.podsumowanie_duration*0.2
				                        )
				                    .easing(TWEEN.Easing.Quadratic.InOut)
				                    .start()
				                    .onComplete(function() {
				                    	controls.enabled=true;
				                    })
				                    ); 

			});
	}

	this.seq_podsumowanie=function() {
		controls.enabled=false;
		stop_running_tweens();

		return new Promise(function(resolve) {
			let t={count:0};
			const initial_y=350;
			const camera_path_radius=500;

				let targetPosition=v3(camera_path_radius*Math.cos(d2r(t.count)), initial_y, camera_path_radius*Math.sin(d2r(t.count))); // początek okręgu

				// backup originals
				let startRotation = camera.quaternion.clone();
				let startPosition = camera.position.clone();

				// final transform
				camera.position.copy(targetPosition)
				camera.lookAt( v0() );
				let endRotation = camera.quaternion.clone();

				// revert to original rotation
				camera.quaternion.copy( startRotation );
				camera.position.copy(startPosition)

				running_tweens.push(
				                    new TWEEN.Tween( camera.quaternion )
				                    .to( endRotation, gamedata.podsumowanie_duration*0.2 )
				                    .easing(TWEEN.Easing.Quadratic.InOut)
				                    .start()
				                    );

				running_tweens.push(
				                    new TWEEN.Tween(camera.position)
				                    .to(
				                        targetPosition,gamedata.podsumowanie_duration*0.2
				                        )
				                    .easing(TWEEN.Easing.Quadratic.InOut)
				                    .start()
				                    ); 


				self.seq_lights_1_dark(gamedata.podsumowanie_duration*0.2).then(() => {



					new TWEEN.Tween(t)
					.to({count:360},gamedata.podsumowanie_duration-gamedata.podsumowanie_duration*0.2-gamedata.podsumowanie_duration*0.2)
					.easing(TWEEN.Easing.Cubic.InOut)
					.onUpdate(function(c) {
						camera.position.x=camera_path_radius*Math.cos(d2r(c.count));
						camera.position.z=camera_path_radius*Math.sin(d2r(c.count));
						camera.position.y=initial_y-c.count/1.5; 
						camera.lookAt(v0()); 
					})
					.onComplete(function() {
						controls.enabled=true;
						self.seq_lights_1_on(gamedata.podsumowanie_duration*0.2).then(function() {
							resolve('done');
						}); 
					})
					.start()

				});

			});
	}

	this.seq_death=function(id) {
		players[id].death().then(() => {
			delete players[id]; 
		}); 
	}


	this.seq_camera_look_at_player=function(id) {
		stop_running_tweens();

		controls.saveState();
		controls.enabled = false;
		let ob = players[id];

		let targetPosition={x:-2*ob.position.x+(-50+rnd(100)),y:150,z:-2*ob.position.z+(-50+rnd(100))};

		// backup originals
		let startRotation = camera.quaternion.clone();
		let startPosition = camera.position.clone();

		// final transform
		camera.position.copy(targetPosition)
		camera.lookAt( ob.position );
		let endRotation = camera.quaternion.clone();

		// revert to original rotation
		camera.quaternion.copy( startRotation );
		camera.position.copy(startPosition)

		running_tweens.push(
		                    new TWEEN.Tween( camera.quaternion )
		                    .to( endRotation, gamedata.pokaz_odpowiadajacego_duration )
		                    .easing(TWEEN.Easing.Quadratic.InOut)
		                    .start()
		                    ); 

		running_tweens.push(
		                    new TWEEN.Tween(camera.position)
		                    .to(
		                        targetPosition,gamedata.pokaz_odpowiadajacego_duration
		                        )
		                    .easing(TWEEN.Easing.Quadratic.InOut)
		                    .onComplete(function() {
		                    	let t=new TWEEN.Tween(camera.position)
		                    	.to({x:camera.position.x*2,y:camera.position.y*2,z:camera.position.z*2},gamedata.max_czas_pytania)
		                    	.easing(TWEEN.Easing.Sinusoidal.InOut)
		                    	.start();

		                    	running_tweens.push(t); 
		                    })
		                    .start()
		                    );


	}

	this.seq_czolowka=function() {
		const duration=gamedata.czolowka_duration; 
		let dist_from_0=3000;
		let t={i:0,dist:2500,y:2000}
		return new Promise(function(resolve) {

			let t1=new TWEEN.Tween(t)
			.to({i:d2r(180),dist:1000,y:1200},duration/2)
			.easing(TWEEN.Easing.Sinusoidal.In)
			.onUpdate(function(t) {
				let x=Math.sin(t.i)*t.dist; 
				let z=Math.cos(t.i)*t.dist; 
				camera.position.set(x,t.y,z);
				camera.lookAt(defaults.v0); 
			})
			.onComplete(function() {
				// t.dist=500; 
			}); 


			let t2=new TWEEN.Tween(t)
			.to({i:d2r(360),dist:500,y:120},duration/2)
			.easing(TWEEN.Easing.Sinusoidal.Out)
			.onUpdate(function(t) {
				let x=Math.sin(t.i)*t.dist; 
				let z=Math.cos(t.i)*t.dist; 
				camera.position.set(x,t.y,z);
				camera.lookAt(defaults.v0); 
			})
			.onComplete(function() {
				resolve('done'); 
			}); 

			t1.chain(t2);
			t1.start(); 

		});
	}

	class Entity extends THREE.Group {

		constructor(gltf_path,texture) {			
			super();
			this.gltf_path=gltf_path;
			this.texture=texture;
			this.gltf=null;
		}

		init() {
			entities_array.push(this); 
			return this.load_model3d(this.gltf_path,this.texture);
		}

		load_model3d(gltf_path,texture) {			
			const self=this;
			return new Promise(function(resolve) {
				gltf_loader.load(gltf_path, function ( data ) {
					// console.log('this:',self); 
					gltf_apply_texture(data.scene,texture);
					self.gltf=data;
					self.add(self.gltf.scene);
					resolve('done');
				});
			});
		}

		getSize() {
			return object3d_getsize(this); 
		}
	}

	class Player extends Entity {
		constructor(nick) {
			const gltf_path='models/fem.glb';
			const texture=textures.mapa;
			let size;

			super(gltf_path,texture);

			this.label=null;
			this.txtlabel=null;
			this.self_light=null;
			this.nick=nick;
			// this.spawn_light(); 
		}


		init() {
			const self=this;
			return new Promise((resolve) => {
				super.init().then(() => {
					// console.log('super called',self.gltf.scene,gltf_mesh_action);

					// console.log(d2r(10));

					let mesh_size;
					gltf_mesh_action(self.gltf.scene, function(mesh) {
						mesh.scale.set(0.5,0.5,0.5); 
						mesh_size=object3d_getsize(mesh);
						mesh.translateY(mesh_size.y/2); 
						mesh.translateZ(-mesh_size.z/8); 
						mesh.rotateX(d2r(4)); 
						mesh.castShadow = true;
					});
					// console.log(mesh_size); 

					self.label = make_label_3d(24);
					self.label.position.y = mesh_size.y; 
					self.label.material.map = make_canvas_texture(self.nick);
					self.add(self.label);

					self.txtlabel = make_label(160, 30);
					self.txtlabel.material.map = make_canvas_texture('-');
					self.txtlabel.position.z = 10;
					self.txtlabel.position.y=mesh_size.y/2;
					self.add(self.txtlabel);

					resolve('done'); 
				});
			}); 
		}

		spawn_light() {
			this.self_light=new THREE.PointLight(0xffffff,2,100);
			this.self_light.position.set(0,5,0);
			this.add(this.self_light);			
			// console.log(object3d_getsize(this).y); 
		}

		set_txtlabel(txt) {
			this.txtlabel.material.map = make_canvas_texture(txt);
		}

		death() {
			const self=this; 
			this.remove(this.children[1]); // label
			this.remove(this.children[1]); // txtlabel

			return new Promise(function(resolve) {

				// gltf_mesh_action(self.gltf.scene, function(mesh) {

				// 	new TWEEN.Tween( mesh.material ).to( { opacity: 0 }, 3000 ).start();
				// }); 

				new TWEEN.Tween(self.children[0].rotation)
				.to({x:d2r(90),z:d2r(-25+rnd(50))})
				.onComplete(function() {
					scene.remove(self); 
					resolve('done'); 
				})	
				.start(); 
				// new TWEEN.Tween(self.children[0].position)
				// .to({x:d2r(-90),z:d2r(-25+rnd(50))})
				// .onComplete(function() {
				// 	resolve('done'); 
				// })	
				// .start(); 

			}); 
		}

	}

	const getNewPointOnVector = (p1, p2) => {
		let distAway = -200;
		let vector = {x: p2.x - p1.x, y: p2.y - p1.y, z:p2.z - p1.z};
		let vl = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
		let vectorLength = {x: vector.x/vl, y: vector.y/vl, z: vector.z/vl};
		let v = {x: distAway * vectorLength.x, y: distAway * vectorLength.y, z: distAway * vectorLength.z};
		return {x: p2.x + v.x, y: p2.y + v.y, z: p2.z + v.z};
	}


	function spawn_scenografia1() {
		let geometry, mesh;

		scene.background = new THREE.Color(0xffffff);
		var fog = new THREE.FogExp2(0xffffff, 0.0006);
		scene.fog = fog;

		lights.poczekalnia=new THREE.Group();
		lights.poczekalnia.add(new THREE.PointLight(0x009020,1,0));
		lights.poczekalnia.children[0].castShadow = true;
		lights.poczekalnia.position.set(0, 120, 0)
		// lights.poczekalnia.add(new THREE.Mesh( cube_geometry, cube_material ));
		scene.add(lights.poczekalnia);

		lights.colordot=new THREE.Group();
		lights.colordot.add(new THREE.PointLight(0xFFffff,1, 0));
		lights.colordot.children[0].castShadow = true;
		lights.colordot.position.set(120, 120, 120);
		if (gamedata.debug) lights.colordot.add(new THREE.Mesh( cube_geometry, cube_material ));
		scene.add(lights.colordot);

		// sun
		scenografia.sun=new THREE.Mesh(new THREE.SphereGeometry( 500, 24, 24 ),materials.slonce);
		scenografia.sun.position.set(-300,400,-12500);
		scene.add(scenografia.sun); 

		// sun block
		geometry = new THREE.BoxGeometry(60000,10000,10);
		mesh = new THREE.Mesh( geometry, materials.glazy );
		mesh.position.set(0,-5150,-12000);
		scene.add(mesh);

		// woda i ciała

		gltf_loader.load( 'models/body.glb', function ( gltf ) {
			let body;
			gltf_mesh_action(gltf.scene,function(mesh) {
				body=mesh;
				return false; 
			});

			for (let i=0;i<30;i++) {
				let group=new THREE.Group();
				let s=body.clone();
				group.add(s);
				// gltf_apply_texture(gltf,textures.body);
				s.scale.set(14+rnd(3),14+rnd(3),15); 
				s.translateY(-object3d_getsize(s).y/2-12-rnd(15)); 
				s.rotation.x=(d2r(90*(Math.random()>0.5 ? -1 : 1))); 
				s.rotation.z=(d2r(rnd(360))); 
				group.position.x=(200+rnd(1200))*(Math.random()>0.5 ? -1 : 1);
				group.position.z=(200+rnd(1200))*(Math.random()>0.5 ? -1 : 1);
				scene.add( group );

				new TWEEN.Tween(group.position)
				.delay(25+rnd(25))
				.to({y:group.position.y+50},4000)
				.easing(TWEEN.Easing.Sinusoidal.InOut)
				.repeat(Infinity)
				.yoyo(true)
				.start();
				new TWEEN.Tween(group.rotation)
				.delay(rnd(10))
				.to({z:d2r(-7+rnd(15)),x:d2r(-7+rnd(15))},2000+rnd(5000))
				.easing(TWEEN.Easing.Sinusoidal.InOut)
				.repeat(Infinity)
				.yoyo(true)
				.start();
			}

			geometry = new THREE.BoxGeometry(8000,2000,8000);
			scenografia.woda = new THREE.Mesh(geometry, materials.woda);
			scenografia.woda.position.y = -1060;
			scene.add(scenografia.woda);

			new TWEEN.Tween(scenografia.woda.position)
			.to({y:scenografia.woda.position.y+50},4000)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.repeat(Infinity)
			.yoyo(true)
			.start();


		});


		// czubek
		geometry = new THREE.CylinderGeometry(1,30, 80, 3);
		scenografia.czubek = new THREE.Mesh(geometry, materials.stolowy);
		scenografia.czubek.position.y = 10;
		scenografia.czubek.receiveShadow = true;
		scenografia.czubek.castShadow = true;
		scene.add(scenografia.czubek);

		// podloga
		geometry = new THREE.CylinderGeometry(200, 40, 2000, 40);
		scenografia.podloga = new THREE.Mesh(geometry, materials.stolowy);
		scenografia.podloga.receiveShadow = true;
		scene.add(scenografia.podloga);
		scenografia.podloga.position.y = -1000; 

		// glazy
		geometry = new THREE.BoxGeometry(400,1000,400);

		for (let i=2;i<10;i++) {
			mesh = new THREE.Mesh( geometry, materials.glazy );
			mesh.geometry.computeVertexNormals();
			mesh.position.x=(rnd(1000)+1200)*Math.sin(i);
			mesh.position.z=(rnd(1000)+1200)*Math.cos(i);
			// mesh.position.y=(rnd(50)+50)*Math.tan(i);
			mesh.rotation.z=d2r(-20+rnd(40)); 
			if (rnd(1)==1) mesh.rotation.z=d2r(170+rnd(20)); 
			mesh.rotation.x=d2r(-20+rnd(40)); 
			mesh.rotation.y=d2r(-20+rnd(40)); 
			mesh.scale.set(1+0*Math.random(),1+2*Math.random(),1+0*Math.random());
			scene.add( mesh );
		}

		geometry = new THREE.CylinderGeometry(1,30, 500, 3);
		for (let i=2;i<10;i++) {
			mesh = new THREE.Mesh( geometry, materials.glazy );
			mesh.geometry.computeVertexNormals();
			mesh.position.x=(rnd(1000)+500)*Math.sin(i);
			mesh.position.y=-300; 
			mesh.position.z=(rnd(1000)+500)*Math.cos(i);
			// mesh.position.y=(rnd(50)+50)*Math.tan(i);
			mesh.rotation.z=d2r(-20+rnd(40)); 
			mesh.rotation.x=d2r(-20+rnd(40)); 
			mesh.rotation.y=d2r(-20+rnd(40)); 
			mesh.scale.set(1+0*Math.random(),1+2*Math.random(),1+0*Math.random());
			scene.add( mesh );
		}

		self.seq_lights_1_dark(0).then(function() {
			self.seq_lights_1_on(0); 
		}); 
	}


	function init() {
		renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		document.querySelector("body").appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera(35, 1, 1, 20000);
		camera.position.set(0,120,270);
		camera.lookAt(0,0,0); 

		scene = new THREE.Scene();

		if (gamedata.debug) scene.add(new THREE.AxesHelper(500));



		$(window).on('resize', function(e) {
			var renderWidth = window.innerWidth;
			var renderHeight = window.innerHeight;
			var aspect = renderWidth / renderHeight;
			camera.aspect = aspect;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);

			window.is_mobile = true;
			if (renderWidth > 1024) {
				window.is_mobile = false;
			}
		}).resize();

		controls = new THREE.OrbitControls(camera, renderer.domElement);
		// controls.enableZoom = false;
		controls.minDistance = 300;
		controls.maxDistance = 1200; 
		controls.maxPolarAngle = 1.4650484674875264; //Math.PI / 2; 
		// controls.enableRotate = true;
		controls.enablePan = false;
		controls.target.set(0, 0, 0);
		controls.update();
		// controls.enabled=false; 

	}

	function animate(clock) {
		TWEEN.update();
		// materialShaders.forEach(function(v, k) {
		//     materialShaders[k].uniforms.time.value = performance.now() / 1000;
		// });

		let x=220*Math.sin(clock/10000);
		let y=120+60*Math.cos(clock/6000);
		let z=220*Math.cos(clock/10000);
		lights.colordot.position.set(x,y,z);

		renderer.render(scene, camera);
		requestAnimationFrame(animate);
		// $('.debugger').html(JSON.stringify(camera.position));
	}

	this.clear_all_txtlabels = function() {
		for (let [k, v] of Object.entries(players)) {
			players[k].set_txtlabel('');
		}
	}

	this.spawn_player = function(id, _nick,has_light) {
		const nick = _nick || '';
		if (players[id]) {
			console.warn('players[id] already exists');
			return false; 
		}

		players[id] = new Player(nick); 
		players[id].init().then(function() {
			if (has_light) players[id].spawn_light(); 
			scene.add(players[id]);

			let num = Object.keys(players).length;
			let radius = 150 + num * 2;
			if (num>10) radius*=1.08; 
			let angle = ((Math.PI * 2) / (num));
			let count = 0; 

			function Dot() {
				this.angle = angle * -count;
				this.x = Math.sin(this.angle - Math.PI / 2) * radius;
				this.z = Math.cos(this.angle - Math.PI / 2) * radius;
				count++;
			}

			for (let pid in players) {
				let d = new Dot();

				if (pid==id) {
					players[pid].position.set(d.x, 300, d.z);
					new TWEEN.Tween(players[pid].position)
					.to({y:0})
					.easing(TWEEN.Easing.Sinusoidal.InOut)
					.onUpdate(function(pos) {
						players[pid].lookAt(defaults.v0); 
					})
					.start(); 
				} else {
					new TWEEN.Tween(players[pid].position)
					.to({x:d.x,z:d.z})
					.easing(TWEEN.Easing.Sinusoidal.InOut)
					.onUpdate(function(pos) {
						players[pid].lookAt(defaults.v0); 
					})
					.start(); 
				}
			}

		});
	}


	init();
	spawn_scenografia1(); 




	// let e=new Player();
	// console.log(e); 
	// scene.add(e); 
	// e.lookAt(v0());


	animate(); 


	// this.seq_lights_1_dark(10000);	
	// this.seq_czolowka();

};
