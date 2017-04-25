//Base for refractive spheres from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_balls_refraction.html
//Set up global variables
var container;
var camera, scene, renderer;
var mesh, lightMesh, geometry, totoro;
var spheres = [];
var directionalLight, pointLight;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

//Functin to animate miniTotoro
setInterval(function(){
		setTimeout(function(){
   	 	document.getElementById("mini").src="images/miniTotoroClosed.svg";
		}, 11500);
		setTimeout(function(){
   	 	document.getElementById("mini").src="images/miniTotoro.svg";
		}, 11750);
		setTimeout(function(){
   	 	document.getElementById("mini").src="images/miniTotoroClosed.svg";
		}, 12500);
		setTimeout(function(){
   	 	document.getElementById("mini").src="images/miniTotoro.svg";
		}, 12750);
	}, 20000)

init();
animate();

//Main Function
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 50000 );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//Set up camera controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 24046,4430,14637 );
	controls.autoRotate = true;
	controls.autoRotateSpeed=3.0;
	controls.enablePan=false;
	controls.enableRotate=false;
	controls.enableZoom=false;

	//Set up Scene
	scene = new THREE.Scene();
	scene.add(camera);
	camera.position.y=3700;


	//Set up Background/Skybox
	scene.background = new THREE.CubeTextureLoader()
		.setPath( 'images/textures/rainSky/' )
		.load( [ 'nightsky_east.bmp', 'nightsky_west.bmp', 'nightsky_up.bmp', 'nightsky_down.bmp', 'nightsky_north.bmp', 'nightsky_south.bmp' ] );
	var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
	var textureCube = new THREE.CubeTextureLoader()
		.setPath( 'images/textures/rainSky/' )
		.load( [ 'nightsky_east.bmp', 'nightsky_west.bmp', 'nightsky_up.bmp', 'nightsky_down.bmp', 'nightsky_north.bmp', 'nightsky_south.bmp' ] );
	textureCube.mapping = THREE.CubeRefractionMapping;
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.9 } );

	//Add rain spheres
	for ( var i = 0; i < 2500; i ++ ) {
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.random() * 60000 - 5000;
		mesh.position.y = Math.random() * 60000 - 5000;
		mesh.position.z = Math.random() * 60000 - 5000;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 1 + 1;
		scene.add( mesh );
		spheres.push( mesh );
	}

	//Load in Totoro Model
	var loader = new THREE.ObjectLoader();
	loader.load('BlenderFiles/totoro.json', function(model) {
		totoro=model;
		totoro.scale.set(4000,4000,4000)
		totoro.position.set(24046,3500,14637);
		scene.add(totoro);
		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				var empty = new THREE.MeshLambertMaterial({
					transparent: true,
					emissive: 0xffffff,
				});
	// Outlines
				var mat = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
				var outline = new THREE.Mesh(child.geometry, mat);
				outline.scale.set(4040,4040,4040);
				scene.add(outline);
				outline.rotation.x=-Math.PI/2;
				outline.rotation.z=-Math.PI/2;
				outline.position.set(24046,3500,14637);

		   	}
		});    
		totoro.rotation.y=Math.PI/2;



	//Add Ambient Light
	scene.add( new THREE.AmbientLight( 0x444444 ) );

	//Add Main Directional Light
	var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
	light.position.set( 30000, 5000, 20000 );
	scene.add( light );
		  });

		
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	console.log(camera.position);
	console.log(camera.rotation);
}
function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 10;
	mouseY = ( event.clientY - windowHalfY ) * 10;
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	var timer = 0.0001 * Date.now();
	for ( var i = 0, il = spheres.length; i < il; i ++ ) {
		var sphere = spheres[ i ];
		
		sphere.position.y-= 20;
		if (sphere.position.y<=-5000){
sphere. position.y=20000;
		}
	}
	controls.update();
	renderer.render( scene, camera );
}