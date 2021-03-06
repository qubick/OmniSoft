var pointsOfIntersectRegion = new THREE.Geometry(); //it's saving 2D vectors of soft region
var pointOfIntersectRegion = new THREE.Vector3();

var pointsOfIntersectObject = new THREE.Geometry(); //it's saving 2D vectors of target 3D object
var pointOfIntersectObject = new THREE.Vector3();

var pointMaterial1 = new THREE.PointsMaterial({
  size:.5,
  color: "red"
});
var pointMaterial2 = new THREE.PointsMaterial({
  size:.5,
  color: "green"
});

var a = new THREE.Vector3()
  ,b = new THREE.Vector3()
  ,c = new THREE.Vector3();

var planePointA = new THREE.Vector3()
    ,planePointB = new THREE.Vector3()
    ,planePointC = new THREE.Vector3();

var lineAB, lineBC, lineCA;

function cutInPlaneToGet2DVectors(){

  var planeGeom = new THREE.PlaneGeometry(300, 300);
  var mathPlane = new THREE.Plane();

  planeGeom.rotateX(-Math.PI / 2);

  var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
    color: "lightgray",
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  }));

  // transformControlTarget.attach(plane)
  // plane.position.y = -10;
  // plane.position.set(sphereRegion.position.x, shpereRegion.position.y, shpereRegion.position.z)
  scene.add(plane);

  plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
  plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
  plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
  mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

  // for region selection Vector2D
  // sphereRegion.geometry.faces.forEach( (face) => {
  //   sphereRegion.localToWorld(a.copy(sphereRegion.geometry.vertices[face.a]));
  //   sphereRegion.localToWorld(b.copy(sphereRegion.geometry.vertices[face.b]));
  //   sphereRegion.localToWorld(c.copy(sphereRegion.geometry.vertices[face.c]));
  //
  //   // console.log("what's a??", a)
  //   lineAB = new THREE.Line3(a, b);
  //   lineBC = new THREE.Line3(b, c);
  //   lineCA = new THREE.Line3(c, a);
  //
  //   setPointOfIntersection('region', lineAB, mathPlane);
  //   setPointOfIntersection('region', lineBC, mathPlane);
  //   setPointOfIntersection('region', lineCA, mathPlane);
  // });


  //when we decide to output vectors of segmented walls
  resultingWalls.geometry.faces.forEach( (face) => {
    resultingWalls.localToWorld(a.copy(resultingWalls.geometry.vertices[face.a]));
    resultingWalls.localToWorld(b.copy(resultingWalls.geometry.vertices[face.b]));
    resultingWalls.localToWorld(c.copy(resultingWalls.geometry.vertices[face.c]));

    // console.log("what's a??", a)
    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);

    setPointOfIntersection('region', lineAB, mathPlane);
    setPointOfIntersection('region', lineBC, mathPlane);
    setPointOfIntersection('region', lineCA, mathPlane);
  });

  // for target 3D object Vector2D
  target3DObject.geometry.faces.forEach( (face) => {

    target3DObject.localToWorld(a.copy(target3DObject.geometry.vertices[face.a]));
    target3DObject.localToWorld(b.copy(target3DObject.geometry.vertices[face.b]));
    target3DObject.localToWorld(c.copy(target3DObject.geometry.vertices[face.c]));

    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);

    setPointOfIntersection('object', lineAB, mathPlane);
    setPointOfIntersection('object', lineBC, mathPlane);
    setPointOfIntersection('object', lineCA, mathPlane);
  });

  var pointsRegion = new THREE.Points(pointsOfIntersectRegion, pointMaterial1);
  var pointsObject = new THREE.Points(pointsOfIntersectRegion, pointMaterial2);
  var linesRegion = new THREE.LineSegments(pointsOfIntersectRegion, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));
  var linesObject = new THREE.LineSegments(pointsOfIntersectObject, new THREE.LineBasicMaterial({
    color: 0x000000
  }));

  //remove infill wall objects for now to only see 2D vectors

  scene.add(pointsRegion);
  scene.add(pointsObject);
  scene.add(linesRegion);
  scene.add(linesObject);

}

function setPointOfIntersection(target, line, plane){

  // console.log(pointsOfIntersectRegion)
  if(target === 'region'){
    pointOfIntersectRegion = plane.intersectLine(line);

    if(pointOfIntersectRegion){
      pointsOfIntersectRegion.vertices.push(pointOfIntersectRegion.clone())
    }
  }
  else if(target === 'object'){
    pointOfIntersectObject = plane.intersectLine(line);

    if(pointOfIntersectObject){
      pointsOfIntersectObject.vertices.push(pointOfIntersectObject.clone())
    }
  }
}
