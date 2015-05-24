
// functions for opening and testing MIDI connections.

var err;
var access;

function midiCallbackOk(midiAccess) {
	//alert("OK");
	access = midiAccess;
	document.getElementById("support").innerHTML += "[SUCCESS] API call succeeded! Detected devices are listed below.";
	
	//list all detected MIDI input ports
	var inDiv = document.getElementById("inputs");
	inDiv.appendChild(document.createTextNode("Number of inputs: " + midiAccess.inputs.size));
	var inList = document.createElement("ul");
	inDiv.appendChild(inList);
	var item;
	midiAccess.inputs.forEach( function(key,port) {
		item = document.createElement("li");
		item.appendChild(document.createTextNode("Port " + port + ": " + key.name + " [state: " + key.state + ", connection: " + key.connection + "]"));
		inList.appendChild(item);
	});
	
	//list all detected MIDI output ports 
	var outDiv = document.getElementById("outputs");
	outDiv.appendChild(document.createTextNode("Number of outputs: " + midiAccess.outputs.size));
	var outList = document.createElement("ul");
	outDiv.appendChild(outList);
	midiAccess.outputs.forEach( function(key,port) {
		item = document.createElement("li");
		item.appendChild(document.createTextNode("Port " + port + ": " + key.name + " [state: " + key.state + ", connection: " + key.connection + "]"));
		outList.appendChild(item);
	});
	
}

function midiCallbackErr(error) {
	//alert(error);
	var errstr = error.toString();
	document.getElementById("support").innerHTML += "[FAILED] API call failed with error: " + errstr;
	
	document.getElementById("inputs").appendChild(document.createTextNode("N/A"));
	document.getElementById("outputs").appendChild(document.createTextNode("N/A"));
}


function checkMidi() {
	//alert("Starting...");
	
	var promise;
	try {
		promise = navigator.requestMIDIAccess();
	}
	catch (error) {
		midiCallbackErr(error);
		return;
	}
	
	if (!promise) {
		midiCallbackErr("Invalid return from API call (empty)");
		return;
	}
	
	//with Promise objects, we can add handlers after events have occurred and they will still fire - nice! 
	promise.then(midiCallbackOk, midiCallbackErr);
}
