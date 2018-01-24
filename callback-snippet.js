callWhenReadyToGo = function (callback){
  this.ajaxComplete = true;
  this.startChecking();
};

callWhenReadyToGo.prototype ={
  startChecking: function(){
    this.initAjaxTests();
    this.interval = setInterval(this.checkIfReady.on(this),100);
  },
 
  initAjaxTests: function(){
    this.ajaxComplete = true;
    if(typeof $ !== "undefined" && !this.addedAjaxFuncs){
      this.addedAjaxFuncs = true;
      // Set ajax as incomplete if a call gets fired
      $( document ).ajaxStart(function() {
        this.ajaxComplete = false;
      }.on(this));
      // Set it back to complete when all calls are completed
      $( document ).ajaxStop(function() {
        this.ajaxComplete = true;
      }.on(this));
    }
  },

  complete: function(){
    if(typeof this.callback === "function"){
      this.callback();
      this.callback = null;
    }
    if(this.interval){
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

 

 