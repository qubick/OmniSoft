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
    // to change the type of volume
    case 71: // G
      currentSelectRegion = (currentSelectRegion === 4) ? currentSelectRegion + 1 : 0;
      if(currentSelectRegion === 1){ //sphere

      }
      else if (currentSelectRegion === 2){ //cube

      }
      else if (currentSelectRegion === 3){ //cylinder

      }
      else if (currentSelectRegion === 4){ //torus

      }
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


function ReturnTypeofGradient(evt){
  //change gradient type
  var regtionSelection = parseInt(evt.target.value);

  // var selectObject= scene.getObjectByName("foot_step_volume");
  // selectObject.material = normalMaterial;
  sphereRegion.material = gradientMaterial;

  var gradientInput = document.createElement("input");

  gradientInput.type  = "range"
  gradientInput.min   = "10";
  gradientInput.max   = "50";
  gradientInput.value = "25";
  gradientInput.class = "slider"
  gradientInput.id    = "gradientRange"
  // gradientInput.onChange = "updateValue(this.value)"

  document.getElementById('sliderlocation').innerHTML = '<br/> Gradient stops: ';
  document.getElementById('gradientlocation').appendChild(gradientInput);

}

function ReturnRegionSelecMethod(evt){

  var selectionMethod = parseInt(evt.target.value);

  console.log("selected Method to create the region: ", selectionMethod);

  if (selectionMethod === 1){
    // currentSelectRegion = VOLUME;

    // var newPrimitiveInput = document.createElement("select");
    // var option;
    // var inputData = 'sphere'||'box'||'cylinder'||'torus';
    //
    // inputData.split('||').foreach( (item) => {
    //   console.log("see type of shape primitive")
    //   option = document.createElement( 'option' );
    //   option.value = option.textContent = item;
    //   select.appendChild(option);
    // });
    //
    // newPrimitiveInput.id = 'selectRegionShape';
    // newPrimitiveInput.onchange = 'AddPrimitiveShape(event)';

    //need to create the volume primitive selection list first
    sphereRegion.name = 'sphereRegion'
    scene.add(sphereRegion);
    transformControlTarget.attach(sphereRegion);
  }

  else if (selectionMethod === 2){

    //create the interaction type option list here
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
