// Requires midi-lib.1.0.js


function initApp() {
    // start MIDI init and wait for result
    var midi = new WebMidi.midi();
    midi.init(WebMidi.SYSEX_REQUIRED, onFinished);
}


// Called when WebMidi has init results back from platform
// Params:
//      initResult - WebMidi.Result object send back from library
function onFinished(initResult) {
    
    if (initResult.result == WebMidi.INIT_SUCCESS) {
        //success
        displayResult(initResult.message);
        displayResult("<br />Detected ports are displayed below.");
        
        displayPorts("inputs",initResult.data.inputs);
        displayPorts("outputs",initResult.data.outputs);
    } else {
        //failure
        displayResult(initResult.message);
    }
}

function displayResult(msg) {
    document.getElementById("result").innerHTML += msg;
}

function displayPorts(parentId, ports) {

    //create a new list UI element	
	var list = document.createElement("ul");
	var item;
	ports.forEach( function(port) {
		item = document.createElement("li");
		item.appendChild(document.createTextNode("Port " + port.id + ": " + port.name + " [state: " + port.state + ", connection: " + port.connection + "]"));
		list.appendChild(item);
	});
	
	//append summary and new list to specified UI element
	var div = document.getElementById(parentId);
	div.appendChild(document.createTextNode("Number of ports: " + ports.length));
	div.appendChild(list);
}