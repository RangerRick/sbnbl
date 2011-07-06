var get_users = function() {
	var users;
	var storageString = localStorage["users"];
	if (storageString && storageString != null) {
		users = JSON.parse(storageString);
	} else {
		users = [];
	}

	if (debug) console.log("get_users() returning " + JSON.stringify(users));
	return users;
}

var set_users = function(users) {
	if (debug) console.log("set_users(" + JSON.stringify(users) + ")");

	localStorage["users"] = JSON.stringify(users);
}

var block_user = function(user) {
	if (debug) console.log("block_user(" + user + ")");

	var users = get_users();
	users.push(user);
	set_users(users);
	return users;
}

var unblock_user = function(user) {
	if (debug) console.log("unblock_user(" + user + ")");

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

var get_interval = function() {
	var interval = parseInt(localStorage["interval"]);
	if (!interval || interval == NaN) {
		interval = 60;
	}
	if (debug) console.log("get_interval() returning " + interval);
	return interval;
}

var set_interval = function(interval) {
	if (debug) console.log("set_interval(" + interval + ")");

	localStorage["interval"] = interval;
	return interval;
}

var get_block_replies = function() {
	var blocked = default_block_replies;

	var blockedString = localStorage["blockReplies"];
	if (blockedString != undefined) {
		blockedString = blockedString.toLowerCase();
		if (blockedString == "true") {
			blocked = true;
		} else if (blockedString == "false") {
			blocked = false;
		} else {
			console.log("unsure how to parse blockReplies = " + blockedString);
		}
	}

	if (debug) console.log("get_block_replies() returning " + blocked);
	return blocked;
}

var set_block_replies = function(block) {
	if (debug) console.log("set_block_replies(" + block + ")");
	localStorage["blockReplies"] = block;
}

var get_url = function(fragment) {
	return chrome.extension.getURL(fragment);
}

var event_callback = null;

var handle_config_event = function(messageEvent) {
	if (debug) console.log("handle_config_event: " + JSON.stringify(messageEvent));
	if (event_callback != null && messageEvent.name === "config_update") {
		event_callback(messageEvent.message);
	} 
}     

var register_listener = function(callback) {
	console.log(pluginName + " registering configuration listener");
	event_callback = callback;
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (debug) console.log("register_listener: request = " + JSON.stringify(request));
		if (event_callback != null && request.config_update) {
			event_callback(request.config_update);
			sendResponse({});
		}
	});
	chrome.extension.sendRequest({"action": "force_refresh"}, function(response) {
	});
} 
