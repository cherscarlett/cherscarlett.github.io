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
				cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), textureEquirec );
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
				document.body.appendChild( renderer.domElement );
				renderer.gammaOutput = true;
				//
				controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 500;
				controls.maxDistance = 2500;
				//
				var params = {
					Equirectangular: function () {
						cubeMesh.material = equirectMaterial;
						cubeMesh.visible = true;
						sphereMaterial.envMap = textureEquirec;
						sphereMaterial.needsUpdate = true;
					},
					Refraction: false
				};

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
