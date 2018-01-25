"use strict";

var notifications = [];
var armed = true;

//for listening any message which comes from runtime
chrome.runtime.onMessage.addListener(messageReceived);
function messageReceived(msg) {

	var datetime = formatDate(new Date());
	console.log("alert.js - messageReceived - + datetime", msg);   
   if(msg.method === "clear-notifications-request") {
	   clear_notifications();
	   relay({method:"clear-notifications-reply", status: 200});
   }

   if(msg.method === "load-notifications-request") {
	   relay({method:"load-notifications-reply", status: 200, notifications : notifications});
   }

}

function set_armed() {
	armed = true;
}

function init() {
	console.log("alerts.js started");
	setInterval(check_for_alerts, 10 * 1000);	// every 10 seconds
	
	var notifications_str = localStorage.getItem("notifications");
	console.log("", notifications_str);

	if(notifications_str != null && notifications_str !== "") {

		notifications = JSON.parse(notifications_str);
		console.log("Notifications:", notifications.length);

	}else
		localStorage.setItem("notifications", JSON.stringify(notifications) );

}

function calculate_hash(obj){

	let message = JSON.stringify(obj)
	let sha = new jsSHA("SHA-1", "TEXT");
	sha.update(message);
	return sha.getHash("HEX");
}

function add_notification(obj) {
	notifications.push(obj);
	localStorage.setItem("notifications", JSON.stringify(notifications) );
}

function clear_notifications() {
	console.log("alerts.js - clear notifications");
	notifications = [];
	localStorage.setItem("notifications", JSON.stringify(notifications) );
}

function close_alert_popup() {
	
	var datetime = formatDate(new Date());	
	console.log("alerts.js - close_alert_popup - " + datetime);
	
	var element_single_alert_close_popup = document.querySelector(".tv-alert-notification-dialog__button--ok");
	var element_multiple_alert_close_popup = document.querySelector(".tv-dialog__close");
	
	//tv-dialog__close js-dialog__close

	if (!element_single_alert_close_popup && !element_multiple_alert_close_popup) return
	
	if(element_single_alert_close_popup)
		element_single_alert_close_popup.click()
	
	if(element_multiple_alert_close_popup)
		element_multiple_alert_close_popup.click()

}

function check_for_alerts() {
	var single_alert_element = document.querySelector(".tv-alert-single-notification-dialog__text")
	var multiple_alert_element = document.querySelectorAll(".tv-alerts-multiple-notifications-dialog__row"); // tv-alerts-multiple-notifications-dialog__table tv-alerts-multiple-notifications-dialog__table--space-bottom
	if (!single_alert_element && !multiple_alert_element) return

	if(single_alert_element)
		process_single_alert_element(single_alert_element);
	
	if(multiple_alert_element && multiple_alert_element.length > 0)
		process_multiple_alert_element(multiple_alert_element);
}

function process_single_alert_element(element) {
	
	var datetime = formatDate(new Date());	
	console.log("alerts.js - process_single_alert_element - " + datetime);	
	element = document.querySelector(".tv-alert-single-notification-dialog__message"); // tv-alerts-multiple-notifications-dialog__table tv-alerts-multiple-notifications-dialog__table--space-bottom

	if (!element) {
		console.log("Alerts.js - Unable to find element");
		return;
	}
    var message = element.textContent;
    process_alert_message(message);
}


function process_multiple_alert_element(row_elements) {
	var datetime = formatDate(new Date());	
	console.log("alerts.js - process_multiple_alert_element - " + datetime);
	
	for (var i = 0; i < row_elements.length; i++) {
		  var row_element = row_elements[i];  // La chiamata myNodeList.item(i) non è necessaria in JavaScript
		  var message = row_element.cells[1].textContent;
		  process_alert_message(message.trim() );
	}
}

function process_alert_message(message) {
	console.log("Alerts.js - element found:", message);
	
    // BINANCE, Symbol, Qty, side
	var values = message.split(",");
	if(values.length == 4) {

		var exchange = values[0].trim();
		var symbol = values[1].trim();
		var amount = parseFloat(values[2].trim());
		var side = values[3].trim();

		//str = str.replace(/^\s+|\s+$/g,'')
		if(exchange !== "BINANCE") {
			console.log("Alerts.js - Wrong Exchange - ", exchange);
			return;			
		}
		
		close_alert_popup();
		if(side !== "SELL" && side !== "BUY") {
			console.log("Alerts.js - No order sent - wrong SIDE", side);
			return;
		}

		var datetime = formatDate(new Date());	
		var obj = {datetime: datetime, symbol: symbol, amount: amount, side: side, type : "INFO"};
		
		relay({method:"ux-alert-detection-notification", data: obj});

		if(armed==false) return
		
		if(configuration.enableSendOrders==1) { 
			obj.type="WARN";
			relay({method:"ux-send-order-notification", data: obj});
			add_notification(obj);
			send_binance_order(symbol, amount, side, send_binance_order_reply);
		}else{
			console.log("Alerts.js - No order sent - enableOrders == 0", values);
			add_notification(obj);
		}
		
		armed = false;
		setTimeout(set_armed, 25*1000 );	// exec only once
	}else
		console.log("Alerts.js - value.length < 4", values);	
}

function send_binance_order_reply(reply_order_str) {
	var datetime = formatDate(new Date());
	console.log("alerts.js - send_binance_order_reply at " +  datetime, reply_order_str);
	if(reply_order_str) {

		/* Response:  
		 * 
		{"symbol":"WTCBTC","orderId":9418436,"clientOrderId":"y5cLN7y1xiYonrgFT00Lhk","transactTime":1516500972830,
		"price":"0.00000000","origQty":"21.40000000","executedQty":"21.40000000","status":"FILLED","timeInForce":"GTC",
		"type":"MARKET","side":"SELL"}
		*/

		var replay_order_obj = JSON.parse(reply_order_str);

		var obj = {datetime: datetime, symbol: replay_order_obj.symbol, amount: replay_order_obj.executedQty,
				side: replay_order_obj.side, type : "ORDER", status:replay_order_obj.status};		
		
		relay({method:"ux-alert-order-filled-notification", data: obj});
		add_notification(obj);
		if(replay_order_obj.status==="FILLED") {
			alert("Order " + replay_order_obj.side + " Filled for "+ replay_order_obj.executedQty + " ("+replay_order_obj.origQty + ")");
		}else {
			alert("Order Not filled!!! - " + reply_order_str);		
		}
	}
}

document.addEventListener("DOMContentLoaded", init);
