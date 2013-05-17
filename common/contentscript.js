var blocked_comments = {};

var get_author_paragraph_for_comment = function(comment) {
	var paragraphs=comment.getElementsByTagName("p");
	var paragraph;
	if (paragraphs) {
		for (p = 0; p < paragraphs.length; p++) {
			paragraph = paragraphs[p];
			var classAttribute = paragraph.getAttribute("class");
			if (classAttribute && classAttribute == "by") {
				return paragraph;
			}
		}
	}
	return null;
}

var get_author_for_comment = function(comment) {
	var anode = comment.getElementsByClassName("poster");
	if (anode != null && anode.length > 0) {
		return anode[0].textContent.toLowerCase();
	}
	return null;
}

var check_comment = function(data, comment) {
	var author = get_author_for_comment(comment);
	var hide = false;
	if (author != null) {
		if (data.users.indexOf(author) != -1) {
			hide = true;
		}
	}

	if (data.blockReplies) {
		var parent = comment.getAttribute("data-parent-comment-id");
		if (parent && blocked_comments[parent]) {
			hide = true;
		}
	}
	
	if (hide) {
		hide_comment(author, data, comment);
	} else {
		show_comment(author, data, comment);
	}
}

var cleanText = function(data) {
	var comments = document.getElementsByClassName("sbn-comment");
	for (i = 0; i < comments.length; i++) {
		var comment = comments[i];
		check_comment(data, comment);
	}
}

var next_element = function(elem) {
	do {
		elem = elem.nextSibling;
	} while (elem && elem.nodeType != 1);
	return elem;		
}

var hide_comment = function(author, data, comment) {
	var users = data.users;
	var blockReplies = data.blockReplies;
	if (debug) console.log("hide_comment(" + author + ", " + comment.getAttribute("data-comment-id") + ")");

	var id = comment.getAttribute("data-comment-id");
	blocked_comments[id] = true;

	if (!comment.classList.contains("collapsed")) {
		comment.classList.add("collapsed");
	}

}

var show_comment = function(author, data, comment) {
	var users = data.users;
	if (debug) console.log("show_comment(" + author + ", " + comment.getAttribute("data-comment-id") + ")");

	var id = comment.getAttribute("data-comment-id");
	delete blocked_comments[id];

	if (comment.classList.contains("collapsed")) {
		comment.classList.remove("collapsed");
	}
}

if (window.top == window) {
	var foundSbNation = false;

	var headTag = document.head;
	if (document.head == undefined) {
		headTag = document.getElementsByTagName("head")[0];
	}
	if (headTag) {
		var links = headTag.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			if (links[i].href.indexOf(".sbnation.com") >= 0) {
				foundSbNation = true;
				break;
			}
		}
	}
	if (debug && foundSbNation) console.log("found an SBNation web site");

	if (foundSbNation) {
		register_listener(function(data) {
			if (debug) console.log("event listener: received update: data = " + JSON.stringify(data));
			cleanText(data);
		});
	}
}

