function add_user() {
  var input = document.getElementById("userinput");
  var user = input.value;

  block_user(user);
  update_ui();
  return false;
}

function delete_user(user) {
  unblock_user(user);
  update_ui();
  return false;
}

function reset_config() {
  set_users([]);
  set_interval(default_interval);
  update_interval_ui();
  update_ui();
}

function update_ui() {
  var users = get_users();

  document.getElementById("userinput").focus();
}

function update_block_replies() {
	var blockRepliesTag = document.getElementById("blockReplies");
	set_block_replies(blockRepliesTag.checked);
}

function update_interval_ui() {
	document.getElementById("interval").value = get_interval();
}

function update_interval(newValue) {
  set_interval(newValue);
  document.getElementById("range").innerHTML=newValue;
}

function UserListCtrl($scope) {
	console.log("UserListCtrl()");
	$scope.addUser = undefined;
	$scope.users = [];
	$scope.blockReplies = get_block_replies();

	$scope.interval = parseInt(localStorage["interval"]);
	if (!$scope.interval || $scope.interval == NaN) {
		$scope.interval = default_interval;
	}
	update_interval($scope.interval);

	var _users = get_users();
	for (var i=0; i < _users.length; i++) {
		$scope.users.push({"username":_users[i]});
	}
  	$scope.orderProp = 'username';
	$scope.delete_user = function(user) {
		for (var i=0; i < $scope.users.length; i++) {
			var u = $scope.users[i];
			if (u.username === user.username) {
				$scope.users.splice(i, 1);
			}
		}
		delete_user(user.username);
	};
	$scope.add_user = function() {
		if ($scope.addUser === undefined || $scope.addUser == "") {
			return;
		}
		for (var i=0; i < $scope.users.length; i++) {
			if ($scope.users[i].username === $scope.addUser) {
				return;
			}
		}
		$scope.users.push({"username":$scope.addUser});
		add_user($scope.addUser);
		$scope.addUser = undefined;
	};
	$scope.update_block_replies = function() {
		set_block_replies($scope.blockReplies);
	};
	$scope.update_interval = function() {
		update_interval($scope.interval);
	};
	$scope.reset_config = function() {
		for (var i=0; i < $scope.users.length; i++) {
			delete_user($scope.users[i].username);
		}
		$scope.users = [];

		$scope.blockReplies = false;
		set_block_replies(false);

		$scope.addUser = undefined;

		$scope.interval = default_interval;
		update_interval($scope.interval);
	};
}

document.addEventListener("load", function() {
	update_ui();
	update_interval_ui();
});
