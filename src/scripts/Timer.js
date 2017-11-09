/**
 * Created by semdy on 2016/9/6.
 */

(function (EC) {
  "use strict";

  var Timer = EC.Event.extend({
    initialize: function (delay, repeatCount) {
      Timer.superclass.initialize.call(this);

      this._currentCount = 0;
      this._startTime = 0;
      this._repeatCount = repeatCount;
      this._waitTime = 0;
      this._isTimeoutSet = false;
      this._isPlaying = false;
      this._id = EC.groupManager.nextId();
      this.delay = delay;
    },

    getId: function () {
      return this._id;
    },

    start: function () {
      EC.groupManager.add(this);
      this._startTime = Date.now();
      this._isPlaying = true;
      this.dispatch('start');

      return this;
    },

    isPlaying: function () {
      return this._isPlaying;
    },

    stop: function () {
      if (!this._isPlaying) {
        return this;
      }

      if (this._waitTime > 0) {
        this._timeout(function () {
          this._isPlaying = false;
          EC.groupManager.remove(this);
          this.dispatch('complete');
          this.reset();
        }, this._waitTime);
      }
      else {
        this._isPlaying = false;
        EC.groupManager.remove(this);
        this.dispatch('complete');
        this.reset();
      }

      return this;
    },
    wait: function (waitTime) {
      this._waitTime = waitTime;
      return this;
    },
    pause: function (dur) {
      this._isPlaying = false;
      this.dispatch('pause');

      if (typeof dur === 'number' && dur > 0) {
        this._timeout(function () {
          this._isPlaying = true;
        }, dur);
      }
      return this;
    },
    setRepeatCount: function (repeatCount) {
      this._repeatCount = repeatCount;
      return this;
    },
    update: function (time) {
      var now = time || Date.now();
      var elapse = now - this._startTime;

      if(this._waitTime > 0) {
        if(elapse >= this._waitTime) {
          this._timeup = true;
        }
        return true;
      }

      if(!this._isPlaying) return true;

      if (elapse >= this.delay) {
        if (this._repeatCount && (++this._currentCount === this._repeatCount)) {
          this.stop();
          return false;
        }

        this._startTime = now;
        this.dispatch('timer', now);
      }

      return true;
    },
    reset: function () {
      this._currentCount = 0;
      return this;
    },
    _timeout: function(delayCallback, delay){
      var self = this;

      if(self._isTimeoutSet) return;

      self._startTime = Date.now();
      self._waitTime = delay;
      self._isTimeoutSet = true;

      if(!Object.prototype.hasOwnProperty.call(self, '_timeup')) {
        Object.defineProperty(self, '_timeup', {
          set: function(reached){
            if(reached === true){
              self._waitTime = 0;
              self._isTimeoutSet = false;
              delayCallback.call(self);
            }
          }
        });
      }
    }
  });

  EC.provide({
    Timer: Timer
  });

})(window.EC);