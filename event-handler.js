$(document).click( (event) => {
    var text = $(event.target).text();
});

var extrudeSettings = {
	steps: 2,
	depth: 5,
	bevelEnabled: true,
	bevelThickness: 1,
	bevelSize: 1,
	bevelSegments: 1
};

window.addEventListener( 'keyup', ( event ) => {
  switch(event.keyCode) {
    case 91: // 'cmd' : drawing
      drawingKeyPressed = false;

      //add the last point to close the loop
      // pointsOfDrawing.vertices.push(pointsOfDrawing.vertices[0]);
      regionArray[regionCnt] = pointsOfDrawing;
      var lines = new THREE.LineSegments(regionArray[regionCnt], lineMaterial);
      scene.add(lines);

      // create lines by 2D informations
      var extrudeShape = [];
      regionArray[regionCnt].vertices.forEach( (pts) => {
        let pts2D = new THREE.Vector2(pts.x, pts.z);
        extrudeShape.push( pts2D );
      });

      // let regionHeight = regionArray[regionCnt].vertices[0].y;
      let shape = new THREE.Shape(extrudeShape);
      let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      freeDrawnRegion = new THREE.Mesh( geometry, normalMaterial );
      freeDrawnRegion.rotation.set(Math.PI/2, 0, 0);
      // mesh.translateZ(-regionHeight);
      freeDrawnRegion.name = "freeDrawnRegion"

      scene.add( freeDrawnRegion );
      transformControlTarget.attach( freeDrawnRegion );

      //reset for the next selection of drawings
      pointsOfDrawing = new THREE.Geometry();
      regionCnt++;

      break;
  }
});

window.addEventListener( 'keydown', ( event ) => {

  switch(event.keyCode) {
    // to change the type of volume
    case 71: // G, shape primitive change
      currentSelectRegion = (currentSelectRegion === 3) ? 0 : currentSelectRegion + 1;
      if(currentSelectRegion === 0){ //sphere
        var obj = scene.getObjectByName('torusRegion');
        if(obj){
          scene.remove( obj );
          scene.add( sphereRegion );

          transformControlTarget.attach( sphereRegion );
        }
      }
      else if (currentSelectRegion === 1){ //sphere -> cube
        //size should be taken from curr region volume
        cubeRegion.name = 'cubeRegion'
        scene.remove( sphereRegion );
        scene.add( cubeRegion );

        transformControlTarget.attach( cubeRegion );
        transformControlTarget.remove( sphereRegion );
      }
      else if (currentSelectRegion === 2){ //cylinder
        cylinderRegion.name = 'cylinderRegion'
        scene.remove( cubeRegion );
        scene.add( cylinderRegion );

        transformControlTarget.attach( cylinderRegion );
        transformControlTarget.remove( cubeRegion );
      }
      else if (currentSelectRegion === 3){ //ring
        torusRegion.name = 'torusRegion'
        scene.remove( cylinderRegion );
        scene.add( torusRegion );

        transformControlTarget.remove( cylinderRegion );
        transformControlTarget.attach( torusRegion );
      }
      break;

    case 91: //cmd, drawing
      drawingKeyPressed = true;
      break;

    // to change the type of translation
    case 81: // Q
      transformControlTarget.setSpace( transformControl.space === "local" ? "world" : "local" );
      // objects.pop(sphereRegion);
      break;

    case 83: //s: scale
      console.log("scale mode");
      transformControlTarget.setMode("scale");
      break;

    case 87: //w: translate
      console.log("translating mode");
      transformControlTarget.setMode("translate");
      break;

    case 82: // r: rotate
      console.log("rotation mode");
      transformControlTarget.setMode("rotate");
      break;
  }
});


function ReturnSelectedPrimitive(value){

  currPrimitiveId = value; //parseInt(evt.target.value);

  if (currPrimitiveId === 1){ //cylinder
    scene.add( cylinderRegion );
    transformControlTarget.attach(cylinderRegion);
    currPrimitiveName = 'cylinder'
    }
  else if (currPrimitiveId === 2){ //cube
      scene.add( cubeRegion );
      transformControlTarget.attach(cubeRegion);
      currPrimitiveName = 'cube';
  }
  else if (currPrimitiveId === 3){ // sphere
      scene.add( sphereRegion );
      transformControlTarget.attach(sphereRegion);
      currPrimitiveName = 'sphere';
  }
  else if (currPrimitiveId === 4){ // torus
      scene.add( torusRegion );
      transformControlTarget.attach(torusRegion);
      currPrimitiveName = 'torus';
  }

  var obj = scene.getObjectByName(prevPrimitiveName);
  console.log("previous primitive Name: ", prevPrimitiveName);
  console.log("current object: ", obj);
  if(obj){
    scene.remove( obj );
  }
  prevPrimitiveName = currPrimitiveName;

  //add dat.UI panel to export
  panel.add(params, 'cutPouch').name('Create Pocket');

}


//to enable export buttons
function saveString (text, filename ){
  save ( new Blob( [text], {type: 'text/plain'}), filename );
}

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save (blob, filename){
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}


// compute intervals for infill walls
function getIntervalbySoftnessInput(){

  var S = document.getElementById('softnessRange').value;
  var ld = Math.exp(-1/0.408 * (Math.log(S) -Math.log(38.2)));

  interval = ld.toFixed(4);

  console.log("retrieved Softness: ", S, " interval: ", interval);

}

//attach event listeners when material is selected
function attachSliderEvents(){

  let slider = document.getElementById("softnessRange")

  slider.oninput = function(){

    let output = document.getElementById("softnessValue")
    output.innerHTML = this.value;

    };

  slider.addEventListener('change', () => {
    console.log("slider value is changed")
    recalculateInfill();
    //here create infill wall meshes ~ change gaps

  });
}
