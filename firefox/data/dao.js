var event_callback = null;
var baseUrl = null;

// var data = undefined;
// if (require) {
//	data = require("self").data;
//} else if (self) {
//	data = self.data;
//}

var get_users = function() {
	var users = [];
//	var userSetting = safari.extension.settings.getItem("users");
//	if (userSetting != null) {
//		if (userSetting.indexOf(",") != -1) {
//			users = userSetting.split(",");
//		} else if (userSetting.length > 0){
//			users.push(userSetting);
//		}
//		for (var i=0; i < users.length; i++) {
//			users[i] = users[i].replace(/^\s*([\S\s]*?)\s*$/, '$1');
//		}
//	}
	return users;
}

var get_interval = function() {
//	var intervalSetting = safari.extension.settings.getItem("interval");
//	if (intervalSetting == null) {
//		return default_interval;
//	}
//	var interval = parseInt(intervalSetting);
//	if (!interval || interval == NaN) {
//		return default_interval;
//	}
//	return interval;
	return default_interval;
}

var get_block_replies = function() {
	return default_block_replies;
}

var set_url_base = function(url) {
	if (debug) console.log("setting URL base to " + url);
	baseUrl = url;
}

var get_url = function(fragment) {
	if (baseUrl == null) {
		return fragment;
	} else {
		return baseUrl + fragment;
	}
}

var register_listener = function(callback) {
	console.log(pluginName + " registering configuration listener");
	event_callback = callback;
	self.port.on("config_update", event_callback);
	self.port.on("base_url", set_url_base);
	self.port.emit("force_refresh", null);
}
