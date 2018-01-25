"use strict"

document.addEventListener("DOMContentLoaded", init)


function init() {
	console.log(" Popup.js - DOM Ready");
	document.getElementById("save-configuration").addEventListener("click", store_configuration);
	document.getElementById("clear-notifications").addEventListener("click", clear_notifications);
	retrieve_configuration();
	retrieve_notifications();
}

function store_configuration() {
	console.log("popup.js - store_configuration");

	var apiKey = $("#apikey").val();
	var secretKey = $("#secretkey").val();
	var enableSendOrders = $("#enable-send-order").is(':checked') ? 1 : 0;
	//console.log(apiKey + " - " + secretKey + " - " + enableSendOrders );

	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"method": "save-configuration-request", "conf": {"apiKey": apiKey.trim(), "secretKey": secretKey.trim(), "enableSendOrders": enableSendOrders} });
	});
}

function retrieve_configuration() {	
	console.log("popup.js - retrieve_configuration");
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"method": "load-configuration-request"} );
   });
}

function retrieve_notifications() {
	console.log("popup.js - retrieve_notifications");
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"method": "load-notifications-request"} );
   });
}


function generate_html_for_notification(obj) {
	var icon_str="";
	var message = obj.datetime + " - " + obj.symbol + "("+obj.side+")"+ " - qta:" + obj.amount;
	//console.log(obj);
	if(obj.type==='INFO') {
		icon_str = '<span class=" glyphicon glyphicon-transfer" style="padding-top: 3px;padding-left: 5px;color: cadetblue;"> </span>';
		$('#notifications-lists').append('<li class="list-group-item">'+icon_str+'<span class="badge pull-right" style="width: 90%;font-size:10px;background-color: cadetblue;">'+message+'</span></li>');
	}else if(obj.type==='ORDER') {
		message = message+ " " + obj.status;
		if(obj.status==='FILLED')
			icon_str = '<span class="glyphicon glyphicon-ok" style="padding-top: 3px;padding-left: 5px;color: green;"> </span>';
		else
			icon_str = '<span class="glyphicon glyphicon-ok" style="padding-top: 3px;padding-left: 5px;color: red;"> </span>';		
		$('#notifications-lists').append('<li class="list-group-item">'+icon_str+'<span class="badge pull-right" style="width: 90%;font-size:10px;background-color: red;">'+message+'</span></li>');
	}else{
		icon_str = '<span class=" glyphicon glyphicon-transfer" style="padding-top: 3px;padding-left: 5px;color: orange;"> </span>';
		$('#notifications-lists').append('<li class="list-group-item">'+icon_str+'<span class="badge pull-right" style="width: 90%;font-size:10px;background-color: orange;">'+message+'</span></li>');
	}
	
	
	
}

function add_notification(obj) {
	generate_html_for_notification(obj);
}

function clear_notifications() {
	console.log("popoup.js - clear notifications");
	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"method": "clear-notifications-request"} );
   });
	
}


$(document).ready(function (){
	console.log(" Popup.js document ready");

});


//for listening any message which comes from runtime
chrome.runtime.onMessage.addListener(messageReceived);

function messageReceived(obj, sender, sendResponse) {
	// Do your work here
	console.log("Popup.js  messageReceived ->", obj, sender);
	
	if(obj.method === "load-configuration-reply") {
		$("#apikey").val(obj.data.conf.apiKey);
		$("#secretkey").val(obj.data.conf.secretKey);
		$("#enable-send-order").prop('checked', obj.data.conf.enableSendOrders == 1);
	}
	
	if(obj.method === "ux-alert-detection-notification" || obj.method === "ux-send-order-notification" ||
		obj.method === "ux-alert-order-filled-notification"	) {
		add_notification(obj.data);
	}
	
	
	if(obj.method === "clear-notifications-reply") {
		$('#notifications-lists').html("");
	}
	
	if(obj.method === "load-notifications-reply") {
		var notifications = obj.notifications;
		$('#notifications-lists').html("");
		for(var i=0; i < notifications.length;i++) {
			var obj = notifications[i];
			generate_html_for_notification(obj);
		}
	}
	
	
	
	
	
	
	
}
	
