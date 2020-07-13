
var a = [
  [1,0],
  [0,0]
];

var b = [
  [1,1],
  [1,1]
];
var ab = [];

console.log(a, b);

for(var i=0; i<2; i++){
  for(var j=0; j<2; j++){
      a[i][j] = 1 - a[i][j];
      console.log("a: ", a);
      var res = amultiplyb(a[i][j], b[i][j]);
      console.log(res);
  }
}

function amultiplyb(a,b){
  return res = a * b
  console.log(res)
}
