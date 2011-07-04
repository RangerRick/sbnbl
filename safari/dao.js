Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

var default_interval = 60;

function get_users() {
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

function get_interval() {
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

function get_url(fragment) {
	return safari.extension.baseURI + fragment;
}

function array_to_lowercase(obj) {
	var response = [];
	for (var i = 0; i < obj.length; i++) {
		// lower-case, and remove leading and ending strings
		response.push(obj[i].toLowerCase().replace(/^\s*([\S\s]*?)\s*$/, '$1'));
	}
	return response;
}

var event_callback = null;

var handle_config_event = function(messageEvent) {
	console.debug("handle_config_event: " + JSON.stringify(messageEvent));
	if (event_callback != null && messageEvent.name === "user_update") {
		event_callback(messageEvent.message);
	}
}

function register_listener(callback) {
	console.debug("register_listener");
	event_callback = callback;
	safari.self.addEventListener("message", handle_config_event, false);
	safari.self.tab.dispatchMessage("force_refresh", null);
}