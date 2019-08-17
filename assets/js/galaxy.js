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
    // CAMERAS
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set( 0, 0, 1000 );
    cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
    // SCENE
    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();
    // Lights
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    // Textures
    var r = "https://cherscarlett.github.io/assets/env/";
    var urls = [ r + "posx.jpg", r + "negx.jpg",
            r + "posy.jpg", r + "negy.jpg",
            r + "posz.jpg", r + "negz.jpg" ];
    textureCube = new THREE.CubeTextureLoader().load( urls );
    textureCube.format = THREE.RGBFormat;
    textureCube.mapping = THREE.CubeReflectionMapping;
    textureCube.encoding = THREE.sRGBEncoding;
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

    // Skybox
    cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), equirectMaterial );
    sceneCube.add( cubeMesh );
    //
    var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
    sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureEquirec } );
    sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
    scene.add( sphereMesh );
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
    camera.lookAt( scene.position );
    cameraCube.rotation.copy( camera.rotation );
    renderer.render( sceneCube, cameraCube );
    renderer.render( scene, camera );
  }