var event_callback = null;
var tabs = [];

var get_users = function() {
	var users = [];
	var userSetting = safari.extension.settings.getItem("users");
	if (userSetting != null) {
		if (userSetting.indexOf(",") != -1) {
			users = userSetting.split(",");
		} else if (userSetting.length > 0){
			users.push(userSetting);
		}
		for (var i=0; i < users.length; i++) {
			users[i] = users[i].replace(/^\s*([\S\s]*?)\s*$/, '$1');
		}
	}
	return users;
}

var get_interval = function() {
	var intervalSetting = safari.extension.settings.getItem("interval");
	if (intervalSetting == null) {
		return default_interval;
	}
	var interval = parseInt(intervalSetting);
	if (!interval || interval == NaN) {
		return default_interval;
	}
	return interval;
}

var get_block_replies = function() {
	var blockedSetting = safari.extension.settings.getItem("blockReplies");
	if (blockedSetting == null) {
		return default_block_replies;
	}
	return blockedSetting;
}

var get_url = function(fragment) {
	return safari.extension.baseURI + fragment;
}

var handle_config_event = function(messageEvent) {
	if (debug) console.log("handle_config_event: " + JSON.stringify(messageEvent));
	if (event_callback != null && messageEvent.name === "config_update") {
		event_callback(messageEvent.message);
	}
}

var register_listener = function(callback) {
	console.log(pluginName + " registering configuration listener");
	event_callback = callback;
	safari.self.addEventListener("message", handle_config_event, false);
	safari.self.tab.dispatchMessage("register", null);
}