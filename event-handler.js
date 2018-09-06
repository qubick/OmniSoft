$(document).click( (event) => {
    var text = $(event.target).text();
    // console.log("what is event target?: ", event.target);

    // if(sphereRegion){
    //   var newPos = sphereRegion.position;
    //   var newRot = sphereRegion.rotation;
    // }
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
    case 68:
      drawingKeyPressed = false;
      // console.log(regionPtsArray)

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
    case 71: // G
      currentSelectRegion = (currentSelectRegion === 4) ? 1 : currentSelectRegion + 1;
      console.log("chaning region selection volume", currentSelectRegion)
      if(currentSelectRegion === 1){ //sphere
        var obj = scene.getObjectByName('torusRegion');
        if(obj){
          scene.remove(obj);
          scene.add(sphereRegion);
        }
      }
      else if (currentSelectRegion === 2){ //sphere -> cube
        //size should be taken from curr region volume
        cubeRegion.name = 'cubeRegion'
        scene.remove( sphereRegion );
        scene.add( cubeRegion );

        transformControlTarget.attach( cubeRegion );
      }
      else if (currentSelectRegion === 3){ //cylinder
        cylinderRegion.name = 'cylinderRegion'
        scene.remove( cubeRegion );
        scene.add( cylinderRegion );

        transformControlTarget.attach( cylinderRegion );
      }
      else if (currentSelectRegion === 4){ //ring
        torusRegion.name = 'torusRegion'
        scene.remove( cylinderRegion );
        scene.add( torusRegion );

        transformControlTarget.attach( torusRegion );
      }
      break;

    case 68: //for drawing
      drawingKeyPressed = true;
      break;
    // to change the type of translation
    case 81: // Q
      transformControlTarget.setSpace( transformControl.space === "local" ? "world" : "local" );
      // objects.pop(sphereRegion);

      break;
    case 17: // ctrl

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


function ReturnTypeofGradient(value){
  //change gradient type
  var regtionSelection = value; //parseInt(evt.target.value);

  sphereRegion.material = gradientMaterial;

  //don't add gradient change slider
  // var gradientInput = document.createElement("input");
  //
  // gradientInput.type  = "range"
  // gradientInput.min   = "10";
  // gradientInput.max   = "50";
  // gradientInput.value = "25";
  // gradientInput.class = "slider"
  // gradientInput.id    = "gradientRange"
  // // gradientInput.onChange = "updateValue(this.value)"
  //
  // document.getElementById('sliderlocation').innerHTML = '<br/> Gradient stops: ';
  // document.getElementById('gradientlocation').appendChild(gradientInput);

}

function ReturnRegionSelecMethod(value){

  currRegionSelectMethod = value; //parseInt(evt.target.value);

  console.log("selected Method to create the region: ", currRegionSelectMethod);

  if (currRegionSelectMethod === 1){
    // currentSelectRegion = VOLUME;

    //need to create the volume primitive selection list first
    scene.add( sphereRegion );
    transformControlTarget.attach(sphereRegion);

  }

  else if (currRegionSelectMethod === 2){

    //create the interaction type option list here
    var newDiv = document.createElement('div');
    newDiv.id = "interaction_type"

    document.getElementById('interactionSelectorLocation').appendChild(newDiv)

    $('#interaction_type').ddslick({
      data: interaction_type,
      width: 300,
      selectText: "Select Interaction Type",
      imagePosition: "right",
      onSelected: function(event) {
        ReturnDesiredInteraction(event.selectedData.value)
      }
    });
  }

  else if (currRegionSelectMethod === 3){ // free drawing
    scene.add( mouseHelper );
  }
  //add dat.UI panel to create infill only when region is LoadDesiredInteraction
  panel.add(params, 'createInfill').name('Create Infill');

}

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
