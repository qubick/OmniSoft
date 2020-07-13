////#################################################################
//all the events related to the region selection to assign soft infills
//#################################################################

var interval = 3; //currently set to constant. Should be calculated by the model
const INFILLWALLTHICKESS = 0.6;
var infillWallArray = [];
var walls, resultingWalls, adjustedTarget, resultingRegion;

var controls;
var mouse = new THREE.Vector2();
var mouseHelper;
var annotPosition = new THREE.Vector3();
var annotOrientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );

//check what's current region selection method
var currRegionSelectMethod = 0; // 1:volume, 2: interaction type 3:free drawing, 4: level
var currentSelectRegion = 0; //	0:sphere, 1:cube, 2:cylinder, 3:torus
var intersection = {
	intersects: false,
	point: new THREE.Vector3(),
	normal: new THREE.Vector3()
};

var infillCreated = false;

//all region geometries
var freeDrawnRegion;
var regionArray = [], pointsOfDrawing = new THREE.Geometry(), regionCnt = 0;

var cylindergeometry = new THREE.CylinderGeometry( 50, 50, 50, 32 );
var cylinderRegion = new THREE.Mesh( cylindergeometry, normalMaterial );
cylinderRegion.name = 'cylinder';

var cubegeometry = new THREE.BoxGeometry(60, 60, 60);
var cubeRegion = new THREE.Mesh( cubegeometry, normalMaterial );
cubeRegion.name = 'cube';

var spheregeometry = new THREE.SphereGeometry(30, 30, 30, 0, Math.PI * 2, 0, Math.PI * 2);
var sphereRegion = new THREE.Mesh(spheregeometry, normalMaterial);
sphereRegion.name = 'sphere';

var torusgeometry = new THREE.TorusGeometry( 15, 3, 16, 100 );
var torusRegion = new THREE.Mesh( torusgeometry, normalMaterial );
torusRegion.name = 'torus';

var currPrimitiveId, currPrimitiveName, prevPrimitiveName;


mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), normalMaterial );
var position = new THREE.Vector3();
var orientation = new THREE.Euler();
var size = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );



