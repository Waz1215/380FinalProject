//Base for refractive spheres from https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_balls_refraction.html
//Set up global variables
var container;
var camera, scene, renderer;
var mesh, lightMesh, geometry, kiki, city;
var spheres = [];
var directionalLight, pointLight;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();
init();
animate();

//Main Function
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 400000 );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );


controls = new THREE.FlyControls( camera );

				controls.movementSpeed = 50000;
				controls.domElement = container;
				controls.rollSpeed = 1.5;
				controls.autoForward = false;
				controls.dragToLook = false;

	//Set up Scene
	scene = new THREE.Scene();
	camera.position.set(1000,1000,1000);
	scene.add(camera);
	scene.fog = new THREE.FogExp2( 0x000001, 0.00002 );
	

	var loader = new THREE.ObjectLoader();



	   loader.load('BlenderFiles/FP.json', function(model) {
	   kiki=model;
	   kiki.scale.set(60,60,60);
	   
  		

  		model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				var empty = new THREE.MeshLambertMaterial({
					transparent: true,
					emissive: 0xffffff,
				});
		// Outlines
				var mat = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
				var outline = new THREE.Mesh(child.geometry, mat);
				outline.scale.set(1.02,1.02,1.02);
				kiki.add(outline);
				outline.rotation.x=-Math.PI/2;
				outline.rotation.z=Math.PI;
				//outline.position.z=0.5;
				//outline.position.y=-0.1;
				

		   	}
		});    

		camera.add(kiki);
  		kiki.position.set(0,-50,-100);
	  });

	   loader.load('BlenderFiles/city.json', function(model) {
	   city=model;
	   city.scale.set(8000,8000,8000)
	   city.position.y=500;
	   //This code traverses children and generates their edges
	   model.traverse(function (child) {
		   if (child instanceof THREE.Mesh) {
		        var empty = new THREE.MeshLambertMaterial({
		    		transparent: true,
		    		emissive: 0xffffff,
				});
		       var mesh = new THREE.Mesh( child.geometry, empty );

				// wireframe
				var geo = new THREE.EdgesGeometry( mesh.geometry );
				var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
				var wireframe = new THREE.LineSegments( geo, mat );
				wireframe.rotation.y=Math.PI;
		   		wireframe.rotation.x=Math.PI/2;
		   		wireframe.rotation.z=0;
				city.add( wireframe );
	
		   	}
	    });
	    scene.add(city);
	  });



	//Set up Background/Skybox
	scene.background = new THREE.CubeTextureLoader()
		.setPath( 'images/textures/nightSky/' )
		.load( [ 'fullmoonrt.png', 'fullmoonlf.png', 'fullmoonup.png', 'fullmoondn.png', 'fullmoonbk.png', 'fullmoonft.png' ]  );
	

	

	//Add Ambient Light
	//
	scene.add( new THREE.AmbientLight( 0x444444 ) );

	//Add Main Directional Light
	var light = new THREE.DirectionalLight( 0x222288, 1 );
	light.position.set( 40000, 20000, 80000 );
	scene.add( light );
		 



		
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

//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	var timer = 0.0001 * Date.now();
var delta = clock.getDelta();
	controls.update(delta);
	renderer.render( scene, camera );
}