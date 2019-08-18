const {OrbitControls} = THREE;
const container = document.getElementById("canvas");
  
var controls, camera, scene, renderer;
var cameraCube, sceneCube;
var textureEquirec;
var cubeMesh, sphereMesh;
var sphereMaterial;
var water, light;


  init();
  animate();

  function init() {
    // Cameras
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( -225, 4, -445 );
    cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
    // Scene
    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();
    // Lights
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    scene.add( light );
    // Textures
    var textureLoader = new THREE.TextureLoader();
    textureEquirec = textureLoader.load( "https://cherscarlett.github.io/assets/env/galaxy.png" );
    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    textureEquirec.magFilter = THREE.LinearFilter;
    textureEquirec.minFilter = THREE.LinearMipmapLinearFilter;
    textureEquirec.encoding = THREE.sRGBEncoding;
    // Materials
    var equirectShader = THREE.ShaderLib[ "equirect" ];
    var equirectMaterial = new THREE.ShaderMaterial( {
      fragmentShader: equirectShader.fragmentShader,
      vertexShader: equirectShader.vertexShader,
      uniforms: equirectShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    } );
    equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;
    // enable code injection for non-built-in material
    Object.defineProperty( equirectMaterial, 'map', {
      get: function () {
        return this.uniforms.tEquirect.value;
      }
    } );
    // Water
				var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
				water = new THREE.Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/waternormals.jpg', function ( texture ) {
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
						} ),
						alpha: 1.0,
						sunDirection: light.position.clone().normalize(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
					}
				);
				water.rotation.x = - Math.PI / 2;
				var uniforms = water.material.uniforms;
				scene.add( water );
    // Skybox
    cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), equirectMaterial );
    sceneCube.add( cubeMesh );
    //
    // var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
    // sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureEquirec } );
    // sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
    // scene.add( sphereMesh );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('canvas').appendChild( renderer.domElement );
    renderer.gammaOutput = true;
    //
    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 2500;
    //
    window.addEventListener( 'resize', onWindowResize, false );
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraCube.aspect = window.innerWidth / window.innerHeight;
    cameraCube.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  //
  function animate() {
    requestAnimationFrame( animate );
    render();
  }
  function render() {
		var time = performance.now() * 0.001;
    camera.lookAt( scene.position );
    cameraCube.rotation.copy( camera.rotation );
		water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderer.render( sceneCube, cameraCube );
    renderer.render( scene, camera );
  }