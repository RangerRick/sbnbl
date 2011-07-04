function get_users() {
	var users;
	var storageString = localStorage["users"];
	if (storageString && storageString != null) {
		users = JSON.parse(storageString);
	} else {
		users = [];
	}

	console.debug("get_users() returning " + JSON.stringify(users));
	return users;
}

function set_users(users) {
	console.debug("set_users(" + JSON.stringify(users) + ")");

	localStorage["users"] = JSON.stringify(users);
}

function block_user(user) {
	console.debug("block_user(" + user + ")");

	var users = get_users();
	users.push(user);
	set_users(users);
	return users;
}

function unblock_user(user) {
	console.debug("unblock_user(" + user + ")");

	var users = get_users();
	for (var i = 0; i < users.length; i++) {
		if (users[i] == user) {
			users.remove(i);
			break;
		}
	}
	set_users(users);
	return users;
}

function get_interval() {
	var interval = parseInt(localStorage["interval"]);
	if (!interval || interval == NaN) {
		interval = 60;
	}
	console.debug("get_interval() returning " + interval);
	return interval;
}

function set_interval(interval) {
	console.debug("set_interval(" + interval + ")");

	localStorage["interval"] = interval;
	return interval;
}

function get_url(fragment) {
	return chrome.extension.getURL(fragment);
}

var event_callback = null;

var handle_config_event = function(messageEvent) {
	console.debug("handle_config_event: " + JSON.stringify(messageEvent));
	if (event_callback != null && messageEvent.name === "user_update") {
		event_callback(messageEvent.message);
	} 
}     
		
function register_listener(callback) {
	event_callback = callback;
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (event_callback != null && request.user_update) {
			event_callback(request.user_update);
			sendResponse({});
		}
	});
	chrome.extension.sendRequest({"force_refresh": null}, function(response) {
	});
} 
