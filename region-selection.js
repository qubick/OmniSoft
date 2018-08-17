//all the events related to the region selection to assign soft infills
var intervals = 1.2; //currently set to constant. Should be calculated by the model
const INFILLWALLTHICKESS = 0.5;
var infillWallArray = [];

var controls;
var mouse = new THREE.Vector2();
var mouseHelper;
var annotPosition = new THREE.Vector3();
var annotOrientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );

var intersection = {
	intersects: false,
	point: new THREE.Vector3(),
	normal: new THREE.Vector3()
};

var spheregeometry = new THREE.SphereGeometry(30, 30, 30, 0, Math.PI * 2, 0, Math.PI * 2);
var sphereRegion = new THREE.Mesh(spheregeometry, normalMaterial);


mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), normalMaterial );
var position = new THREE.Vector3();
var orientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );

// scene.add( mouseHelper );

var moved = false;

controls.addEventListener( 'change', function() {
	moved = true;
} );

window.addEventListener( 'mousedown', function () {
	moved = true;

	checkIntersection();
	if ( ! moved && intersection.intersects )
		fixPosition();

}, false );

window.addEventListener( 'mouseup', function() {
	moved  = false;
});

function checkIntersection() {

  if ( ! target3DObject ) return;
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( [ target3DObject ] );

  if ( intersects.length > 0 ) {
    var p = intersects[ 0 ].point; //points
    mouseHelper.position.copy( p );
    intersection.point.copy( p );

    var n = intersects[ 0 ].face.normal.clone(); //normals
    n.transformDirection( target3DObject.matrixWorld );
    n.multiplyScalar( 10 );
    n.add( intersects[ 0 ].point );
    intersection.normal.copy( intersects[ 0 ].face.normal );
    mouseHelper.lookAt( n );

    position = sphereRegion.position;


    position.set(p.x, p.y, p.z);
    // setting normal is skiped for now
    position.needsUpdate = true;
    intersection.intersects = true;

		//to access clicked object
		// intersects[ 0 ].object.callback;
  } else {
    intersection.intersects = false;
  }
}

function fixPosition(){
  //when clicked at certain point, fix the region at current fixPosition
  //when mouse down, toggle

	sphereRegion.position.needsUpdate = false;
}

function createInfillWalls(){
	console.log("sphereGeometry size: ", sphereRegion);

	if(sphereRegion) {//only applied to the sphere region
		let infillSize = sphereRegion.geometry.boundingSphere.radius * 2; //as big as sphere region
		let repeatN = infillSize / (intervals + INFILLWALLTHICKESS)
		let geometry = new THREE.BoxGeometry(INFILLWALLTHICKESS, infillSize, infillSize);

		let originX = sphereRegion.position.x - sphereRegion.geometry.boundingSphere.radius; //because of center
		let originY = sphereRegion.position.y;
		let originZ = sphereRegion.position.z;

		for(let i=0; i<repeatN; i++){
			var infillWall = new THREE.Mesh( geometry, wireframeMaterial );
			infillWall.position.set(originX + (intervals + INFILLWALLTHICKESS) * i, originY, originZ);
			infillWall.name = 'infillWall';
			infillWallArray.push(infillWall);
		}

		infillWallArray.forEach( (wall) =>{
			scene.add(wall);
		})
	}

	// getIntersectObject( infillWall, sphereRegion );
	getSubtractionObject( infillWall, sphereRegion );
}
