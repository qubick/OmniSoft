
var material = new THREE.MeshPhongMaterial( { color: 0xA9A9A9, specular: 0x111111, shininess: 200, opacity:0.5 } );
material.transparent = true

var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, wireframe: true } );
var arrowMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x111111, shininess: 200, opacity:0.8 } );
var normalMaterial = new THREE.MeshNormalMaterial({opacity:0.3 });
// var gradmaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
// var regionMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, wireframe: true } );



// generating gradient material is not working yet
function generateGradientShaderMaterial( _resolution ) {
	var resolution = _resolution || 2; // 512
	//-
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragment_shader1' ).textContent
	} );
	//-
	return material;
}
