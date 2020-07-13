var fs = require('fs');
var Promise = require('promise');
var abs = Math.abs;

//printing params contants
var layerThickness = 0.25;
var printingSpeed = 1800;
var nozzleDiameter = 0.4;
var filamentThickness = 1.75;

//geometry info, later should be able to read from 2D vectors
var bedCenter = {
  x: 100,
  y: 100
}

var square1 = {
  x0: 0,
  y0: 0,
  x1: 30,
  y1: 20
}
var square2 = {
  x0: 5,
  y0: 5,
  x1: 25,
  y1: 15
}

var gcodeFile = 'output.gcode'
var gcodeLines = '';


//center objects
var translate1 = {
  x : bedCenter.x - (square1.x1 - square1.x0),
  y : bedCenter.y - (square1.y1 - square1.y0)
}
var translate2 ={
  x : bedCenter.x - (square1.x1 - square1.x0),
  y : bedCenter.y - (square1.y1 - square1.y0)
}

//get newPos of the objects
square1.x0 += translate1.x
square1.y0 += translate1.y
square1.x1 += translate1.x
square1.y1 += translate1.y
console.log("check square position now: ", square1)


square2.x0 += translate2.x
square2.y0 += translate2.y
square2.x1 += translate2.x
square2.y1 += translate2.y


var travelDistSquare1 = {
  x : abs(square1.x1 - square1.x0),
  y : abs(square1.y1 - square1.y0)
}

console.log("traveldist", travelDistSquare1);

var extrusionNx = (filamentThickness/2)^2 / ((nozzleDiameter/2)^2) * travelDistSquare1.x;
var extrusionNy = (filamentThickness/2)^2 / ((nozzleDiameter/2)^2) * travelDistSquare1.y;

console.log("filament surface: ", Math.pow((filamentThickness/2), 2) );
console.log("nozzle surface: "  , Math.pow((nozzleDiameter/2), 2) );
console.log("extrusion amount: ", extrusionNx, extrusionNy, '\n\n');


//for later
var travelDistSquare2 = {
    x : abs(square2.x1 - square2.x0),
    y : abs(square2.y1 - square2.y0)
}



//create a square
var gcodeLine = 'G0 F4800 X' + square1.x0 + ' Y' + square1.y0 + '\n'
              + 'G1 F' + printingSpeed + ' X' + square1.x1 + ' Y' + square1.y0 + ' E' + extrusionNx + '\n'
              + 'G1 ' + ' X' + square1.x1 + ' Y' + square1.y0 + ' E' + extrusionNy + '\n'
              + 'G1 F' + printingSpeed + ' X' + square1.x1 + ' Y' + square1.y1 + ' E' + extrusionNx + '\n'
              + 'G1 ' + ' X' + square1.x0 + ' Y' + square1.y0 + ' E' + extrusionNy + '\n';

new Promise((resolve, reject) => {
  fs.readFile('./startGcode.txt', 'utf8', (err, data) =>{
    if(err) {
      reject(err);
    }
    else {
      console.log("in promise1(), data: ", data)
      resolve(data);
    }
  });
}).then( (data) => {
  gcodeLines += data;

  fs.writeFile(gcodeFile, gcodeLines, (err)=>{
    if(err)
      console.log("failed to write a new gcode file")
  });
}).then( () => {
  // gcodesChunks.forEach((line, i) => {
  //   fs.appendFile(gcodeFile, line, (err) => {
  //     if(err) console.log("failed to append to file")
  //   });
  // });
  console.log("gcodeLine in promise then(): ", gcodeLine);

  fs.appendFile(gcodeFile, gcodeLine, (err) => {
    if(err) console.log("failed to append to file")
  });
}).then( () => {
  var endGcode = fs.readFile('./endGcode.txt', 'utf8', (err, data) => {
    if(data)
      fs.appendFile(gcodeFile, data, (err) => {
        if(err) console.log("failed to append to file")
      });
    });
}); // end of promise.then





