// ==UserScript==
// @name        TISS: Add VoWi LVA link
// @description Add link to LVA on VoWi in TISS on course page as well as in favorites.
// @namespace   https://vowi.fsinf.at/
// @match       https://tiss.tuwien.ac.at/course/educationDetails.xhtml*
// @match       https://tiss.tuwien.ac.at/course/courseDetails.xhtml*
// @match       https://tiss.tuwien.ac.at/education/favorites.xhtml*
// @grant       none
// @version     1.5
// @downloadURL https://github.com/Lukas0907/tuwgm/raw/master/TISS%20-%20Add%20VoWi%20LVA%20link.user.js
// @updateURL   https://github.com/Lukas0907/tuwgm/raw/master/TISS%20-%20Add%20VoWi%20LVA%20link.user.js
// ==/UserScript==

// Inspired by https://greasyfork.org/de/scripts/9914-tiss-enhancer/

if (document.getElementsByClassName("loading").length > 0) {
  // Don't run the script on sites which only contain the loading animation.
  return;
}

function vowi_link(lvaTitle) {
  return "https://vowi.fsinf.at/LVA/" + encodeURIComponent(lvaTitle.replace(/ /g, '_'));
}

function mm_link(lvaTitle) {
    var channame = lvaTitle.toLowerCase().replace('ä','ae').replace('ö','oe').replace('ü','ue');
    channame = channame.replace(/[^a-zA-Z0-9_]/g,'-');
    channame = channame.replace(/-+/g,'-');
    channame = channame.substring(0,63);
    channame = channame.trim('-');

    return "https://mattermost.fsinf.at/w-inf-tuwien/channels/" + encodeURIComponent(channame);
}

var page = window.location.href.match(/tiss.tuwien.ac.at\/([\w\/]+)\.xhtml/i)[1];
var locale = document.cookie.match(/TISS_LANG=([\w-]+)/);
locale = locale ? locale[1] : "de";


// course overview: add VoWi link
if (page == "course/educationDetails" || page == "course/courseDetails") {
  var header = document.getElementById("subHeader").innerText;
  var lvaTyp = /[0-9WS]{5}, ([^,]+),/gm.exec(header)[1];

  var heading = document.getElementById("contentInner").getElementsByTagName("h1")[0].innerText;
  var lvaTitle = /^\s*[A-Z0-9\.]{7} (.*)$/gm.exec(heading)[1];
  var lvaVoWiTitle = lvaTitle + " " + lvaTyp;

  var ul = document.getElementById("contentInner").getElementsByClassName("bulletList")[0];
  var li = document.createElement("li");
  li.innerHTML = '<a href="' + vowi_link(lvaVoWiTitle) + '" target="_blank">' + (locale == "de" ? "Zum" : "To") + ' VoWi</a>';
  ul.appendChild(li);

  li = document.createElement("li");
  li.innerHTML = '<a href="' + mm_link(lvaTitle) + '" target="_blank">' + (locale == "de" ? "Zum" : "To") + ' Mattermost-Channel</a>';
  ul.appendChild(li);
}

// favorites page: add VoWi link icon
if (page == "education/favorites") {
  Array.from(document.querySelectorAll("tr.ui-widget-content")).forEach(function(row, index) {
    var titleCol = row.getElementsByClassName("favoritesTitleCol")[0];
    var lvaTitle = titleCol.getElementsByTagName("a")[0].text.trim();
    var lvaTyp = titleCol.querySelector("span[title='Typ']").textContent.match(/, ([^,]+),/)[1];
    var lvaVoWiTitle = lvaTitle + " " + lvaTyp;


    var a = document.createElement("a");
    a.href = mm_link(lvaTitle);
    a.target = "_blank";

    var img = document.createElement("img");
    img.src = "https://mattermost.fsinf.at/static/favicon-16x16.png";
    img.title = "Mattermost";
    img.width = 16;
    img.height = 16;
    img.style = "margin-right: 5px";

    a.appendChild(img);

    var favoritesLinks = row.getElementsByClassName("favoritesLinks")[0];
    favoritesLinks.insertBefore(a, favoritesLinks.childNodes[0]);


    a = document.createElement("a");
    a.href = vowi_link(lvaVoWiTitle);
    a.target = "_blank";

    img = document.createElement("img");
    img.src = "https://vowi.fsinf.at/favicon.ico";
    img.title = "VoWi";
    img.width = 16;
    img.height = 16;
    img.style = "margin-right: 5px";

    a.appendChild(img);

    favoritesLinks = row.getElementsByClassName("favoritesLinks")[0];
    favoritesLinks.insertBefore(a, favoritesLinks.childNodes[0]);
    favoritesLinks.style = "width: 100px !important";
  });
}
