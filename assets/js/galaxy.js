const {OrbitControls} = THREE;
const container = document.getElementById("canvas");
var textureLoader = new THREE.TextureLoader();
  
var controls, camera, scene, renderer;
var cameraCube, sceneCube;
var textureEquirec;
var cubeMesh;
var water, light, sun, sunHeat;

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
  var sunGeometry = new THREE.SphereBufferGeometry( 800, 2048, 2048 );
  var sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xff51A4,
    map: textureLoader.load("https://cherscarlett.github.io/assets/env/8k_sun.jpg"),
    bumpMap:  textureLoader.load("https://cherscarlett.github.io/assets/env/8k_clouds.jpg"),
    bumpScale:   0.005
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  // var sunHeatGeometry = new THREE.SphereGeometry(810, 2058, 2058);
  // var  sunHeatMaterial = new THREE.MeshPhongMaterial({
  //   map: textureLoader.load("https://cherscarlett.github.io/assets/env/clouds.jpg"),
  //   transparent: true,
  //   opacity: 0.1
  // });
  // sunHeat = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(sunHeat);
  light = new THREE.PointLight( 0xfd9849, 2, 50 );
  light.add( sun );
  scene.add( light );
  light.position.x = 4500;
  light.position.z = 4500;
  // sunHeat.position.x = 4500;
  // sunHeat.position.z = 4500;
  // Textures
  textureEquirec = textureLoader.load( "https://cherscarlett.github.io/assets/env/starmap_16k.jpg" );
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
  Object.defineProperty( equirectMaterial, "map", {
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
          waterNormals: textureLoader.load( "https://cherscarlett.github.io/assets/env/water.jpg", function ( texture ) {
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
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.autoClear = false;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById("canvas").appendChild( renderer.domElement );
  renderer.gammaOutput = true;
  //
  controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 500;
  controls.maxDistance = 2500;
  //
  window.addEventListener( "resize", onWindowResize, false );
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
  water.material.uniforms[ "time" ].value += 1.0 / 60.0;
  sun.rotation.y -= .00025;
  renderer.render( sceneCube, cameraCube );
  renderer.render( scene, camera );
}
