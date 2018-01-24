"use strict";
(callWhenReadyToGo = function callWhenReadyToGo() {
  (this.ajaxComplete = !0), this.startChecking();
}),
  (callWhenReadyToGo.prototype = {
    startChecking: function startChecking() {
      this.initAjaxTests(),
        (this.interval = setInterval(this.checkIfReady.on(this), 100));
    },
    initAjaxTests: function initAjaxTests() {
      (this.ajaxComplete = !0),
        "undefined" == typeof $ ||
          this.addedAjaxFuncs ||
          ((this.addedAjaxFuncs = !0),
          $(document).ajaxStart(
            function() {
              this.ajaxComplete = !1;
            }.on(this)
          ),
          $(document).ajaxStop(
            function() {
              this.ajaxComplete = !0;
            }.on(this)
          ));
    },
    complete: function complete() {
      "function" == typeof this.callback &&
        (this.callback(), (this.callback = null)),
        this.interval && (clearInterval(this.interval), (this.interval = null));
    }
  });