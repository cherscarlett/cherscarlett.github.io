
  const {EXRLoader, EquirectangularToCubeGenerator, PMREMGenerator, PMREMCubeUVPacker} = THREE;
  const container = document.getElementById("canvas");
  
  var renderer, scene, camera;
  var torusMesh, planeMesh;
  var pngCubeRenderTarget, exrCubeRenderTarget;
  var pngBackground, exrBackground;
  
  init();
  animate();

  var params = {
      envMap: 'EXR',
      roughness: 0.0,
      metalness: 0.0,
      exposure: 1.0,
      debug: false,
  };
  
  function init() {
	var pngCubeRenderTarget, exrCubeRenderTarget;
	var pngBackground, exrBackground;
    
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 120 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.toneMapping = THREE.LinearToneMapping;
    
    var geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );
    var material = new THREE.MeshStandardMaterial( {
      metalness: params.roughness,
      roughness: params.metalness,
      envMapIntensity: 1.0
    } );
    torusMesh = new THREE.Mesh( geometry, material );
    scene.add( torusMesh );
    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    var material = new THREE.MeshBasicMaterial();
    planeMesh =  new THREE.Mesh( geometry, material );
    planeMesh.position.y = - 50;
    planeMesh.rotation.x = - Math.PI * 0.5;
    scene.add( planeMesh );
    
    new EXRLoader()
      .setDataType( THREE.FloatType )
      .load( 'https://cherscarlett.github.io/assets/env/galaxy.exr', function ( texture ) {
          texture.minFilter = THREE.NearestFilter;
          texture.encoding = THREE.LinearEncoding;
          var cubemapGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 512, type: THREE.HalfFloatType } );
          exrBackground = cubemapGenerator.renderTarget;
          var cubeMapTexture = cubemapGenerator.update( renderer );
          var pmremGenerator = new PMREMGenerator( cubeMapTexture );
          pmremGenerator.update( renderer );
          var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
          pmremCubeUVPacker.update( renderer );
          exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
          texture.dispose();
          pmremGenerator.dispose();
          pmremCubeUVPacker.dispose();
      } );
    
    new THREE.TextureLoader().load( 'https://cherscarlett.github.io/assets/env/galaxy.png', function ( texture ) {
        texture.encoding = THREE.sRGBEncoding;
        var cubemapGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 512 } );
        pngBackground = cubemapGenerator.renderTarget;
        var cubeMapTexture = cubemapGenerator.update( renderer );
        var pmremGenerator = new PMREMGenerator( cubeMapTexture );
        pmremGenerator.update( renderer );
        var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
        pmremCubeUVPacker.update( renderer );
        pngCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
        texture.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
    } );

	  renderer.setPixelRatio( window.devicePixelRatio );
	  renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.gammaInput = false;
	  renderer.gammaOutput = true;
    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.minDistance = 50;
    // controls.maxDistance = 300;

    window.addEventListener( 'resize', onWindowResize, false );
  }
  
  function onWindowResize() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize( width, height );
  }

  function animate() {
				requestAnimationFrame( animate );
				render();
			}
  
  function render() {
				torusMesh.material.roughness = params.roughness;
				torusMesh.material.metalness = params.metalness;
				var newEnvMap = torusMesh.material.envMap;
				var background = scene.background;
				switch ( params.envMap ) {
					case 'EXR':
						newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
						background = exrBackground;
						break;
					case 'PNG':
						newEnvMap = pngCubeRenderTarget ? pngCubeRenderTarget.texture : null;
						background = pngBackground;
						break;
				}
				if ( newEnvMap !== torusMesh.material.envMap ) {
					torusMesh.material.envMap = newEnvMap;
					torusMesh.material.needsUpdate = true;
					planeMesh.material.map = newEnvMap;
					planeMesh.material.needsUpdate = true;
				}
				torusMesh.rotation.y += 0.005;
				planeMesh.visible = params.debug;
				scene.background = background;
				renderer.toneMappingExposure = params.exposure;
				renderer.render( scene, camera );
			}
