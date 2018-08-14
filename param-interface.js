//should be global

var modelLoaded = false;
var settings = {
  modelScale: 1.0
}

//see if geometry can be kept
var targetGeometry;


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
    target3DObject = new THREE.Mesh( geometry, lambMaterial );

    target3DObject.rotation.set(-Math.PI/2, 0, 0);
    target3DObject.name = files[0].name;
    target3DObject.receiveShadow = true;
    target3DObject.castShadow = true;


    scene.add(target3DObject);
    objects.push(target3DObject); //add to select & translatable
    transformControlTarget.attach(target3DObject);

    panel.add(settings, 'modelScale', -1, 5, 0.1).onChange(function(){
      target3DObject.scale.set(settings.modelScale, settings.modelScale, settings.modelScale);
    });

    panel.add(params, 'export').name('Export Model');


    targetGeometry = geometry;
  });
}


function ReturnRegionSelecMethod(evt){
  var selectionMethod = parseInt(evt.target.value);
  console.log("Selected region method: ", selectionMethod);

  scene.add(sphereRegion);
  transformControlTarget.attach(sphereRegion);
  // objects.push(sphereRegion);

  // example csg operation
  console.log( sphereRegion );
  var sphere_bsp = new ThreeBSP( sphereRegion );
  console.log(targetGeometry);
  var target_bsp = new ThreeBSP( targetGeometry );

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
