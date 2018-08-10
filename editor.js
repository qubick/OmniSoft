// import Dropzone from 'react-dropzone'

var container, stats;
var camera, controls, scene, renderer, transformControl;
var raycaster;
var objects = [];
var originObj, originPoint;

var target3DObject, decal, sphereRegion;

init();
animate();

var loader = new THREE.STLLoader();

function init() {

  // get type of gear and create UI according to it
  createPanel(); //load basic UI

  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;

  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x505050, 0.2 ) );

  var light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 500, 2000 );
  // light.position.set( 0, 1, 0 );
  light.castShadow = true;
  light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 2500 ) );
  light.shadow.bias = - 0.00022;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add( light );

  //for shadow Light
  // var newlight = new THREE.DirectionalLight( 0xfffff, 1, 100);
  // newlight.position.set(0,1,0);
  // newlight.castShadow = true;
  // newlight.shadow.mapSize.width = 1024;
  // newlight.shadow.mapSize.height = 1024;
  // newlight.shadow.camera.near = 0.1;
  // newlight.shadow.camera.far = 25;
  // scene.add(newlight);

  var grid = new THREE.GridHelper( 1000, 100, 0x888888, 0xcccccc );
  grid.position.set(0, -100, 0);
  scene.add( grid );


  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // renderer.shadowMap.type = THREE.BasicShadowMap
  container.appendChild( renderer.domElement );

  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  transformControl = new THREE.TransformControls( camera, renderer.domElement );
  transformControl.addEventListener( 'change', render );
  transformControl.setMode("rotate");

  scene.add( transformControl );

  raycaster = new THREE.Raycaster();

  var changed = false;
  var mouseMoved = false;
  controls.addEventListener( 'change', function() {
    mouseMoved = true;
  } );

  window.addEventListener( 'mousedown', function () {
    changed = false;
    mouseMoved = false;
  }, false );

  // window.addEventListener( 'mouseup', function() {
  //   checkIntersection();
  // });


  window.addEventListener( 'mousemove', onTouchMove );
  window.addEventListener( 'touchmove', onTouchMove );


  var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
  dragControls.addEventListener( 'dragstart', function ( event ) { console.log("dragging object start"); controls.enabled = false; } );
  dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

  stats = new Stats();
  container.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize, false );



  //see if it's different when in init()
  window.addEventListener( 'mouseup', function() {
			checkIntersection();
			// if ( ! moved && intersection.intersects ) shoot();
		} );
		window.addEventListener( 'mousemove', onTouchMove );
		window.addEventListener( 'touchmove', onTouchMove );

    function onTouchMove( event ) {
			var x, y;
			if ( event.changedTouches ) {
				x = event.changedTouches[ 0 ].pageX;
				y = event.changedTouches[ 0 ].pageY;
			} else {
				x = event.clientX;
				y = event.clientY;
			}
			mouse.x = ( x / window.innerWidth ) * 2 - 1;
			mouse.y = - ( y / window.innerHeight ) * 2 + 1;
			checkIntersection();
		}

} //end of init


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function ReturnDesiredInteraction(event){

  selectedInterAction = parseInt(event.target.value);
  console.log("selected Action: ", selectedInterAction);
  LoadDesiredInteraction(parseInt(selectedInterAction));

  // showDiv();
}

