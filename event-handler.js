$(document).click( (event) => {
    var text = $(event.target).text();
    // console.log("what is event target?: ", event.target);

    // if(sphereRegion){
    //   var newPos = sphereRegion.position;
    //   var newRot = sphereRegion.rotation;
    // }
});

window.addEventListener( 'keydown', function( event ){
  switch(event.keyCode) {
    case 81: // Q
      transformControlTarget.setSpace( transformControl.space === "local" ? "world" : "local" );
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


function ReturnTypeofGradient(evt){
  //change gradient type
  var regtionSelection = parseInt(evt.target.value);

  // var selectObject= scene.getObjectByName("foot_step_volume");
  // selectObject.material = normalMaterial;
  sphereRegion.material = gradientMaterial;

  var gradientInput = document.createElement("input");

  gradientInput.type = "range"
  gradientInput.min = "10";
  gradientInput.max = "50";
  gradientInput.value = "25";
  gradientInput.class = "slider"
  gradientInput.id = "gradientRange"
  // gradientInput.onChange = "updateValue(this.value)"

  document.getElementById('sliderlocation').innerHTML = '<br/> Gradient stops: ';
  document.getElementById('gradientlocation').appendChild(gradientInput);

}

function ReturnRegionSelecMethod(evt){

  var selectionMethod = parseInt(evt.target.value);

  sphereRegion.name = 'sphereRegion'
  scene.add(sphereRegion);
  transformControlTarget.attach(sphereRegion);


  //add dat.UI panel to create infill only when region is LoadDesiredInteraction
  panel.add(params, 'createInfill').name('Create Infill');

}

function getSubtractionObject(source, target){
  // example csg operation
  var source_bsp = new ThreeBSP( source );
  // do this only if gutInPlaceToGet2DVectors() isn't called
  // when target3DObject is just fromBufferGeometry
  //target3DObject.geometry = new THREE.Geometry().fromBufferGeometry(target3DObject.geometry); target3DObject.geometry = new THREE.Geometry().fromBufferGeometry(target3DObject.geometry);

  var target_bsp = new ThreeBSP( target );
  var subtract_bsp = target_bsp.subtract( source_bsp );
  var result = subtract_bsp.toMesh( lambMaterial );

  result.geometry.computeVertexNormals();
  result.position.set(100,100,100);
  scene.add( result );
}

function getIntersectObject(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var intersect_bsp = target_bsp.intersect( source_bsp );
  var result = intersect_bsp.toMesh( material );

  result.geometry.computeVertexNormals();
  result.position.set(-50,0,0); //tentative

  console.log("See intersection result: ", result )

  scene.add( result );
}

function getUnionObject(source, target){

  var source_bsp = new ThreeBSP( source );
  var target_bsp = new ThreeBSP( target );
  var subtract_bsp = target_bsp.union( source_bsp );
  var result = subtract_bsp.toMesh( lambMaterial );

  result.geometry.computeVertexNormals();
  result.position.set(100,100,100);

  return result;
}
