

function rnd(max) {
	return Math.floor(Math.random() * (max + 1));
}


function make_canvas_texture(txt,fs, repeat) {
	repeat = repeat || 1;
	fs=fs || 48; 
	txt = txt || ' ';
	var w=fs * txt.length; 
	
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = fs+20;
	ctx.font = fs+'px sans-serif'; 
	ctx.fillStyle='white'; 
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(txt, canvas.width / 2, canvas.height / 2)
	var texture = new THREE.CanvasTexture(canvas);
	texture.repeat.set( repeat, repeat );
	$(canvas).remove(); 
	return texture;
}

function make_label(w,h) {
	return new THREE.Mesh(
	                      new THREE.PlaneGeometry(w, h),
	                      new THREE.MeshBasicMaterial({ 
	                      	transparent: false, side: THREE.DoubleSide, alphaTest: 0.5 })
	                      );
}
function make_label_3d(w) {
	return new THREE.Mesh(
	                      new THREE.BoxGeometry(w,w,w),
	                      new THREE.MeshBasicMaterial({ 
	                      	transparent: false,  alphaTest: 0.5 })
	                      );
}

function v3(x,y,z) {
	x=x||0;
	y=y||0;
	z=z||0;
	return new THREE.Vector3(x,y,z); 
}

function v0() {
	return v3(0,0,0); 
}

function get_color_from_vec(vec) {
	return `rgb(${Math.round(vec.x)},${Math.round(vec.y)},${Math.round(vec.z)})`;
}

function d2r(deg) {
	return THREE.MathUtils.degToRad(deg); 
}

function gltf_apply_texture(scene,texture) {
	let ret=false;
	scene.traverse( function( object ) {
		if ( object.isMesh ) {
			object.material.map = texture;
			ret=true;
		}
	} );	

	return ret;
}

function gltf_mesh_action(scene,callback) {
	let ret=false;
	scene.traverse( function( object ) {
		if ( object.isMesh ) {
			callback(object);
			ret=true;
		}
	} );	
	return ret;
}

function object3d_getsize(ob) {
	let box = new THREE.Box3().setFromObject( ob );
	let ret=new THREE.Vector3();
	box.getSize(ret);
	return ret; 
}


THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.eulerOrder);
        return vector;
    }
};