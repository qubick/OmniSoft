//############################################################
// Purpose of this function is to write Gcode from 2D vectors of region + rigid objects
// targetObject should be filled with rigid infills,
// resultingWalls (intersection of region and infill walls) to create vectors in plane
//############################################################

var parseSVG  = require('svg-path-parser');
var flatten   = require('flat');
var fs        = require('fs');

var nozzleSize = 0.4;
var filamentThickness = 1.75;
var gcodeInit = 'M109 S220.000000 \n\
M190 S50 ;Uncomment to add your own bed temperature line \n\
G21        ;metric values \n\
G91        ;relative positioning \n\
M82        ;set extruder to absolute mode \n\
M107       ;start with the fan off \n\
G28 X0 Y0  ;move X/Y to min endstops \n\
G28 Z0     ;move Z to min endstops \n\
G1 Z15.0 F9000 ;move the platform down 15mm \n\
G92 E0                  ;zero the extruded length \n\
G1 F200 E3              ;extrude 3mm of feed stock \n\
G92 E0                  ;zero the extruded length again \n\
G1 F9000 \n\
;Put printing message on LCD screen \n\
M117 Printing... \n'
