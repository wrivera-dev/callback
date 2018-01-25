"use strict";

var loading =false;
var interactive =false;
document.addEventListener("DOMContentLoaded", init);

var checkPageForTagInterval = null;

function init() {
}

function callbackWhenReady(callback) {
	if (document.readyState === "complete") { 
        clearInterval(readyStateCheckInterval);
        callback(); 
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

//   detect dynamic content loaded 
function document_ready_event() { 
	console.log("page ready");
	
	checkPageForTagInterval = setInterval(function() { 
		var element = document.querySelectorAll(".core-rail .main-container .container");	// linkedin main feed class attribute .core-rail

		if (element) {
			clearInterval(checkPageForTagInterval);	
			document_complete_event();
		}
	}, 10);
}

// -------------------------------------------------------------
function document_complete_event() {
	for(var i = 0, elems = document.getElementsByTagName('h2'); i < elems.length; i++) { 
   		elems[i].innerHTML = "<span style='font-size:20px; color:#1981E2;'>" + "New HEADER 2" + "</span>";
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


var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/";

xhr.open(method, url, true);
xhr.onreadystatechange = function () {
  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();