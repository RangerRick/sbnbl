var data = require("self").data;
var addon_worker = null;

if (typeof window == 'undefined') {
	window = require("timers");
}

var baseUrl = data.url("common.js").replace(/common.js$/, "");
eval(data.load("common.js"));
eval(data.load("dao.js"));

var send_update = function(data) {
	if (addon_worker == null) {
		console.log("Worker is null, can't do anything yet.");
		return;
	}

	addon_worker.port.emit("config_update", data);
}

var initialize = function(worker) {
	addon_worker = worker;
	addon_worker.port.emit("base_url", baseUrl);
	addon_worker.port.on('register', function() {
		do_update();
	});

	do_update();
}

var pageMod = require("page-mod");
pageMod.PageMod({
	include: ['*'],
	contentScriptFile: [ data.url('common.js'), data.url('dao.js'), data.url('contentscript.js') ],
	onAttach: function(worker) {
		initialize(worker);
	}
});

console.log("The add-on is running.");