// var endGcode = "
// M107
// G1 F1800 E362.97161
// G0 F4200 X85.750 Y90.750 Z15.000
// ;End GCode
// M104 S0                     ;extruder heater off
// M140 S0                     ;heated bed heater off (if you have it)
// G91                                    ;relative positioning
// G1 E-1 F300                            ;retract the filament a bit before lifting the nozzle, to release some of the pressure
// G1 Z+0.5 E-5 X-20 Y-20 F4200 ;move Z up a bit and retract filament even more
// G28 X0 Y0                              ;move X/Y to min endstops, so the head is out of the way
// M84                         ;steppers off
// G90                         ;absolute positioning
// ;CURA_PROFILE_STRING:eNrtWktv20YQvhJGf8QeUzRWSUqKkwg8JKmdi10YsIsmvhArciRtTXKJ3aVl2dB/78wuSVMy3TqN0bykgw1+nJmdnfnmYVgZX4GKFyDmCxP5g3DsLXmWxWYhkssCtHaYAqN4YoQsYij4NIPoXFXgaZmJNM6sia7G2JsJNJJCoYVZRb5XghI5GBSbwkwqiEVBEs5KIW9uMoi1uAHUHXmlEoWJdQmQRkO/fjSQoxFuKgVRGPSgYdQDDvvAUR84bsEppBunHfierspSKhP9LgvwyowbvEMe83QBGkPi4FomTiuexXBtVGXfvZVm4S1FCbGRS1DREc80dID4SmZVDlEw9qS8wSgsBGRpLYYx4jmgT6ngNnxRMDgY34fp7vfAYR846gPHXXCWyWUU+P7A72a9zUYH47msChMFXczevnnxYrDBnFwUMT5cQYbX2HiTyHwqinn0Jsu2FES+EU30KuxKLGRJmDeVxsh8g4NDz/LSj5ciNYt4hhpS0cU8Of0LEiSYKC6tsrwClfHS+o4AZsJ5WV/6oDXviO7Q0Pcch+tnMmTLgSvgHUwUGoy/DVx3gETKzMamriMslAhzzJtSS+tauxTIrkwUgOFycXfQnJfRkE63T03MMijmZoG0oiPI2KxCX9s6dwc4Jygm7VOc82uLtG7NEMVSQIrW4AI4Fr2YmZqlrgsYTEWnKbiQOcSGqY4yEb0pFbMqITrGG+kW4sUcm8uLtuRiq+uOv1O8XiF3teFFQh3joMVvujDJl0LxjPpK7anIS+w0uUwbZIp9qRtUTKviMwwjV3NRRONB/WxFdMkToumwQadcwxbp7nBSsdxDttfy2F5AIRM3lcKD7bd3qtQP7UsuFCY6xt5sSdPByELoAF3V+sQkHW2hfWe2GhsnzsQ1lpZSAukXV4UtdhoKmK+YNzl9WGTatq+uDIZEllDEU2F0nwBWOc2LK4yzESZZUKSdWJlVmAzMEBbcPGrqNwGKV3wd7Qdb0Iogl+sTTPUZGIPGdNTBTpVEZkF0hmzBkk07r06QbEpgKzg9ftMDnxNp3wI6VID6CdmmzGCeEKMmZ5lIIGXcvGa3KV+t6acB/EU1vd6bvOVaJEzX7rxmx5Qm5moSVbLOKF6zPzGcKHO7OY7X7AgLAuHugEXTpzS6GJ2D7+rh5g49qhs7wwSkTtE1etel13kHWrqz5x2tRGrT1aJntHoSvPLZ2W3vxFyzyR8FtnSrbyTjacpWslJMLguGsqwjy4h4ZM5/1Zp7rKl7Zt6HAas/ExxsCoN9xbMK9N579LZ5w6fYoSoDrJQYPCQuJmPv5GXYCmCCmB05KWaHDm0UqG/soasHrSRlny2FWTCzAIZNlMnZDP14yT747KNPfmDfYx9+/UiGsJsyKFKNrVJboQu/dpaELu6LBOwiwBbEjm67E2ldK9CRzTLCUopIMM5zvGvIDtvr3n0mN6CkVaovlzI3JOico9D32eFwS6MWZMM8x4sxmgQMXUsuP/0QxudcFPaozcsgdyvDbOYxESxHkvM5MFmw43e/MZ0ogAKDHhyw01pmMBh4GKOm6g6LlL1/V6dmxM56vOrcheqNKtkm6iQY+Q8qWLnUEvZOhT0TM2IgW+AVmDA/YyQC9ojPRAGmCrvbBu0wHIf7GJKh7/+Lsl15HMua0uQMWylzCzWjeUzxIwm3UD8nPuGpgMOIaZkDpdByRmGMsWgsv37BXQB9GLMP+yFSln70s+2CVWV9JLZM1njUegNXUGCFkNk7+v/jpR4qjeforXWUFg0mNJNIkNr3JV9hrY4eNqoNlNgVtCvEVw/70N8HJtiD7GTAIYR0m689W+PhrsU/QYsffX6Ld5PiPOizFP4nU/6XnTtf+zQ5f6C7Tc6WtKTRKaQZYktoOuznTKDA759Agf+kI8ietX/b/4freu/cf9SlZ0Jp8y1d+4kmb/jA6D33P3H6kk6wm9i7if30E3u4m9i7if1jTuzwR5zYuzVlt6ZsrSnDL7mmkE64W212q83Trzaj3WrzVa024dOtNrst6X/bkoaPmp0jdPo7WhgetxoOv69L71bD3Wq4tRqOvrXVkHSGu3Vyt04+7TpZf2+m+y2GFrz7F6v72s+GkEU6EgpwxiYwSPRV5GESXJs5rHnZLqyu+UzBLLEy7aWTSikb4obClACbaERa9DlbLlChrXS7TORVZkSZte1C6cHe5HyBQaXTKLi43liWWxaR0fNnxc8exsR8Tf7xGRVg497f+DEc1Q==
//
// "
