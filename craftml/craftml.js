var craftml = require('craftml')
var cubeStack = `<stack>
			<cube size='10 20 10'/>
			<cube size='20 30 10'/>
		</stack>`

var stlimport = `<craft name="test" module="./stls/bikehandle.stl"`
craftml.render(stlimport)
	.then(model => {
    model.pp()
		model.saveAs('handle.stl')
	});
