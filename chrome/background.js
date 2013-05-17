var tab_ids = [];

var send_update = function(data) {
	if (debug) console.log("sending update to " + tab_ids.length + " tab(s): data = " + JSON.stringify(data));
	for (var i=0; i < tab_ids.length; i++) {
		chrome.tabs.sendMessage(tab_ids[i], {"config_update": data}, function(response) {
		});
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "register") {
		var tabId = sender.tab.id;
		if (debug) console.log("register: tab id " + tabId + " registered");
		if (tab_ids.indexOf(tabId) == -1) {
			tab_ids.push(tabId);
		}
		do_update();
	} else {
		console.log("received unknown request: " + request);
	}
	sendResponse({});
});

do_update();