//should be global

var modelLoaded = false;
var settings = {
  modelScale: 1.0
}



var panel = new dat.GUI();

var params = {
  loadFile: function(){
    document.getElementById('fileInput').click();
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
  },

  export: function(){
    console.log("export stl")
  }
}
// var modelUI = panel.addFolder( 'Model Scale' );

function handleFileSelect(evt){
  var files = evt.target.files;
  let targetSTLFile = './assets/' + files[0].name;

  //load selected target 3D objects
  loader.load( targetSTLFile, ( geometry ) => {
    geometry.center()
    target3DObject = new THREE.Mesh( geometry, normalMaterial );

    target3DObject.rotation.set(-Math.PI/2, 0, 0);
    target3DObject.name = files[0].name;
    target3DObject.receiveShadow = true;

    scene.add(target3DObject);
    objects.push(target3DObject);

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

function showDiv() {
  // document.getElementById('bbox_shape').style.display = "block";
  // document.getElementById('loadSTL').style.display = "block";
  // document.getElementById('model_rotation').style.display = "block";
}
