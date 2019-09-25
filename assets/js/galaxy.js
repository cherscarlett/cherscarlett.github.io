/**
 * @author Cher / https://cher.dev
 */

const {OrbitControls} = THREE;
const container = document.getElementById("canvas");
var textureLoader = new THREE.TextureLoader();
  
var controls, camera, scene, renderer;
var cameraCube, sceneCube;
var textureEquirec;
var cubeMesh;
var materials = [];
var rainGeo;
var water, light, sun, sunHeat, clouds, rain, lightning;
var isRaining = false;

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
  scene.fog = new THREE.FogExp2(0x11111f, 0.002);
  // Lights
  var ambient = new THREE.AmbientLight( 0xfd9849 );
  scene.add( ambient );
  // Sun
  var sunGeometry = new THREE.SphereBufferGeometry( 800, 80, 80 );
  var sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xff51A4,
    map: textureLoader.load("https://cherscarlett.github.io/assets/env/8k_sun-min.jpg"),
    bumpMap:  textureLoader.load("https://cherscarlett.github.io/assets/env/8k_clouds-min.jpg"),
    bumpScale:   100,
    fog: false
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  var sunHeatGeometry = new THREE.SphereBufferGeometry(810, 80, 80);
  var sunHeatMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("https://cherscarlett.github.io/assets/env/8k_pink_clouds-min.jpg"),
    transparent: true,
    opacity: 0.1,
    fog: false
  });
  sunHeat = new THREE.Mesh(sunHeatGeometry, sunHeatMaterial);
  scene.add(sunHeat);
  light = new THREE.PointLight( 0xfd9849, 2, 50 );
  light.add( sun );
  scene.add( light );
  light.position.x = 4500;
  light.position.z = 4500;
  sunHeat.position.x = 4500;
  sunHeat.position.z = 4500;
  // Textures
  textureEquirec = textureLoader.load( "https://cherscarlett.github.io/assets/env/starmap_4k-min.jpg" );
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.magFilter = THREE.LinearFilter;
  textureEquirec.minFilter = THREE.LinearMipmapLinearFilter;
  textureEquirec.encoding = THREE.sRGBEncoding;
  // Clouds
  clouds = new THREE.Group();
	scene.add( clouds );
  var cloudTexture = textureLoader.load("https://cherscarlett.github.io/assets/env/smoke.png");
  for(let i = 0; i < 250; i++) {
    var cloud = new THREE.Sprite( new THREE.SpriteMaterial( { map: cloudTexture, transparent: true, rotation: Math.random() * 360, fog: true } ) );
    cloud.position.set( - Math.random() * 5000 + 3000, - Math.random() * 1000, - Math.random() * 1000 );
    cloud.scale.set( 500, 500, 1 );
    cloud.material.opacity = .5;
    clouds.add(cloud);
  }
  clouds.rotation.x = Math.PI/2;
  clouds.rotation.z = - Math.PI * 0.1;
  // Rain
  rainGeo = new THREE.Geometry();
  var sprites = new Array(5);
  for (let i = 0; i < 5; i++) {
    spritePath = `https://cherscarlett.github.io/assets/env/rain${i + 1}.png`;
    sprites[i] = textureLoader.load(spritePath);
  }
  for ( i = 0; i < 7000; i ++ ) {

    rainDrop = new THREE.Vector3(
      Math.random() * 10000,
      Math.random() * 10000,
      Math.random() * 10000
    );
    rainDrop.velocity = {};
    rainDrop.velocity = 0;
    rainGeo.vertices.push( rainDrop );
  }
  parameters = [ [ [1.0, 0.2, 0.5], 	sprites[1], 20 ],
							   [ [0.95, 0.1, 0.5], 	sprites[2], 15 ],
							   [ [0.90, 0.05, 0.5], sprites[0], 10 ],
							   [ [0.85, 0, 0.5], 	sprites[4], 8 ],
							   [ [0.80, 0, 0.5], 	sprites[3], 5 ],
							   ];
  
  for ( i = 0; i < parameters.length; i ++ ) {

    color  = parameters[i][0];
    sprite = parameters[i][1];
    size   = parameters[i][2];

    materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
    materials[i].color.setHSL( color[0], color[1], color[2] );

    rain = new THREE.Points( rainGeo, materials[i] );

    rain.rotation.z =  Math.random() * 0.20 + 0.10;
    
    rain.position.z = -5000;
    rain.position.x = -4500;
    scene.add( rain );
  }
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
          waterColor: 0x000000,
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
  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.autoClear = false;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById("canvas").appendChild( renderer.domElement );
  renderer.gammaOutput = true;
  
  controls = new OrbitControls( camera, renderer.domElement );
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.maxAzimuthAngle = -2.674;
  controls.minAzimuthAngle = -2.674;
  controls.maxPolarAngle = 3;
  controls.minPolarAngle = 1.56;
  
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
  sun.rotation.x -= .00015;
  sunHeat.rotation.y += .00045;
  sunHeat.rotation.x += .00035;
  renderer.render( sceneCube, cameraCube );
  renderer.render( scene, camera );
  clouds.children.forEach(c => {
      if (camera.position.y < 0 && c.material.opacity < 0.6){
        c.material.rotation -=0.0002;
      }
      else if (camera.position.y > 0) {
        isRaining = false;
        
      }
      if (camera.position.y < -490 && !isRaining) {
          isRaining = true;
      }
      if (isRaining) {
        rainGeo.vertices.forEach(r => {
          r.velocity -= 0.001 + Math.random() * 0.01;
          r.y += r.velocity;
          if (r.y < -5000) {
            r.y = 5000;
            r.velocity = -50;
          }
        });
        
        rainGeo.verticesNeedUpdate = true;
      } else {
        rainGeo.vertices.forEach(r => {
          r.y = 5000;
          r.velocity = 0;
        });
        
        rainGeo.verticesNeedUpdate = true;
      }
  });
  for ( i = 0; i < materials.length; i ++ ) {

    color = parameters[i][0];

    h = ( 360 * ( color[0] + time ) % 360 ) / 360;
    materials[i].color.setHSL( h, color[1], color[2] );

  }
}
