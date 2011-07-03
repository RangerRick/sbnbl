Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var default_interval = 60;

function get_users() {
  return [];
//  var users;
//  var storageString = localStorage["users"];
//  if (storageString && storageString != null) {
//    users = JSON.parse(storageString);
//  } else {
//    users = [];
//  }
//
//  console.debug("get_users() returning " + JSON.stringify(users));
//  return users;
}

function set_users(users) {
//  console.debug("set_users(" + JSON.stringify(users) + ")");
//
//  localStorage["users"] = JSON.stringify(users);
}

function block_user(user) {
  return get_users();
//  console.debug("block_user(" + user + ")");
//
//  var users = get_users();
//  users.push(user);
//  set_users(users);
//  return users;
}

function unblock_user(user) {
  return get_users();
//  console.debug("unblock_user(" + user + ")");
//
//  var users = get_users();
//  for (var i = 0; i < users.length; i++) {
//    if (users[i] == user) {
//      users.remove(i);
//      break;
//    }
//  }
//  set_users(users);
//  return users;
}

function get_interval() {
  return default_interval;
//  var interval = parseInt(localStorage["interval"]);
//  if (!interval || interval == NaN) {
//    interval = 60;
//  }
//  console.debug("get_interval() returning " + interval);
//  return interval;
}

function set_interval(interval) {
  return get_interval();
//  console.debug("set_interval(" + interval + ")");
//
//  localStorage["interval"] = interval;
//  return interval;
}

function get_url(fragment) {
  return chrome.extension.getURL(fragment);
}

var event_callback = null;
var event_target = null;

var handle_config_event = function(messageEvent) {
  if (event_callback != null && messageEvent.name === "config_refresh") {
    event_callback(messageEvent.message);
  }
}

function register_listener(callback) {
  event_callback = callback;
  safari.self.addEventListener("message", handle_config_event, false);
  safari.self.tab.dispatchMessage("register_listener", null);
}

function unregister_listener() {
  safari.self.tab.dispatchMessage("unregister_listener", null);
  safari.self.removeEventListener("message", handle_config_event, false);
  event_callback = null;
}

//function get_config_async(callback) {
//  // In the case of Chrome, the "response" object contains the appropriate attributes directly.
//  chrome.extension.sendRequest({action: "getConfig"}, callback);
//}
