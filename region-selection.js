////#################################################################
//all the events related to the region selection to assign soft infills
//#################################################################

var intervals = 1.2; //currently set to constant. Should be calculated by the model
const INFILLWALLTHICKESS = 0.5;
var infillWallArray = [];
var walls, resultingWalls, adjustedTarget;

var controls;
var mouse = new THREE.Vector2();
var mouseHelper;
var annotPosition = new THREE.Vector3();
var annotOrientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );

//check what's current region selection method
var currRegionSelectMethod = 0; // 1:volume, 2: interaction type 3:free drawing, 4: level
var currentSelectRegion = 0; //	1:sphere, 2:cube, 3:cylinder, 4:torus
var intersection = {
	intersects: false,
	point: new THREE.Vector3(),
	normal: new THREE.Vector3()
};

//all region geometries
var freeDrawnRegion;
var regionArray = [], pointsOfDrawing = new THREE.Geometry(), regionCnt = 0;

var spheregeometry = new THREE.SphereGeometry(30, 30, 30, 0, Math.PI * 2, 0, Math.PI * 2);
var sphereRegion = new THREE.Mesh(spheregeometry, normalMaterial);

var cubegeometry = new THREE.BoxGeometry(30, 30, 30);
var cubeRegion = new THREE.Mesh( cubegeometry, normalMaterial );

var cylindergeometry = new THREE.CylinderGeometry( 15, 15, 20, 32 );
var cylinderRegion = new THREE.Mesh( cylindergeometry, normalMaterial );

var torusgeometry = new THREE.TorusGeometry( 15, 3, 16, 100 );
var torusRegion = new THREE.Mesh( torusgeometry, normalMaterial );



mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), normalMaterial );
var position = new THREE.Vector3();
var orientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );



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
    position.needsUpdate = true;
    intersection.intersects = true;

		if( currRegionSelectMethod === 3 && drawingKeyPressed ) { //in case of free drawing
			//create the intersection points array

			// console.log(intersection.point)
			// regionPtsArray.push(intersection.point);
			pointsOfDrawing.vertices.push(intersection.point.clone())

		}
  } else {
    intersection.intersects = false;
  }

}

function fixPosition(){
  //when clicked at certain point, fix the region at current fixPosition
  //when mouse down, toggle

	sphereRegion.position.needsUpdate = false;
}

//#################################################################
// create infill patterns into the intersectional region of soft region
// 1. union all individual walls into walls,
// 2. then intersect by the region shape
//#################################################################

function createInfillWalls(){
	var resultingRegion;

	if(currRegionSelectMethod === 1) {// currentlyonly applied to the sphere region

		//step 1. get intersection region
		// sphere region will be modified
		resultingRegion = getSoftRegion(target3DObject, sphereRegion);
	}

	else if ( currRegionSelectMethod === 2 ) {

	}
	else if ( currRegionSelectMethod === 3 ) {

		resultingRegion = getSoftRegion(target3DObject, freeDrawnRegion);
	} // end of if

	// step 2. create infill
	let infillSize = resultingRegion.geometry.boundingSphere.radius * 2; //as big as sphere region
	let repeatN = infillSize / (intervals + INFILLWALLTHICKESS);
	let geometry = new THREE.BoxGeometry(INFILLWALLTHICKESS, infillSize, infillSize);

	let originX = resultingRegion.position.x - resultingRegion.geometry.boundingSphere.radius; //because of center
	let originY = resultingRegion.position.y;
	let originZ = resultingRegion.position.z;

	for(let i=0; i<repeatN; i++){
		var infillWall = new THREE.Mesh( geometry, wireframeMaterial );
		infillWall.position.set(originX + (intervals + INFILLWALLTHICKESS) * i, originY, originZ);
		infillWall.name = 'infillWall';
		infillWallArray.push(infillWall);
	}

	walls = getUnionObject(infillWallArray[0], infillWallArray[1]);
	for(var i=2; i<infillWallArray.length; i++){
		walls = getUnionObject(walls, infillWallArray[i]);
	};
	scene.add(walls);

	getIntersectInfill( walls, resultingRegion );
}

function getModifiedTarget(){
	if( currRegionSelectMethod === 1) //when creating region is sphereShape
		// if(sphereRegion)
		getSubtractionObject( sphereRegion, target3DObject)
	else if ( currRegionSelectMethod === 2){

	}
	else if(currRegionSelectMethod === 3){
		getSubtractionObject( freeDrawnRegion, target3DObject );
	}
}

function getSubtractionObject(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var subtract_bsp = target_bsp.subtract( source_bsp );
  adjustedTarget = subtract_bsp.toMesh( lambMaterial );

  adjustedTarget.geometry.computeVertexNormals();
	adjustedTarget.geometry.computeBoundingBox();
	adjustedTarget.geometry.computeBoundingSphere();

	//need to rescale manually as it is set by model scale slider
	adjustedTarget.scale.set(settings.modelScale, settings.modelScale, settings.modelScale);

	scene.remove( target );
  scene.add( adjustedTarget );
}


function getIntersectInfill(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var intersect_bsp = target_bsp.intersect( source_bsp );
  resultingWalls = intersect_bsp.toMesh( material );

  resultingWalls.geometry.computeVertexNormals();
  // resultingWalls.position.set(resultingRegion.position.x,resultingRegion.position.y,resultingRegion.position.z); //tentative, should be the original object

  scene.remove( source );
  scene.remove( target );

  scene.add( resultingWalls );
}

function getSoftRegion(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var intersect_bsp = target_bsp.intersect( source_bsp );
  var result = intersect_bsp.toMesh( material );

  result.geometry.computeVertexNormals();
  result.geometry.computeBoundingBox();
  result.geometry.computeBoundingSphere();
  // result.position.set(target.position.x, target.position.y, target.position.z); //tentative, should be the original object


	if( currRegionSelectMethod === 1){
		scene.remove( sphereRegion );
	}
	else if ( currRegionSelectMethod === 2){

	}
	else if( currRegionSelectMethod === 3){
		scene.remove( freeDrawnRegion );
	}
  scene.add( result );
  return result
}

function getUnionObject(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var subtract_bsp = target_bsp.union( source_bsp );
  var result = subtract_bsp.toMesh( lambMaterial );

  result.geometry.computeVertexNormals();
  // result.position.set(100,100,100);

  return result;
}
