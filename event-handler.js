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
  console.log("Selected region method: ", selectionMethod);

  scene.add(sphereRegion);
  transformControlTarget.attach(sphereRegion);
  // objects.push(sphereRegion);

  // example csg operation
  var sphere_bsp = new ThreeBSP( sphereRegion );
  var target_bsp = new ThreeBSP( target3DObject );

  //test
  // var cube_geometry = new THREE.CubeGeometry( 3, 3, 3 );
  // var cube_mesh = new THREE.Mesh( cube_geometry );
  // cube_mesh.position.x = -7;
  // var cube_bsp = new ThreeBSP( cube_mesh );


  var subtract_bsp = target_bsp.subtract( sphere_bsp );
  var result = subtract_bsp.toMesh( lambMaterial );

  result.geometry.computerVertexNormals();
  result.position.set(100,100,100);
  scene.add(result);
}
