"use strict";
(function() {
  var a = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function() {
    console.log(arguments), ajaxCalled(arguments);
    var b = this,
      c = window.setInterval(function() {
        4 != b.readyState ||
          (console.log(b.responseText),
          ajaxResponded(b.responseText),
          clearInterval(c));
      }, 1);
    return a.apply(this, [].slice.call(arguments));
  };
})();
function ajaxCalled() {
  $("body").append(
    '<div id="overlay" style="display : block;position : fixed;z-index: 100;background-image : url(\'https://loading.io/assets/img/landing/curved-bars.svg\');background-color:#666;opacity : 0.4;background-repeat : no-repeat;background-position : center;left : 0;bottom : 0; right : 0; top:0; width : 100%;height : 100%;"> </div>'
  ),
    setTimeout(function() {
      $("#overlay").remove();
    }, 3e3);
}
function ajaxResponded() {
  $("#overlay").remove(),
    $("body").append(
      '<div id="overlay" style="display : block;position : fixed;z-index: 100;background-image : url(\'https://loading.io/s/icon/154nhf.png\');background-color:#666;opacity : 0.4;background-repeat : no-repeat;background-position : center;left : 0;bottom : 0; right : 0; top:0; width : 100%;height : 100%;"> </div>'
    ),
    setTimeout(function() {
      $("#overlay").remove();
    }, 3e3);
}
