M109 S250.000000
;Sliced at: Wed 07-02-2018 16:38:31
;Basic settings: Layer height: 0.2 Walls: 0.8 Fill: 5
;Print time: 2 hours 46 minutes
;Filament used: 6.58m 19.0g
;Filament cost: None
;M190 S70 ;Uncomment to add your own bed temperature line
;M109 S250 ;Uncomment to add your own temperature line
G21        ;metric values
G91        ;relative positioning
M82        ;set extruder to absolute mode
M107       ;start with the fan off
G28 X0 Y0  ;move X/Y to min endstops
G28 Z0     ;move Z to min endstops
G1 Z15.0 F9000 ;move the platform down 15mm
G92 E0                  ;zero the extruded length
G1 F200 E3              ;extrude 3mm of feed stock
G92 E0                  ;zero the extruded length again
G1 F9000
;Put printing message on LCD screen
M117 Printing...
