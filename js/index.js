"use strict";
const loadFile = function(url,callback) {
  const request = new XMLHttpRequest();
  request.open("get", url, true);
  request.callback = callback
  request.onloadend = function() {
    this.callback.call(this,request.responseText);
  }
  request.send(null);
};

const generateHeader = function(html) {
  document.getElementsByClassName("materialy-toolbar")[0].innerHTML = html;
}

const generateDrawr = function(json) {
  let result = "";
  let id = 0;
  const parseObject = function(object, namespace) {
    let content = object.content;
    if(Array.isArray(content)) {
      result += `<div class="materialy-toolbar__content__container">`;
      result += `<input id="${id}" type="checkbox">`;
      result += `<label for="${id}">${object.name}</label>`;
      id++;
      result += `<div>`;
      for(let i = 0; i != content.length; i++) {
        parseObject(content[i], namespace + object.namespace + "/");
      }
      result += `</div>`;
      result += `</div>`;
    } else {
      if(object.isNotReference === true) {
        result += `<a class="materialy-toolbar__content__link" href="${object.content}.html">${object.name}</a>`;
      } else {
        result += `<a href="https://riku1227.github.io/mcbedoc/${namespace + object.content}.html">${object.name}</a>`;
      }
    }
  };
  const jsonObject = JSON.parse(json);
  for(let i = 0; i != jsonObject.length; i++) {
    parseObject(jsonObject[i], "reference/");
  }
  document.getElementsByClassName("materialy-toolbar__content")[0].innerHTML = result;
};

(function () {

  loadFile("https://riku1227.github.io/mcbedoc/core/header.html", generateHeader);
  let target = document.getElementsByClassName("materialy-toolbar")[0];
  const observerHeader = function() {
    loadFile("https://riku1227.github.io/mcbedoc/json/drawr.json", generateDrawr);
  };
  let mo = new MutationObserver(observerHeader);
  mo.observe(target, {childList: true});

  if(typeof firebase !== "undefined") {
    let config = {
      apiKey: "AIzaSyCdsB_yE2aZ2zf0ie67JAIjXahcIb_NZqc",
      storageBucket: "mcbedoc.appspot.com"
    };
    firebase.initializeApp(config);
    let storage = firebase.storage();

    let locationArray = location.href.split("/");
    let firebaseStorageUrl = locationArray[3];
    for(let i = 4; i != locationArray.length; i++) {
      firebaseStorageUrl += "/" + locationArray[i];
    }

    storage.ref(firebaseStorageUrl).getDownloadURL().then(function (url) {
      loadFile(url, function(file) {
        let content = document.getElementsByClassName("materialy-mainContent")[0];
        content.innerHTML = file + content.innerHTML;
      });
      let observe = new MutationObserver(function(){
        const preTags = document.getElementsByTagName("pre");
        for(let i = 0; i != preTags.length; i++) {
          const preTag = preTags[i];
          hljs.highlightBlock(preTag.children[0]);
        }
      });
      observe.observe(document.getElementsByClassName("materialy-mainContent")[0], {childList: true});
    });
  }
}());