"use strict";

var loading =false;
var interactive =false;
document.addEventListener("DOMContentLoaded", init);

var checkPageForTagInterval = null;

function init() {
}

function callbackWhenReady(callback) {
	if (document.readyState === "complete") { // this could be your callWhenYouareReady
        clearInterval(readyStateCheckInterval);
        callback(); // <---- this is the call back
		loading=false;
		interactive = false;
    }
}


var readyStateCheckInterval = setInterval(function() {	
    
    callbackWhenReady(document_ready_event);

	if (document.readyState === "loading") {
		if(loading==false) {
			document_start_loading_event();
			loading=true;
		}
	}
	
	if (document.readyState === "interactive") {
		if(interactive==false) {
			document_loading_event();
			interactive=true;
		}
	}
}, 10);


function document_ready_event() { // <--- this callback is not able to handle dynamic content (ajax) so  we put ***document..ready substitute  onreadystatechange
	// a new check in order to detect dynamic content loaded 
	console.log("page ready");
	
	checkPageForTagInterval = setInterval(function() {	// <--- this checks every 10 ms the page searching for DOM element by class attribute
		var element = document.querySelectorAll(".core-rail .main-container .container");	// linkedin main feed class attribute

		if (element) {
			clearInterval(checkPageForTagInterval);	// <-- element found, stop searching call next callback
			document_complete_event();		// <-- callback
		}
	}, 10);
}

// -------------------------------------------------------------
function document_complete_event() {
	for(var i = 0, elems = document.getElementsByTagName('h2'); i < elems.length; i++) { 
   		elems[i].innerHTML = "<span style='font-size:40px; color:#1981E2;'>" + "Callback Extension: New HEADER 2" + "</span>";
 
	}
	console.log("Tag Detected Document Complete!");
	alert("Hi! Page loaded and Tag detected")
}

function document_loading_event() {
	console.log("loading page");
}

function document_start_loading_event() {
	console.log("start loading page");
}
