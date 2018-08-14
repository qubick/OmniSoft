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

function ReturnReferenceMaterial(evt){

  var shoreAScale = evt.target.value;
  var input = document.createElement("input");

  input.type = "range"
  input.min = "10";
  input.max = "50";
  input.value = shoreAScale;
  input.class = "slider"
  input.id = "softnessRange"
  input.onChange = "updateValue(this.value)"

  var textInput = document.createElement("text");
  textInput.value = '<br/> Shore A scale: ' + shoreAScale;
  textInput.id = "shoreAScaleValue"

  document.getElementById('sliderlocation').appendChild(document.createElement("br"));
  document.getElementById('sliderlocation').innerHTML = '<br/> Shore A scale: ' + shoreAScale;
  document.getElementById('sliderlocation').appendChild(input);

}
