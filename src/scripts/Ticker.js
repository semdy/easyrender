/**
 * Created by semdy on 2016/9/6.
 */

(function (EC) {
  "use strict";

  var Ticker = EC.Event.extend({
    initialize: function (options) {
      Ticker.superclass.initialize.call(this);
      options = options || {};
      this.useInterval = options.useInterval || false;
      this._ticker = null;
    },

    start: function () {
      var self = this;

      if(this.useInterval){
        self.dispatch('ticker');
        self._ticker = setInterval(function(){
          self.dispatch('ticker');
        }, 1000 / 60);
      }
      else {
        +function runTicker() {
          self._ticker = requestAnimationFrame(runTicker);
          self.dispatch('ticker');
        }();
      }

      return this;
    },
    stop: function () {
      if (this._ticker) {
        if(this.useInterval){
          clearInterval(this._ticker)
        } else {
          cancelAnimationFrame(this._ticker);
        }
        delete this._ticker;
      }

      return this;
    }
  });

  EC.provide({
    Ticker: Ticker
  });

})(window.EC);