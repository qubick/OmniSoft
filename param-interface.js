//should be global

var modelLoaded = false;
var settings = {
  modelScale: 1.0,
  movePlane: 1.0
}

//see if geometry can be kept
var targetGeometry;


var panel = new dat.GUI();

var params = {
  loadFile: function(){
    document.getElementById('fileInput').click();
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
  },

  createInfill: function(){
    //get softness region information frist
    createInfillWalls();
    getModifiedTarget();
  },

  export: function(){
    //when added region volume, add intersection plane
    var resultObject = getUnionObject( adjustedTarget, resultingWalls );
    var result = exporter.parse( resultObject );
    saveString (result, 'infill.stl');

    // cutInPlaneToGet2DVectors(); //it isn't required for now
  }
}

function handleFileSelect(evt){
  var files = evt.target.files;
  let targetSTLFile = './assets/' + files[0].name;

  //load selected target 3D objects
  loader.load( targetSTLFile, ( geometry ) => {
    geometry.center()
    target3DObject = new THREE.Mesh( geometry, lambMaterial );

    target3DObject.rotation.set(-Math.PI/2, 0, 0);
    target3DObject.name = files[0].name;
    target3DObject.receiveShadow = true;
    target3DObject.castShadow = true;
    target3DObject.geometry = new THREE.Geometry().fromBufferGeometry(target3DObject.geometry);


    scene.add(target3DObject);
    // objects.push(target3DObject); //add to select & translatable
    transformControlTarget.attach(target3DObject);

    //once load, add UI elements
    panel.add(settings, 'modelScale', -1, 5, 0.1).onChange(function(){
      target3DObject.scale.set(settings.modelScale, settings.modelScale, settings.modelScale);
    });
    panel.add(params, 'export').name('Export Model');

  });
}


function createPanel(){

  // panel.add(params, 'loadFile').name('Load 3D Model');

}


function removePanel(gearType){
  topBoxUI.close();
  delete topBoxUI;
}
