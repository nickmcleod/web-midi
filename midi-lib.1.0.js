// Library for MIDI interaction using Web MID API.
// Specification at http://www.w3.org/TR/webmidi
// --------------------------------------------------
// Usage:
//		myCallback = function(InitResponse) { ... };
// 		midi = new WebMidi.midi();
//		midi.init(WebMidi.SYSEX_NOT_REQUIRED, myCallback);

// Define namespace object for all library functions
var WebMidi = WebMidi || {};


// Library constants
WebMidi.INIT_FAILURE = 0;
WebMidi.INIT_SUCCESS = 1;

WebMidi.SYSEX_NOT_REQUIRED = 0;
WebMidi.SYSEX_REQUIRED = 1;

// Create working 'static' object in namespace
WebMidi.midi = function() {
	
	// Private class used for basic feedback in initialisation and setup of event callbacks.
	var InitResponse = function (result, message, data) {
		// public members 
		this.result = result || WebMidi.INIT_FAILURE;
		this.message = message || 'Object not yet initialised';
		this.data = data || {inputs: [], outputs: []};
	};
	
	var MidiPort = function(id, name, state, isConnected) {
		this.id = id;
		this.name = name;
		this.state = state;
		this.isConnected = isConnected;
	}
	
	// Scope var to hold user callback to invoke when we have a result.
	var userCallback; // will call userCallback(InitResult) 
	
	// Request platform access to MIDI interface.
	// Params: 
	//		sysex - WebMidi.SYSEX_REQUIRED if access to MIDI sysex data required, WebMidi.SYSEX_NOT_REQUIRED otherwise
	//		callback - user function called when response from platform is ready 
	this.init = function (sysex, callback) {
	
		//build API options object from params
		var options = { sysex: sysex == WebMidi.SYSEX_REQUIRED };
		
		//save user callback for later use
		userCallback = callback;
		
		//call API which uses Promise-style callback handling
		var promise;
		try {
			promise = navigator.requestMIDIAccess(); //TODO add options
		} catch (error) {
			returnError("API NOT SUPPORTED [" + error.message + "]");
			return;
		}
		
		if (!promise) {
			returnError("INVALID API RESULT [No promise object returned]");
			return;
		}
		
		//with Promise objects, we can add handlers AFTER events have occurred and they will still fire - nice!
		try {
			promise.then(midiCallbackOk, midiCallbackFail);
		} catch (error) {
			returnError("FAILED ADDING PROMISE HANDLERS [" + error.message + "]");
			return;
		}
	}
	
	// Callback invoked by API (via Promise) if request for MIDI access is successful.
	// Params:
	//		midiAccess - MIDIAccess object as defined by API. 
	var midiCallbackOk = function (midiAccess) {
		
		//alert("API Callback - OK");
		console.log("API Callback - OK");
		var access = midiAccess;
		var inputPorts = [];
		var outputPorts = [];
		
		//get list of all detected MIDI input ports
		midiAccess.inputs.forEach( function(key,port) {
			inputPorts.push(new MidiPort(port, key.name, key.state, key.connection));
		});
		
		//get list of all detected MIDI output ports 
		midiAccess.outputs.forEach( function(key,port) {
			outputPorts.push(new MidiPort(port, key.name, key.state, key.connection));
		});
	
		userCallback(new InitResponse(WebMidi.INIT_SUCCESS, "API access successful!", { inputs: inputPorts, outputs: outputPorts}));	
	}
	
	// Callback invoked by API (via promise) if request for MIDI access is unsuccessful.
	// Params:
	//		error - DOMException object as defined by API.
	var midiCallbackFail = function (error) {
		//alert("API Callback - Fail");
		console.log("API Callback - Fail");
		var errstr = error.toString();
		returnError(errstr);
	}
	
	var returnError = function (error_string) {
		//alert("Returning error to user: " + error_string);
		console.log("Returning error to user: " + error_string);
		userCallback(new InitResponse(WebMidi.INIT_FAILURE, "API ACCESS FAILED [" + error_string + "]"));
	}


};

