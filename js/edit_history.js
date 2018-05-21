"use strict";
const getReq = function(url,callback) {
  const request = new XMLHttpRequest();
  request.open("get", url, true);
  request.callback = callback
  request.onloadend = function() {
    this.callback.call(this,request.responseText);
  }
  request.send(null);
};

(function () {
  let result = '<p class="materialy-card__title">編集履歴</p>';
  for(let j = 1; j != 3; j++) {
    getReq(`https://api.github.com/repos/riku1227/mcbedoc/commits?page=${j}`, function (json) {
    const array = JSON.parse(json);

    for(let i = 0; i != array.length; i++) {
      const commitObject = array[i].commit;
      result += `<div class="materialy-card__border"></div>`;
      result += `<p class="materialy-card__text">${commitObject.author.date}</p>`;
      result += `<a class="materialy-button--flat--accent" href="${array[i].author.html_url}">${commitObject.author.name}</a>`;
      result += `<a class="materialy-button--flat--accent" href="${array[i].html_url}">${commitObject.message}</a>`;
    }

    document.getElementsByClassName("materialy-card")[0].innerHTML = result;
  });
  }
}());