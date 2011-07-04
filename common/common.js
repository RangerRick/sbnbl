var default_interval = 60;
var intervalId = -1;
var interval = -1;

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function array_to_lowercase(obj) {
	var response = [];
	for (var i = 0; i < obj.length; i++) {
		// lower-case, and remove leading and ending strings
		response.push(obj[i].toLowerCase().replace(/^\s*([\S\s]*?)\s*$/, '$1'));
	}
	return response;
}

function do_update() {
	console.debug("do_update");
	var newInterval = get_interval();
	if (newInterval != interval) {
		console.debug("do_update: interval has changed, re-adding interval (" + interval + " -> " + newInterval + ")")
		if (intervalId != -1) window.clearInterval(intervalId);
		intervalId = window.setInterval(do_update, newInterval * 1000);
		interval = newInterval;
	}

	var users = get_users();
	send_update(array_to_lowercase(users));
}
