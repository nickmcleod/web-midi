// Requires midi-lib.1.0.js

var urlParams;
var optionAccessSysEx = false;

function initApp() {
    //collect and handle url parameters (API access options)
    initParams();
    
    // start MIDI init and wait for result
    var midi = new WebMidi.midi();
    midi.init(optionAccessSysEx ? WebMidi.SYSEX_REQUIRED : WebMidi.SYSEX_NOT_REQUIRED, onFinished);
}

// sets sysex option by reloading with url params
function setSysEx() {
    optionAccessSysEx = document.getElementById("sysex").checked;
    if (optionAccessSysEx)
        window.location.href="https://www.stonepiano.net?sysex=1";
    else
        window.location.href="http://www.stonepiano.net";
}

function getUrlParams() {
    var qs = document.location.search;
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

// collect url params and handles options
function initParams() {
    //collect params into object properties
    urlParams = getUrlParams();
    
    //handle sysex option
    optionAccessSysEx = (urlParams.sysex == "1");
    document.getElementById("sysex").checked = optionAccessSysEx;
}


// Called when WebMidi has init results back from platform
// Params:
//      initResult - WebMidi.Result object send back from library
function onFinished(initResult) {
    
    if (initResult.result == WebMidi.INIT_SUCCESS) {
        //success
        displayResult(initResult.message);
        displayResult("<br />Detected ports are displayed below.");
        
        displayPorts("inputs", initResult.data.inputs);
        displayPorts("outputs", initResult.data.outputs);
    } else {
        //failure
        displayResult(initResult.message);
        displayPorts("inputs", null);
        displayPorts("outputs", null);
    }
}

function displayResult(msg) {
    document.getElementById("result").innerHTML += msg;
}

function displayPorts(parentId, ports) {

    //append summary and new list to specified UI element
	var div = document.getElementById(parentId);
	if (!ports) {
	    div.appendChild(document.createTextNode("N/A"));
	    return;
	}
	
    //create a new list UI element	
	var list = document.createElement("ul");
	var item;
	ports.forEach( function(port) {
		item = document.createElement("li");
		item.appendChild(document.createTextNode("Port " + port.id + ": " + port.name + " [state: " + port.state + ", connection: " + port.connection + "]"));
		list.appendChild(item);
	});
	
	//append summary and new list to specified UI element
	div.appendChild(document.createTextNode("Number of ports: " + ports.length));
	div.appendChild(list);
}