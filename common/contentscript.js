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
	if (debug) {
		console.log("hide_comment(" + author + "):");
		console.log(comment);
	}

	var id = comment.getAttribute("data-comment-id");
	blocked_comments[id] = true;

	if (!comment.classList.contains("collapsed")) {
		comment.classList.add("collapsed");
	}

	/*

	var comment_title      = comment.getElementsByClassName("title")[0];
	var comment_body       = comment.getElementsByClassName("body")[0];
	var comment_container  = comment.getElementsByClassName("comment-entry")[0];
	var comment_image_link = comment.getElementsByClassName("avatar")[0];
	var reply_link         = comment.getElementsByClassName("reply_link")[0];
	var up_link            = comment.getElementsByClassName("up_link")[0];
	var comment_actions    = comment.getElementsByClassName("cactions")[0];
	var paragraph          = get_author_paragraph_for_comment(comment);
	var blockIndicators    = paragraph.getElementsByClassName("sbnbl-action");
	var blockIndicator;

	if (blockIndicators && blockIndicators.length > 0) {
		blockIndicator = blockIndicators[0];
	}

	comment_container.style.backgroundImage = "url('" + get_url("disabled-background.png") + "')";
	comment_title.style.display = "none";
	comment_body.style.display = "none";
	comment_image_link.style.display = "none";
	if (reply_link) reply_link.style.display = "none";
	if (up_link) up_link.style.display = "none";
	if (comment_actions) comment_actions.style.display = "none";

	// put "block" indicator on the user tagline
	if (paragraph != null) {
		var blocked_text = "hidden";
		var author = get_author_for_comment(comment);
		if (users.indexOf(author) != -1) {
			blocked_text = "blocked";
		}
		var newBlockIndicator = document.createElement("span");
		newBlockIndicator.className = "sbnbl-action";
		newBlockIndicator.setAttribute("style", "float: right");
		newBlockIndicator.innerHTML = "<span title=\"This post has been blocked by the SBNation Black List\"><img style=\"vertical-align: inherit\" src=\"" + get_url("block.png") + "\" /> " + blocked_text + "</span>";
		if (blockIndicator && blockIndicator.parentNode) {
			blockIndicator.parentNode.removeChild(blockIndicator);
		}
//		paragraph.insertBefore(newBlockIndicator, paragraph.firstChild);
		paragraph.appendChild(newBlockIndicator);
	}

	// update the sub-comments
	for (var s=0; s < comment.childNodes.length; s++) {
		var subElement = comment.childNodes[s];
		if (subElement.className != "citem") continue;
		var newAuthor = get_author_for_comment(subElement);
		if (blockReplies) {
			hide_comment(newAuthor, data, subElement);
		} else {
			if (users.indexOf(newAuthor) != -1) {
				hide_comment(newAuthor, data, subElement);
			} else {
				show_comment(newAuthor, data, subElement);
			}
		}
	}
	*/
}

var show_comment = function(author, data, comment) {
	var users = data.users;
	if (debug) console.log("show_comment(" + author + ", " + comment["data-comment-id"] + ")");

	if (comment.classList.contains("collapsed")) {
		comment.classList.remove("collapsed");
	}

	var id = comment.getAttribute("data-comment-id");
	delete blocked_comments[id];

	/*
	var comment_title      = comment.getElementsByClassName("comment_title")[0];
	var comment_body       = comment.getElementsByClassName("cbody")[0];
	var comment_container  = comment.getElementsByTagName("div")[0];
	var comment_image_link = comment.getElementsByTagName("a")[0];
	var reply_link         = comment.getElementsByClassName("reply_link")[0];
	var up_link            = comment.getElementsByClassName("up_link")[0];
	var comment_actions    = comment.getElementsByClassName("cactions")[0];
	var blockIndicators    = comment.getElementsByClassName("sbnbl-action");
	var blockIndicator;

	if (blockIndicators && blockIndicators.length > 0) {
		blockIndicator = blockIndicators[0];
	}

	// delete comment.style.backgroundImage;
	comment_container.style.backgroundImage = "";
	// comment.style.display = "block";
	comment_title.style.display = "block";
	comment_body.style.display = "block";
	comment_image_link.style.display = "block";
	if (reply_link) reply_link.style.display = "inline";
	if (up_link) up_link.style.display = "inline";
	if (comment_actions) comment_actions.style.display = "inline";

	// remove the "block" indicator
	if (blockIndicator && blockIndicator.parentNode) {
		blockIndicator.parentNode.removeChild(blockIndicator);
	}

	// recursively parse sub-comments
	for (var s=0; s < comment.childNodes.length; s++) {
		var subElement = comment.childNodes[s];
		if (subElement.className != "citem") continue;
		var newAuthor = get_author_for_comment(subElement);
		if (users.indexOf(newAuthor) != -1) {
			hide_comment(newAuthor, data, subElement);
		} else {
			show_comment(newAuthor, data, subElement);
		}
	}
	*/
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

