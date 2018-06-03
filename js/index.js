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
}());