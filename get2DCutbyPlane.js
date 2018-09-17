var pointsOfIntersect = new THREE.Geometry(); //it's saving 2D vectors of soft region
var pointOfIntersect = new THREE.Vector3();

var pointMaterial = new THREE.PointsMaterial({
  size:.5,
  color: "green"
});

var planeGeom = new THREE.PlaneGeometry(300, 300);
var mathPlane = new THREE.Plane();

planeGeom.rotateX(-Math.PI / 2);

var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
  color: "pink",
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
}));

var a = new THREE.Vector3()
  ,b = new THREE.Vector3()
  ,c = new THREE.Vector3();

var planePointA = new THREE.Vector3()
    ,planePointB = new THREE.Vector3()
    ,planePointC = new THREE.Vector3();

var lineAB, lineBC, lineCA;

function cutInPlaneToGet2DVectors(objGeometry){

  plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
  plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
  plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
  mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

  // targetGeometry.geometry = new THREE.Geometry().fromBufferGeometry(targetGeometry.geometry);
  objGeometry.geometry.faces.forEach( (face) => {
    objGeometry.localToWorld(a.copy(objGeometry.geometry.vertices[face.a]));
    objGeometry.localToWorld(b.copy(objGeometry.geometry.vertices[face.b]));
    objGeometry.localToWorld(c.copy(objGeometry.geometry.vertices[face.c]));

    // console.log("what's a??", a)
    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);

    setPointOfIntersection(lineAB, mathPlane);
    setPointOfIntersection(lineBC, mathPlane);
    setPointOfIntersection(lineCA, mathPlane);
  });

  var points = new THREE.Points(pointsOfIntersect, pointMaterial);
  var lines = new THREE.LineSegments(pointsOfIntersect, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));

  scene.add(points);
  scene.add(lines);

  console.log("points: ", points)
  var extrudeShape = [];
  points.geometry.vertices.forEach( (pts) => {
    let pts2D = new THREE.Vector2(pts.x, pts.z);
    extrudeShape.push( pts2D );
  });

  let shape = new THREE.Shape(extrudeShape);
  let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  var planeCutRegion = new THREE.Mesh( geometry, normalMaterial );
  planeCutRegion.rotation.set(Math.PI/2, 0, 0);
  // mesh.translateZ(-regionHeight);
  planeCutRegion.name = "planeCutRegion"

  scene.add( planeCutRegion );
  transformControlTarget.attach( planeCutRegion );
}

function setPointOfIntersection(line, plane){

    pointOfIntersect = plane.intersectLine(line);

    if(pointOfIntersect){
      pointsOfIntersect.vertices.push(pointOfIntersect.clone())
    }
}