function LoadDesiredInteraction(selectedInterAction) {

  var targetPath, arrowPath, bodyGeometry, arrowGeometry; //foot, finger, body, palm;

  switch(selectedInterAction){
    case 1: //footpress
      targetPath = './assets/left-foot.stl'
      break;
    case 2: //finger pres
      targetPath = './assets/finger-new.stl'
      break;
    case 3: //sit
      targetPath = './assets/sittingman.stl'
      break;
    case 4: //grash by palm
      targetPath = './assets/grasp.stl'
      break;
    case 5: //press by palm
      targetPath = './assets/palm.stl'
      break;
    case 6: //pinch by two fingers
      break;
    break;
    default:
  }

  var arrowGeometry;

  loader.load( targetPath, ( geometry ) => {
    geometry.center()

    bodyGeometry = new THREE.Mesh( geometry, material );
    bodyGeometry.rotation.set(-Math.PI/2, 0, Math.PI);

    //after loading push force, load arrow to indicate direction
    arrowPath = './assets/arrow.stl';

    var xAxis = new THREE.Vector3( 1, 0, 0 );
    var yAxis = new THREE.Vector3( 0, 1, 0 );
    var zAxis = new THREE.Vector3( 0, 0, 1 );

    loader.load( arrowPath, (geometry) => {
      arrowGeometry = new THREE.Mesh( geometry, arrowMaterial);

      switch (selectedInterAction) {
        case 1: //foot
          bodyGeometry.scale.set(.5,.5,.5);
          bodyGeometry.position.set(0 ,50, 0);
          arrowGeometry.rotation.set(-Math.PI/2, 0, 0);
          arrowGeometry.translateOnAxis(zAxis, -50);

          sphereRegion.name = "footStep_volume";
          sphereRegion.translateOnAxis(yAxis, -55);

          break;
        case 2: //finger press
          bodyGeometry.position.set(0, 50,20)
          arrowGeometry.rotation.set(-Math.PI/4, 0, 0);
          arrowGeometry.position.set(0, -5, -55);

          sphereRegion.name = "fingerPress_volume";
          break;

        case 3: //sit
          bodyGeometry.scale.set(50,50,50);
          bodyGeometry.rotateOnAxis(zAxis, Math.PI/2);
          bodyGeometry.position.set(-30,60,0);

          arrowGeometry.rotation.set(-Math.PI/2, 0, 0);
          arrowGeometry.position.set(0, -70, 0);

          // spheregeometry = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
          sphereRegion.name = "sitPose_volume";
          break;

        case 4: //palm grasp
          bodyGeometry.scale.set(.7,.7,.7);
          arrowGeometry.translateOnAxis(zAxis, -25);
          break;
        default:

      }
      sphereRegion.add(arrowGeometry)
    });
    sphereRegion.add(bodyGeometry)

    sphereRegion.castShadow = true;
    bodyGeometry.castShadow = true;
    sphereRegion.receiveShadow = true;

    scene.add(sphereRegion);
    transformControl.attach(sphereRegion);
  });



}

// function ReturnRegionSelection(evt) {
//
//     var caseValue = parseInt(evt.target.value)
//     switch (caseValue) {
//       case 1: //sphere
//
//         var geometry = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
//         var cube = new THREE.Mesh(geometry, wireframeMaterial);
//         // scene.add( sphere );
//         break;
//       case 2: //cube
//         var geometry = new THREE.BoxGeometry( 50, 50, 50 );
//         var cube = new THREE.Mesh( geometry, wireframeMaterial );
//         break;
//
//       case 3: //level
//
//         break;
//       default:
//
//     }
//     cube.name = "regionVolume";
//
//     scene.add(cube);
//     objects.push(cube);
//
// }


function removeEntity(object){
  var selectObject = scene.getObjectByName(object.name);
  scene.remove( selectObject );

  animate();
}

function animate() {
  requestAnimationFrame( animate );

  render();
  stats.update();
}

function render() {

  update();
  controls.update();
  renderer.render( scene, camera );
}


function update() {


  ///////************ this is for CSG operations
  // if(meshToReturn != undefined){
  //   console.log("meshToReturn loaded: ", meshToReturn)
  //
  //   var cube = CSG.cube();
  //   var geometryThree  = THREE.CSG.fromCSG(cube);
  //   scene.add(geometryThree);
  //
  //   // var geomModel = THREE.CSG.toCSG(meshToReturn);
  //   // console.log("geom Model: ", geomModel);
  //

  // console.log(gears[0].topGear);
  // }


  // if(gears[1] != undefined){ //at least two boxes for collision detection
  //   var originObj = gears[0].box;
  //   var originPoint = originObj.position.clone();
  //
  //   // console.log(originPoint)
  //   var emptyMeshList = [];
  //   var powerList = [];
  //
  //   for(var i=1; i<gearIdx; i++){
  //     powerList.push(gears[i].powerType);
  //
  //     emptyMeshList.push(gears[i].left);
  //     emptyMeshList.push(gears[i].right);
  //     if(gears[i].top != undefined)
  //         emptyMeshList.push(gears[i].top);
  //   }
  //
  //   //collision detection
  //   for (var vertexIndex = 0; vertexIndex < originObj.geometry.vertices.length; vertexIndex++){
  // 		var localVertex = originObj.geometry.vertices[vertexIndex].clone();
  // 		var globalVertex = localVertex.applyMatrix4( originObj.matrix );
  // 		var directionVector = globalVertex.sub( originObj.position );
  //
  // 		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
  // 		var collisionResults = ray.intersectObjects( emptyMeshList ); //this should exclude self
  // 		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
  //       powerList.forEach((power) => {
  //           if((power != originObj.powerType) && changed) {//&& (collisionOccured === false)){
  // 			     window.alert("Gearboxes are not compatible in power direction");
  //            changed = false;
  //          }
  //       })
  //     }
  // 	}
  //
  // }
}
