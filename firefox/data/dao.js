var event_callback = null;

// var data = undefined;
// if (require) {
//	data = require("self").data;
//} else if (self) {
//	data = self.data;
//}

var get_users = function() {
	var users = ["norwegiancaniac"];
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

var get_url = function(fragment) {
	return "resource://jid1-xdzaawywo6ectw-at-jetpack-sbnbl-lib/" + fragment;
}

var register_listener = function(callback) {
	console.log(pluginName + " registering configuration listener");
	event_callback = callback;
	self.port.on("user_update", event_callback);
	self.port.emit("force_refresh", null);
}
