//Code for Spirited Away Train
//Code for rendering water shader from https://github.com/jbouny/ocean
//===================================================================================================//

//Initialize Global Variables/Run init and animate functions
var container, stats;
var camera, scene, renderer, train;
var sphere;
var parameters = {
	width: 2000,
	height: 2000,
	widthSegments: 250,
	heightSegments: 250,
	depth: 1500,
	param: 4,
	filterparam: 1
	};
var waterNormals;
var increment=0.1;
init();
animate();

//Main Function
function init() {
	increment=0.9;
	container = document.getElementById( 'container' );

	//Set up Renderer
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xffffff,0);
	container.appendChild( renderer.domElement );
	
	//Set up Scene
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xaabbbb, 0.00001 );
	

	//Set up Camera
	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 200000 );
	camera.position.set( 0, 1000, 500 );
	
	//Set up Camera Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;
	controls.minDistance = 1000.0;
	controls.maxDistance = 5000.0;
	controls.maxPolarAngle = Math.PI * 0.5;
	controls.minPolarAngle = Math.PI * 0.4;
	controls.enableKeys=false;
	controls.enableZoom = false;
	controls.target.set( 0, 1000, 500 );

	//Add Spotlight
	spotlight = new THREE.SpotLight(0xffffff, 0.8, 2000); // color, intensity, distance
	spotlight.position.set(500, 400, 100);
	spotlight.castShadow = true;
	scene.add(spotlight);
	spotlight.shadow.mapSize.width = 4096;
	spotlight.shadow.mapSize.height = 4096;
	spotlight.shadow.camera.near = 500;
	spotlight.shadow.camera.far = 2000;
	spotlight.shadow.camera.fov = 45;

	//Add Ambient Light
	scene.add( new THREE.AmbientLight( 0x444444 ) );

	//Add Main Directional Light
	var light = new THREE.DirectionalLight( 0xffffbb, 0.8 );
	light.position.set( 0, 0, -1 );
	scene.add( light );

	//Set Up Water, code courtesy of source at top
	waterNormals = new THREE.TextureLoader().load( 'images/textures/waternormals.jpg' );
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
	water = new THREE.Water( renderer, camera, scene, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 	1.0,
		sunDirection: light.position.clone().normalize(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 50.0,
		fog: scene.fog != undefined
	} );
	mirrorMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( parameters.width * 500, parameters.height * 500 ),
		water.material
	);
	mirrorMesh.add( water );
	mirrorMesh.rotation.x = - Math.PI * 0.5;
	scene.add( mirrorMesh );
	
	//Skybox
	var cubeMap = new THREE.CubeTexture( [] );
	cubeMap.format = THREE.RGBFormat;
	var loader = new THREE.ImageLoader();
	loader.load( 'images/textures/skyboxsun25degtest.png', function ( image ) {
		var getSide = function ( x, y ) {
			var size = 1024;
			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext( '2d' );
			context.drawImage( image, - x * size, - y * size );
			return canvas;
		};
		cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
		cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
		cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
		cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
		cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
		cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
		cubeMap.needsUpdate = true;
	} );
	var cubeShader = THREE.ShaderLib[ 'cube' ];
	cubeShader.uniforms[ 'tCube' ].value = cubeMap;
	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );
	var skyBox = new THREE.Mesh(
		new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
		skyBoxMaterial
	);
	scene.add( skyBox );
	
	var geometry = new THREE.IcosahedronGeometry( 400, 4 );
	for ( var i = 0, j = geometry.faces.length; i < j; i ++ ) {
		geometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
	}
	var material = new THREE.MeshPhongMaterial( {
		vertexColors: THREE.FaceColors,
		shininess: 100,
		envMap: cubeMap
	} );
	

	//Load in my custom Train Model
	var loader = new THREE.ObjectLoader();

	  loader.load('BlenderFiles/train.json', function(model) {
	   train=model;
	   train.scale.set(400,400,400)
	   train.position.y=500;
	   train.rotation.y=-Math.PI*0.25;
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
				var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
				var wireframe = new THREE.LineSegments( geo, mat );
				wireframe.rotation.y=Math.PI;
		   		wireframe.rotation.x=Math.PI/2;
		   		wireframe.rotation.z=0;
				train.add( wireframe );
				mesh.scale.set(300,300,300)
		   		mesh.position.y=500;
		  		mesh.rotation.y=Math.PI;
		   		mesh.rotation.x=Math.PI/2;
		   		mesh.rotation.z=-Math.PI/4;
		   	}
	    });
	    scene.add(train);
	  });

	//Handle Resizing
	window.addEventListener( 'resize', onWindowResize, false );
}

//Resize Function
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//Animate Function		
function animate() {
	requestAnimationFrame( animate );
	render();
}

//Render, animate position of Train vertically		
function render() {
	if (train){
		if (train.position.y<=480){
	    increment=0.9;
	    }
	    if (train.position.y>=520){
	    increment=-0.9;
	    }
	    train.position.y+=increment;
	}
	
	var time = performance.now() * 0.001;
	
	water.material.uniforms.time.value -= 40 / 60.0;
	controls.update();
	water.render();
	renderer.render( scene, camera );
}