function checkIntersection() { // for rays intersection with camera

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
	scale	 = sphereRegion.scale;

    position.set(p.x, p.y, p.z);
    position.needsUpdate = true;
	scale.needsUpdate = true;
    intersection.intersects = true;

	if( currRegionSelectMethod === 3 && drawingKeyPressed ) { //in case of free drawing
		//create the intersection points array

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

	console.log("current selection region", currentSelectRegion)
	//step 1. get intersection region
	if(!infillCreated){ //otherwise, keep the original
		if(currRegionSelectMethod === 1) {// currentlyonly applied to the sphere region

			switch(currentSelectRegion) {
				case 0: //sphere
					sphereRegion.scale.needsUpdate = true;
					resultingRegion = getSoftRegion(target3DObject, sphereRegion); //intersecting selected region from the target3Dobject
					break;
				case 1: //cube
					cubeRegion.scale.needsUpdate = true;
					resultingRegion = getSoftRegion(target3DObject, cubeRegion);
					break;
				case 2: //cylinder
					// cylinderRegion.scale.needsUpdate = true;
					resultingRegion = getSoftRegion(target3DObject, cylinderRegion);
					break;
				case 3: //torus
					torusRegion.scale.needsUpdate = true;
					resultingRegion = getSoftRegion(target3DObject, torusRegion);
					break;
				} //switch
			}
			else if ( currRegionSelectMethod === 2 ) { //by interaction type
				// resultingRegion = //
			}
			else if ( currRegionSelectMethod === 3 ) { //by free drawing

				resultingRegion = getSoftRegion(target3DObject, freeDrawnRegion);
			} // end of if
			else if ( currRegionSelectMethod === 4){ //slicing plane
				 // cutInPlaneToGet2DVectors(target3DObject); //get the 2D cut first
				 let regionSize = target3DObject.geometry.boundingSphere.radius*2;
				 var planeCutGeometry = new THREE.BoxGeometry(regionSize, regionSize/2, regionSize);
				 var planeCutRegion = new THREE.Mesh( planeCutGeometry, normalMaterial );

				 planeCutRegion.position.set(plane.position.x, plane.position.y, plane.position.z);
				 scene.add(planeCutRegion);
				 scene.remove(plane);

				 resultingRegion = getSoftRegion(target3DObject, planeCutRegion);
			}
	}

	// step 2. create infill
	let infillSize = resultingRegion.geometry.boundingSphere.radius * 2; //as big as sphere region
	let ld = parseFloat(interval);
	let repeatN = parseInt(infillSize / (ld + INFILLWALLTHICKESS));
	let geometry = new THREE.BoxGeometry(INFILLWALLTHICKESS, infillSize, infillSize);

	console.log("interval in infillcreation(): ", interval,
				" repeatN: ", repeatN,
				"infillSize: ", infillSize );

	let originX = resultingRegion.position.x - resultingRegion.geometry.boundingSphere.radius; //because of center
	let originY = resultingRegion.position.y;
	let originZ = resultingRegion.position.z;

	for(let i=0; i<repeatN; i++){
		var infillWall = new THREE.Mesh( geometry, wireframeMaterial );
		infillWall.position.set(originX + (ld + INFILLWALLTHICKESS) * i, originY, originZ);
		infillWall.name = 'infillWall';
		infillWallArray.push(infillWall);
	}

	walls = getUnionObject(infillWallArray[0], infillWallArray[1]);
	for(var i=2; i<infillWallArray.length; i++){
		walls = getUnionObject(walls, infillWallArray[i]);
	};

	getIntersectInfill( walls, resultingRegion );
}

function getIntersectRegion(){}

function getModifiedTarget(){
	// if( currRegionSelectMethod === 1) //when creating region is sphereShape
	console.log("in geTMPdifiedTarget, currPrimitiveId = ", currPrimitiveId)
		switch( currPrimitiveId ){
			case 1: //cylinder
				getSubtractionObject( cylinderRegion, target3DObject)
				break;
			case 2: //cube
				getSubtractionObject( cubeRegion, target3DObject)
				break;
			case 3: //shphere
				getSubtractionObject( sphereRegion, target3DObject)
				break;
			case 4: //torus
				getSubtractionObject( torusRegion, target3DObject);
				break;
			} //switch
}

function getSubtractionObject(source, target){ //selected region, target 3d object

  target.scale.set(settings.modelScale, settings.modelScale, settings.modelScale);

// ***************** this scaling factor needs to be updated to length-1
  // source.scale.set(source.scale.x, source.scale.y*0.95, source.scale.z*0.95)
	source.scale.set(source.scale.x, source.scale.y, source.scale.z)

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var subtract_bsp = target_bsp.subtract( source_bsp );
  adjustedTarget = subtract_bsp.toMesh( lambMaterial );

  //need to rescale manually as it is set by model scale slider
  adjustedTarget.scale.set(settings.modelScale, settings.modelScale, settings.modelScale);

  adjustedTarget.geometry.computeVertexNormals();
  adjustedTarget.geometry.computeBoundingBox();
  adjustedTarget.geometry.computeBoundingSphere();


  scene.remove( source );
  scene.remove( target );
  scene.add( adjustedTarget );
}

function recalculateInfill(){

	getIntervalbySoftnessInput(); //reset interval
	scene.remove( resultingWalls );

	createInfillWalls();
}

function getIntersectInfill(source, target){ //source: walls, resultingRegion

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var intersect_bsp = target_bsp.intersect( source_bsp );
  resultingWalls = intersect_bsp.toMesh( material );

  resultingWalls.geometry.computeVertexNormals();

  scene.add( resultingWalls );
  infillCreated = true;

}

function getSoftRegion(source, target){ //target 3d object, selected region

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
