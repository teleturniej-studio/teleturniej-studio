
  var World = function() {
    const vec_zero = new THREE.Vector3(0, 0, 0);
    var cameravec = new THREE.Vector3(0, 0, 0);
    var materialShaders = [];
    var renderer;
    var scene;
    var bgcolor = new THREE.Vector3(224, 160, 255);
    var bgcolor2 = new THREE.Vector3(70, 13, 95);
    var bgcolor3 = new THREE.Vector3(90, 30, 15);
    var models = ['models/body.dae', 'models/fem.dae'];

    var parent = this;
    var default_material = null;
    var default_body_material = null; 
    var default_texture = null;
    this.entities = {};
    this.all_groups = []; 
    this.scenografie = [];
    this.camera = false;
    this.ziemia_initial_position = -550 - 60;
    this.bgcolor = bgcolor.clone();

    var default_camera_pos = v3(0, 50, 270);



    class Entity {
        constructor(isFull, model3d_path, material, resize_y_to, disable_rotatex) {
            this.isFull = isFull; 
            this.resize_y_to = resize_y_to || 30;
            this.material = material || default_material;
            this.load_model3d(model3d_path, this.material, this.resize_y_to, disable_rotatex);
            this.light = this.spawn_light();

            this.group3d = new THREE.Group();
            this.object3d = null;
            scene.add(this.group3d);
            if (!isFull) parent.all_groups.push(this.group3d); 

            this.set_position(0, 0, 0);

            if (isFull) {
                this.label = make_label(20, 10);
                this.label.position.y = this.resize_y_to / 2 + 1;
                this.set_label(' ');
                this.group3d.add(this.label);

                this.txtlabel = make_label(40, 10);
                this.txtlabel.position.z = 5;
                this.set_txtlabel('');
                this.group3d.add(this.txtlabel);
            }

        }

        set_label(txt) {
            this.label.material.map = make_canvas_texture(txt);
        }

        set_txtlabel(txt) {
            this.txtlabel.material.map = make_canvas_texture(txt);
        }

        get_height() {
            const cube_bbox = new THREE.Box3();
            cube_bbox.setFromObject(this.object3d);
            return cube_bbox.max.y - cube_bbox.min.y;
        }

        set_position(x, y, z) {
            this.group3d.position.x = x;
            this.group3d.position.y = y;
            this.group3d.position.z = z;

            this.light.position.x = x;
            this.light.position.y = y + 30;
            this.light.position.z = z;

            this.light.target.position.x = x;
            this.light.target.position.y = y;
            this.light.target.position.z = z;

        }

        light_off(l) {
            l = l || this.light;
            l.color.setHex(0x000000);
        }
        light_on(l) {
            l = l || this.light;
            l.color.setHex(0x00ff00);
        }

        spawn_light() {
            var light = new THREE.SpotLight(0x00ffff, 5);

            light.angle = Math.PI / 15;
            scene.add(light);
            scene.add(light.target);
            this.light_off(light);
            // var helper = new THREE.SpotLightHelper(light);
            // scene.add(helper);

            return light;
        }

        load_model3d(path, material, resize_y_to, disable_rotatex) {
            const parent = this;

            new THREE.ColladaLoader().load(path, function(object) {
                object.scene.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (parent.isFull && !window.is_mobile) {
                            child.material=default_body_material; 
                        } else {
                            child.material = material;

                        }
                        if (!disable_rotatex) {
                            child.rotation.x = -Math.PI / 2;
                        }

                        let boundingBox = new THREE.Box3().setFromObject(child);
                        let child_size = new THREE.Vector3();
                        boundingBox.getSize(child_size);

                        let scaleFactor = resize_y_to / child_size.y;

                        child.geometry.scale(scaleFactor, scaleFactor, scaleFactor);
                        child.position.set(0, 0, 0);

                        parent.group3d.add(child);
                        parent.object3d = child;
                    }
                });
            });

            // new THREE.ColladaLoader().load(path, function(object) {

            // });

        }
    }


    this.spawn_entity = function(id, nick) {
        nick = nick || '';
        const model = models[1];

        if (nick) {
            // this.entities[id] = new Entity(
            //     true,
            //     model,
            //     this.material_init(make_canvas_texture(nick, 256))
            // );
            this.entities[id] = new Entity(
                true,
                model,
                this.material_init(default_texture)
                );
        } else {
            this.entities[id] = new Entity(true, model);
        }

        window.last_entity = this.entities[id];
        window.last_entity_id = id;

        var num = Object.keys(this.entities).length;
        var radius = 50 + num * 2;
        var angle;
        angle = ((Math.PI * 2) / (num - 0.99));
        if (num > 8 || true) {
            angle = ((Math.PI * 2) / (num));

        }
        var count = 0;

        function Dot() {
            if (num > 8 || true) {
                this.angle = angle * -count;
            } else {
                this.angle = angle * -count / 2;
            }
            window.dot_spawn_entity_x = Math.sin(this.angle - Math.PI / 2) * radius;
            window.dot_spawn_entity_z = Math.cos(this.angle - Math.PI / 2) * radius;
            this.x = window.dot_spawn_entity_x;
            this.z = window.dot_spawn_entity_z;
            count++;
        }

        for (var p in this.entities) {
            var d = new Dot();

            if (false && p == id) {
                new TWEEN.Tween({ y: 100 })
                .to({ y: 0 }, gamedata.spawn_entity_duration)
                .onUpdate(function(ob) {
                    parent.entities[p].set_position(window.dot_spawn_entity_x, ob.y, window.dot_spawn_entity_z);
                    parent.entities[p].group3d.lookAt(new THREE.Vector3(0, 0, 0));
                })
                .easing(TWEEN.Easing.Cubic.In)
                .start();
            } else {
                this.entities[p].set_position(d.x, 0, d.z);
                this.entities[p].group3d.lookAt(new THREE.Vector3(0, 0, 0));
            }

        }
    }

    this.clear_all_txtlabels = function() {
        for (let [k, v] of Object.entries(world.entities)) {
            this.entities[k].set_txtlabel('');
        }

    }

    function spawn_scenografia1() {
        var texture, xmaterial, geometry, mesh, e;

        // material = new THREE.MeshLambertMaterial({
        //     color: 0x000000,
        // });

        e = new Entity(false, 'models/biaeda.dae', default_material, 400, true);
        e.group3d.position.z = -500;
        e.group3d.position.y = -10;
        e.group3d.scale.set(1, 0.7, 0.5);
        parent.scenografie.push(e.group3d);

        e = new Entity(false, 'models/biaeda.dae', default_material, 400, true);
        e.group3d.position.z = 1500;
        e.group3d.position.y = -10;
        e.group3d.rotation.y = Math.PI;
        e.group3d.scale.set(2, 1.2, 1);


        // vlka

        // let bmaterial = null;
        // if (window.is_mobile) {

        //     bmaterial = new THREE.MeshBasicMaterial({
        //         opacity: 0.1,
        //         transparent: true,
        //         color: 0xff0000
        //     });
        // } else {
        //     bmaterial = new THREE.MeshLambertMaterial({
        //         opacity: 0.3,
        //         transparent: true,
        //         color: 0xff0000
        //     });
        // }
        // e = new Entity(false, 'models/biaeda.dae', bmaterial, 400, true);
        // e.group3d.position.z = 500;
        // e.group3d.position.y = 300;
        // e.group3d.scale.set(10, 6, 1.5);
        // e.group3d.lookAt(vec_zero);



        // material = new THREE.MeshLambertMaterial({
        //     color: 0xff0000
        // });

        e = new Entity(false, 'models/biaeda.dae', material, 50, false);
        e.group3d.position.y = 1000;
        e.group3d.scale.set(1, 3, 1);
        parent.scenografie.push(e.group3d);
        e = new Entity(false, 'models/biaeda.dae', material, 50, false);
        e.group3d.position.y = 3000;
        e.group3d.scale.set(1.5, 3, 1);
        parent.scenografie.push(e.group3d);

        e = new Entity(false, 'models/biaeda.dae', material, 50, false);
        e.group3d.position.y = 5000;
        e.group3d.scale.set(1, 3, 1);
        parent.scenografie.push(e.group3d);

        material = new THREE.MeshBasicMaterial({
            opacity: 0.5,
            transparent: true,
            color: 0x00ff00,
        });
        e = new Entity(false, 'models/korona.dae', material, 80, true);
        e.group3d.position.z = 0;
        e.group3d.position.y = 65;
        e.group3d.scale.set(1, 1, 1);
        parent.korona_model = e;

        // material = new THREE.MeshLambertMaterial({
        //     color: 0x303030,
        // });
        e = new Entity(false, 'models/body.dae', default_material, 8, true);
        e.group3d.position.x = 0;
        e.group3d.position.y = -100;
        e.group3d.position.z = 350;
        e.group3d.rotation.y = Math.PI * 0.98;
        new TWEEN.Tween(e.group3d.position).to({ z: "-3000" }, 1000000).start();

        e = new Entity(false, 'models/body.dae', default_material, 9, true);
        e.group3d.position.x = 600;
        e.group3d.position.y = -100;
        e.group3d.position.z = 650;
        e.group3d.rotation.y = Math.PI * 1.02;
        new TWEEN.Tween(e.group3d.position).to({ z: "-3000" }, 1000000).start();

        e = new Entity(false, 'models/body.dae', default_material, 8, true);
        e.group3d.position.x = -400;
        e.group3d.position.y = -100;
        e.group3d.position.z = 1000;
        e.group3d.rotation.y = Math.PI;
        e.group3d.rotation.z = Math.PI;
        new TWEEN.Tween(e.group3d.position).to({ z: "-3000" }, 1000000).start();

        e = new Entity(false, 'models/body.dae', default_material, 9, true);
        e.group3d.position.x = 400;
        e.group3d.position.y = -100;
        e.group3d.position.z = 900;
        e.group3d.rotation.y = Math.PI;
        e.group3d.rotation.z = Math.PI;
        new TWEEN.Tween(e.group3d.position).to({ z: "-3000" }, 1000000).start();

        e = new Entity(false, 'models/body.dae', default_material, 9, true);
        e.group3d.position.x = -1200;
        e.group3d.position.y = -150;
        e.group3d.position.z = 1200;
        e.group3d.rotation.y = Math.PI;
        new TWEEN.Tween(e.group3d.position).to({ z: "-3000" }, 1000000).start();

        // ziemia
        texture = new THREE.TextureLoader().load('pix/grad.png');
        let zmaterial = new THREE.MeshBasicMaterial({
            opacity: 0.6,
            transparent: true,
            alphaTest: 0.5,
            map: texture
        });

        // stol masa
        let smaterial = null;

        if (window.is_mobile) {
            smaterial = new THREE.MeshBasicMaterial({
                color: get_color_from_vec(bgcolor),
            });

        } else {
            smaterial = new THREE.MeshLambertMaterial({
                color: get_color_from_vec(bgcolor),
            });
        }

        geometry = new THREE.CylinderGeometry(
            40, 30, 10, 40);
        mesh = new THREE.Mesh(geometry, smaterial);
        mesh.geometry.computeVertexNormals();
        scene.add(mesh);
        mesh.position.y = -12;

        geometry = new THREE.CylinderGeometry(
            2000, 40, 1000, 20);
        parent.ziemia_model = new THREE.Mesh(geometry, zmaterial);
        parent.ziemia_model.geometry.computeVertexNormals();
        scene.add(parent.ziemia_model);
        parent.ziemia_model.position.y = parent.ziemia_initial_position;

        let kmaterial = null;

        if (window.is_mobile) {
            kmaterial = new THREE.MeshBasicMaterial({
               color: 0xc0c0c0,
           });
        } else {

            kmaterial = new THREE.MeshLambertMaterial({
               color: 0xf0f0f0,
           });
        }
        geometry = new THREE.CylinderGeometry(100, 40, 2000, 40);
        mesh = new THREE.Mesh(geometry, kmaterial);
        scene.add(mesh);
        mesh.position.y = -1000 - 16;

    }

    function init() {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        document.querySelector("body").appendChild(renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, 1, 1, 20000);
        scene = new THREE.Scene();
        // Axes helper
        // scene.add(new THREE.AxesHelper(500));
        var fog = new THREE.FogExp2(get_color_from_vec(bgcolor), 0.0010);

        $(window).on('resize', function(e) {
            var renderWidth = window.innerWidth;
            var renderHeight = window.innerHeight;
            var aspect = renderWidth / renderHeight;
            camera.aspect = aspect;
            var cameraPosition = 140;
            var height = 60;

            var vFOV = 2 * Math.atan(height / (2 * cameraPosition));
            var hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * aspect);
            hFOV *= (180 / Math.PI);
            vFOV *= (180 / Math.PI);

            if (aspect < 1) {
                camera.fov = 120 - hFOV;
            } else {
                camera.fov = 90 - hFOV;
            }

            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            scene.fog = false;
            window.is_mobile = true;
            if (renderWidth > 1024) {
                window.is_mobile = false;
                scene.fog = fog;
            }

        }).resize();

        this.camera.position.set(default_camera_pos);
        this.camera.lookAt(cameravec);

        var light = new THREE.AmbientLight(0xc0c0c0); // soft white light
        scene.add(light);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
        directionalLight.position.set(0, 30, 0);
        directionalLight.lookAt(new THREE.Vector3(0, 30, 0));
        scene.add(directionalLight);

        var pointlight = new THREE.PointLight(0xffffff, 5, 50, 3);
        pointlight.position.set(0, 15, 0);
        scene.add(pointlight);

        parent.controls = new THREE.OrbitControls(camera, renderer.domElement);
        parent.controls.enableZoom = true;
        parent.controls.minDistance = 30;
        parent.controls.maxDistance = default_camera_pos.z * 1.8;
        parent.controls.maxPolarAngle = 1.4650484674875264; //Math.PI / 2; 
        parent.controls.enableRotate = true;
        parent.controls.enablePan = false;
        parent.controls.target.set(0, 0, 0);
        parent.controls.update();

        // parent.controls={}; 

        // const loader = new THREE.CubeTextureLoader();
        // const texture = loader.load([
        //     'pix/tecz5.png',
        //     'pix/tecz6.png',
        //     'pix/tecz5.png',
        //     'pix/tecz6.png',
        //     'pix/tecz5.png',
        //     'pix/tecz6.png',
        //     ]);
        // scene.background = texture;
        scene.background = new THREE.Color(get_color_from_vec(bgcolor));

        default_material = parent.material_init();
        default_body_material = parent.body_material_init(); 
        material = default_material;
        default_texture = new THREE.TextureLoader().load('pix/tex.png');
    }

    this.kill_entity = function(id) {
        scene.remove(this.entities[id].light);
        delete this.entities[id];
    }

    this.delete_all_entities = function() {
        if (this.controls) this.controls.reset();

        for (var p in this.entities) {
            scene.remove(this.entities[p].group3d);
            scene.remove(this.entities[p].light);
            delete this.entities[p]
        }

        this.entities = [];
    }

    this.body_material_init=function() {

        let texturefile = 'pix/tex.png';
        let tex = new THREE.TextureLoader().load(texturefile);
        let mat = new THREE.MeshPhongMaterial({
            transparent: false,
            color: 0xa0a0a0,
            map: tex
        });


        mat.onBeforeCompile = function(shader) {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [
                'float theta = sin( time + position.y ) / 12.0;',
                'float c = cos( theta );',
                'float s = sin( theta );',
                'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                'vec3 transformed = vec3( position ) * m;',
                'vNormal = vNormal * m;'
                ].join('\n')
                );
            materialShaders.push(shader);
        };

        return mat;
    }

    this.material_init = function(texture) {
        let mat = null;

        if (!texture) {

            mat = new THREE.MeshBasicMaterial({
                color: 0x000000
            });
        } else {
            mat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                map: texture
            });

        }

        // mat.onBeforeCompile = function(shader) {
        //     shader.uniforms.time = { value: 0 };
        //     shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
        //     shader.vertexShader = shader.vertexShader.replace(
        //         '#include <begin_vertex>',
        //         [
        //             'float theta = sin( time + position.y ) / 12.0;',
        //             'float c = cos( theta );',
        //             'float s = sin( theta );',
        //             'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
        //             'vec3 transformed = vec3( position ) * m;',
        //             'vNormal = vNormal * m;'
        //         ].join('\n')
        //     );
        //     materialShaders.push(shader);
        // };

        return mat;
    }

    function animate(clock) {
        TWEEN.update();
        materialShaders.forEach(function(v, k) {
            materialShaders[k].uniforms.time.value = performance.now() / 1000;
        });

        parent.korona_model.group3d.rotation.y += 0.002;
        parent.korona_model.group3d.rotation.z += 0.004;
        parent.ziemia_model.scale.y = 1 + (Math.sin(clock / 1000) / 30);
        parent.korona_model.group3d.scale.y = 1 + (Math.sin(clock / 1000) / 30);
        parent.korona_model.group3d.scale.z = 1 + (Math.sin(clock / 1000) / 30);
        parent.korona_model.group3d.scale.x = 1 + (Math.sin(clock / 1000) / 30);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    this.sequence_look_at_obj = function(ob) {
        TWEEN.removeAll(); 
        new TWEEN.Tween(cameravec).to(ob.position, 1000)
        .onUpdate(
            function() {
                camera.lookAt(cameravec);
            })
        .easing(TWEEN.Easing.Cubic.InOut).start();
    }

    this.sequence_center = function() {

        new TWEEN.Tween(camera.position).to(vec_zero, 1000)
        .easing(TWEEN.Easing.Cubic.InOut).start();
    }

    this.sequence_home = function() {

        new TWEEN.Tween(cameravec).to(vec_zero, 1000)
        .onUpdate(
            function() {
                camera.lookAt(cameravec);
            })
        .easing(TWEEN.Easing.Cubic.InOut).start();

        new TWEEN.Tween(camera.position).to(default_camera_pos, 1000)
        .easing(TWEEN.Easing.Cubic.InOut).start();
    }

    this.sequence_czolowka = function() {
        return new Promise(function(resolve) {

            parent.controls.enabled = false;
            camera.position.set(0, 6500, 0);
            new TWEEN.Tween(camera.position)
            .to(default_camera_pos, gamedata.czolowka_duration)
            .onUpdate(
                function() {
                    camera.lookAt(vec_zero);
                })
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

            new TWEEN.Tween({ y: 1 })
            .to({ y: 5 }, gamedata.czolowka_duration)
            .onUpdate(function(v) {
                parent.scenografie[1].rotation.x = v.y;
                parent.scenografie[2].rotation.y = v.y;
            })
            .start();

            new TWEEN.Tween(camera.rotation).to({ z: Math.PI * 8 }, gamedata.czolowka_duration)
            .onComplete(function() {
                parent.controls.enabled = true;
                resolve('done');
            })
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
        });
    }

    this.sequence_podsumowanie = function() {
        if (parent.controls) parent.controls.reset();

        window.sequence_timeout = setTimeout(function() {
            parent.sequence_background_color(bgcolor2);
            parent.controls.enabled = false;

            var ulamek = gamedata.podsumowanie_duration / 8;
            // camera.position.set(0,0,0); 
            let r = rnd(1) ? Math.PI * -2 : Math.PI * 2;
            new TWEEN.Tween(camera.rotation)
            .delay(ulamek)
            .to({ x: 0, z: 0, y: r }, gamedata.podsumowanie_duration - ulamek - ulamek)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(function() {
                setTimeout(function() {

                    parent.sequence_background_color(bgcolor);
                    camera.position.set(0, 500, 0);
                    camera.lookAt(vec_zero);
                    new TWEEN.Tween(camera.position)
                    .to(new THREE.Vector3(-1250 + rnd(2500), 250 + rnd(550), -750 + rnd(1500)), gamedata.pokaz_odpowiadajacego_duration)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .onUpdate(function() {
                        camera.lookAt(vec_zero);
                    })
                    .onComplete(function() {
                        parent.controls.enabled = true;
                    })
                    .start();
                }, ulamek);
            })
            .easing(TWEEN.Easing.Linear.None)
            .start();
        }, gamedata.pokaz_odpowiadajacego_duration);
    }

    this.sequence_pokaz_odpowiadajacego = function(id) {

        parent.controls.enabled = false;
        var ob = world.entities[id].group3d;

        var lookAtVector = new THREE.Vector3(0, 0, -1);
        lookAtVector.applyQuaternion(camera.quaternion);

        new TWEEN.Tween(lookAtVector)
        .to(ob.position, gamedata.pokaz_odpowiadajacego_duration)
        .onUpdate(
            function() {
                camera.lookAt(lookAtVector);
                cameravec.x = lookAtVector.x;
                cameravec.y = lookAtVector.y;
                cameravec.z = lookAtVector.z;
            })
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

        new TWEEN.Tween(camera.position)
        .to(vec_zero, gamedata.pokaz_odpowiadajacego_duration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
        .onComplete(function() {
            parent.controls.enabled = true;
        })

    }

    this.sequence_death = function(id) {

        var ob = world.entities[id].group3d;

        return new Promise(function(resolve) {
            new TWEEN.Tween(ob.rotation).to({ x: -Math.PI / 2, y: 0, z: 0 }, gamedata.sequence_death_duration)
            .onComplete(function() {
                parent.kill_entity(id);
                resolve('done');
            })
            .easing(TWEEN.Easing.Cubic.In)
            .start();

            new TWEEN.Tween(ob.position)
            .to({ y: world.entities[id].resize_y_to / -2.2 }, gamedata.sequence_death_duration)
            .easing(TWEEN.Easing.Cubic.In)
            .start();
        });
    }

    this.sequence_background_color = function(colorvec) {

        new TWEEN.Tween(this.bgcolor)
        .to(colorvec, gamedata.sequence_background_color_duration)
        .onUpdate(function(v) {
            scene.background = new THREE.Color(get_color_from_vec(v));
        })
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    }

    this.sequence_podnies_poziom_wody = function() {

        let ob = world.ziemia_model;
        new TWEEN.Tween(ob.position)
        .to({ y: "+6" }, gamedata.sequence_podnies_poziom_wody_duration)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    }

    this.sequence_koniec = function() {
        parent.sequence_background_color(bgcolor2);

        setInterval(function() {
            ob=parent.all_groups[rnd(parent.all_groups.length-1)];
            var s=ob.scale.x+rnd(10)/10;  
            var rs=new TWEEN.Tween(ob.scale).to(v3(s,s,s),gamedata.sequence_koniec_duration/10)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start()

        },gamedata.sequence_koniec_duration/10);


        window.sequence_timeout = setTimeout(function() {
            TWEEN.removeAll();

            parent.controls.enabled = false;
            var cameradest = { x: 0, y: 100, z: 300 };
            new TWEEN.Tween(camera.position)
            .to(cameradest, gamedata.sequence_koniec_duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function() {
                camera.lookAt(v3(0, 65, 0));
            })
            .onComplete(function() {
                orbituj();
            })
            .start();

            for (id in world.entities) {
                let e = world.entities[id];

                var rot_mod = 0.5 + rnd(5) / 10;

                function rot() {
                    var r = e.group3d.rotation;
                    new TWEEN.Tween(r)
                    .to({ x: r.x + rot_mod, y: r.y + rot_mod, z: r.z + rot_mod }, gamedata.sequence_koniec_duration / 5)
                    .easing(TWEEN.Easing.Linear.None)
                    .onComplete(rot)
                    .start();
                }

                rot();

                new TWEEN.Tween(e.group3d.position)
                .delay(gamedata.sequence_koniec_duration)
                .to({ y: 65 }, gamedata.sequence_koniec_duration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
            }

            function orbituj() {

                var i = { n: 0 }
                var radius = cameradest.z;
                new TWEEN.Tween(i)
                .to({ n: Math.PI * 2 }, gamedata.sequence_koniec_duration * 5)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(orbituj)
                .onUpdate(function(v) {
                    let x = Math.sin(v.n) * radius;
                    let z = Math.cos(v.n) * radius;
                    camera.position.set(x, camera.position.y, z);
                    camera.lookAt(v3(0, 65, 0));
                })
                .start();

            }
        }, gamedata.pokaz_odpowiadajacego_duration + gamedata.delay_ostatnia_odpowiedz_a_podsumowanie);

    }

    init();
    spawn_scenografia1();
    animate();

}