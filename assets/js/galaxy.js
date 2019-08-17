const {OrbitControls} = THREE;
const container = document.getElementById("canvas");

const params = {
  envMap: 'PNG',
  roughness: 0.0,
  metalness: 1.0,
  exposure: 1.0,
};
  
var controls, camera, scene, renderer;
var cameraCube, sceneCube;
var textureEquirec;
var cubeMesh, sphereMesh;
var sphereMaterial;

init();
animate();

import { OrbitControls } from './jsm/controls/OrbitControls.js';
  var controls, camera, scene, renderer;
  var cameraCube, sceneCube;
  var textureEquirec, textureCube, textureSphere;
  var cubeMesh, sphereMesh;
  var sphereMaterial;

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
    textureSphere = textureLoader.load( "https://cherscarlett.github.io/assets/env/metal.jpg" );
    textureSphere.mapping = THREE.SphericalReflectionMapping;
    textureSphere.encoding = THREE.sRGBEncoding;
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
    var cubeShader = THREE.ShaderLib[ "cube" ];
    var cubeMaterial = new THREE.ShaderMaterial( {
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    } );
    cubeMaterial.uniforms[ "tCube" ].value = textureCube;
    Object.defineProperty( cubeMaterial, 'map', {
      get: function () {
        return this.uniforms.tCube.value;
      }
    } );
    // Skybox
    cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), cubeMaterial );
    sceneCube.add( cubeMesh );
    //
    var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
    sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureCube } );
    sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
    scene.add( sphereMesh );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('canvas');.appendChild( renderer.domElement );
    renderer.gammaOutput = true;
    //
    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 2500;
    //
    var params = {
      Cube: function () {
        cubeMesh.material = cubeMaterial;
        cubeMesh.visible = true;
        sphereMaterial.envMap = textureCube;
        sphereMaterial.needsUpdate = true;
      },
      Equirectangular: function () {
        cubeMesh.material = equirectMaterial;
        cubeMesh.visible = true;
        sphereMaterial.envMap = textureEquirec;
        sphereMaterial.needsUpdate = true;
      },
      Spherical: function () {
        cubeMesh.visible = false;
        sphereMaterial.envMap = textureSphere;
        sphereMaterial.needsUpdate = true;
      },
      Refraction: false
    };
    var gui = new dat.GUI();
    gui.add( params, 'Cube' );
    gui.add( params, 'Equirectangular' );
    gui.add( params, 'Spherical' );
    gui.add( params, 'Refraction' ).onChange( function ( value ) {
      if ( value ) {
        textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
        textureCube.mapping = THREE.CubeRefractionMapping;
      } else {
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureCube.mapping = THREE.CubeReflectionMapping;
      }
      sphereMaterial.needsUpdate = true;
    } );
    gui.open();
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