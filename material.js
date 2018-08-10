
var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 200, opacity:0.5 } );
material.transparent = true

var lambMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, alphamap: 0.3, opacity: 0.5});
lambMaterial.transparent = true;

var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, wireframe: true } );
var arrowMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x111111, shininess: 200, opacity:0.8 } );
var normalMaterial = new THREE.MeshNormalMaterial({opacity:0.3 });
normalMaterial.transparent = true;
// var gradmaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
var regionMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, wireframe: true } );


var texture = new THREE.Texture( generateRadialGradient() );
texture.needsUpdate = true;
var gradientMaterial = new THREE.MeshBasicMaterial( {map:texture,  transparent: true});


function generateLinearGradient() {

	var size = 512;

	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( 0, 0, size, size );
	gradient.addColorStop(0, '#99ddff'); // light blue
	gradient.addColorStop(1, 'transparent'); // dark blue
	context.fillStyle = gradient;
	context.fill();

	return canvas;

}

function generateRadialGradient() {

	var size = 512;

	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createRadialGradient( 100, 100, 50, 100, 100, 100);
	gradient.addColorStop(0, '#99ddff'); // light blue
	gradient.addColorStop(1, 'transparent'); // dark blue
	context.fillStyle = gradient;
	context.fill();

	return canvas;

}

// not using this for now
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
