var foundSbNation = false;
var users;

if (window.top == window) {
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
  console.debug("foundSbNation = " + foundSbNation);
}

function get_author_paragraph_for_comment(comment) {
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

function get_author_for_comment(comment) {
  var paragraph = get_author_paragraph_for_comment(comment);
  if (paragraph != null) {
    var aTags = paragraph.getElementsByTagName("a");
    if (aTags.length > 0) {
      return aTags[0].innerText.toLowerCase();
    }
  }
  return null;
}

function cleanText() {
  var comments = document.getElementsByClassName("comment_master_list")[0].childNodes;
  //var comments = document.getElementsByClassName("citem");
  for (i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.className != "citem") continue;
    var author = get_author_for_comment(comment);
    if (author != null) {
      if (users.indexOf(author) != -1) {
        hide_comment(author, comment);
      } else {
        show_comment(author, comment);
      }
    }
  }
}

function hide_comment(author, comment) {
  // console.debug("hide_comment(" + author + ", " + comment.id + ")");
  var comment_title      = comment.getElementsByClassName("comment_title")[0];
  var comment_body       = comment.getElementsByClassName("cbody")[0];
  var comment_container  = comment.getElementsByTagName("div")[0];
  var comment_image_link = comment.getElementsByTagName("a")[0];
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
  if (!blockIndicator) {
    var blocked_text = "hidden";
    var author = get_author_for_comment(comment);
    if (users.indexOf(author) != -1) {
      blocked_text = "blocked";
    }
    var newBlockIndicator = document.createElement("span");
    newBlockIndicator.className = "sbnbl-action";
    newBlockIndicator.innerHTML = "<span style=\"float: right\" title=\"This post has been blocked by the SBNation Black List\" class=\"tools\"><img style=\"vertical-align: inherit\" src=\"" + get_url("block.png") + "\" alt=\"\" /> " + blocked_text + "</span>";
    if (paragraph != null) {
      // paragraph.insertBefore(newBlockIndicator, paragraph.firstChild);
      paragraph.appendChild(newBlockIndicator);
    }
  }

  // update the sub-comments
  for (var s=0; s < comment.childNodes.length; s++) {
    var subElement = comment.childNodes[s];
    if (subElement.className != "citem") continue;
    var newAuthor = get_author_for_comment(subElement);
    hide_comment(newAuthor, subElement);
  }
}

function show_comment(author, comment) {
  // console.debug("show_comment(" + author + ", " + comment.id + ")");
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
      hide_comment(newAuthor, subElement);
    } else {
      show_comment(newAuthor, subElement);
    }
  }
}

if (foundSbNation) {
  register_listener(function(response) {
    var blacklist = [];
    for (var i = 0; i < response.users.length; i++) {
      // lower-case, and remove leading and ending strings
      blacklist.push(response.users[i].toLowerCase().replace(/^\s*([\S\s]*?)\s*$/, '$1'));
    }
    users = blacklist;

    console.log("event listener: received update: users = " + JSON.stringify(users));
    cleanText();
  });
}