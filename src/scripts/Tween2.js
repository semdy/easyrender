/**
 * Created by semdy on 2016/9/6.
 */
(function (EC) {
  "use strict";

  /**
   * Tween 动画类
   * **/

  var isFunction = EC.isFunction;
  var isNumber = EC.isNumber;

  var Tween = function (obj, cfg) {
    var _cfg = cfg || {};

    this._tweenObj = obj;
    this._startCallback = null;
    this._updateCallback = null;
    this._completeCallback = null;
    this._stopCallback = null;
    this._duration = 1000;
    this._startAttrs = {};
    this._endAttrs = {};
    this._startTime = null;
    this._easingFunction = null;
    this._repeatIndex = 0;
    this._repeatCount = 0;
    this._startCallbackFired = false;
    this._isPlaying = false;
    this._shouldUpdate = false;
    this._tweenTimeline = [];
    this._shouldTimelineAdd = true;
    this._isFirstTimeline = true;

    if (_cfg.reverse === true) {
      this._repeatCount = 2;
    }

    if (isNumber(_cfg.loop)) {
      this._repeatCount = _cfg.loop;
    }

    if(_cfg.loop === true || _cfg.yoyo === true) {
      this._repeatCount = -1;
    }
  };

  Tween.cache = {};
  Tween.timerCache = {};
  Tween.uuid = 0;
  Tween.expando = '@Tween-' + +new Date;
  Tween.get = function (obj, cfg) {
    return new Tween(obj, cfg);
  };

  Tween.removeTweens = function (target) {
    if (target && target[Tween.expando] && Tween.timerCache[target[Tween.expando]]) {
      Tween.get(target).stop();
    }

    return this;
  };

  Tween.removeAllTweens = function (container) {
    if(!(container instanceof EC.DisplayObjectContainer)) return this;
    container.getChilds().forEach(function (target) {
      Tween.removeTweens(target);
    });

    return this;
  };

  Tween.prototype = {
    start: function (attrs, duration, easing) {
      var self = this;
      var _object = this._tweenObj;
      var timer = Tween.timerCache[_object[Tween.expando]];
      this._isPlaying = true;
      this._startCallbackFired = false;

      if (timer) {
        return this;
      }

      this._startTime = Date.now();
      this._duration = duration || 1000;
      this._easingFunction = easing || EC.Easing.Linear.None;
      this._startAttrs = {};
      this._endAttrs = attrs || {};

      for (var attr in this._endAttrs) {
        if (_object[attr] === undefined) {
          continue;
        }
        this._startAttrs[attr] = Number(_object[attr]);
      }

      +function callUpdate(){
        timer = requestAnimationFrame(callUpdate);
        Tween.timerCache[_object[Tween.expando]] = timer;
        self.update();
      }();

      return this;
    },
    stop: function () {
      if (!this._isPlaying) {
        return this;
      }

      var expando = this._tweenObj[Tween.expando];
      cancelAnimationFrame(Tween.timerCache[expando]);
      this._clearTimeline();
      delete Tween.timerCache[expando];
      this._isPlaying = false;
      this._shouldTimelineAdd = true;
      this._isFirstTimeline = true;
      this._triggerStop();

      return this;
    },
    isPlaying: function () {
      return this._isPlaying;
    },
    to: function (attrs, duration, easing) {
      this.queue(this.start.bind(this, attrs, duration, easing));
      this._addTimeline([attrs, duration, easing]);

      return this;
    },
    wait: function (time) {
      if (isNumber(time)) {
        this.queue(time);
        this._addTimeline(time);
      }

      return this;
    },
    update: function () {

      var percent, _object, value;

      this._triggerStart();

      percent = (Date.now() - this._startTime) / this._duration;
      percent = percent >= 1 ? 1 : percent;
      _object = this._tweenObj;
      value = this._easingFunction(percent);

      for (var attr in this._endAttrs) {
        var start = this._startAttrs[attr];
        var end = this._endAttrs[attr];
        if (typeof end === 'string') {
          if (end.charAt(0) === '+' || end.charAt(0) === '-') {
            end = start + parseFloat(end);
          } else {
            end = parseFloat(end);
          }
        }
        if (typeof end === 'number') {
          if (start === end) continue;
          _object[attr] = start + (end - start) * value;
        }
      }

      this._triggerUpdate();

      if (percent === 1) {
        this.stop();
        this.dequeue();

        var fx = Tween.cache[_object[Tween.expando]] || [];
        if (!fx.length) {

          if (this._repeatCount === -1 || ++this._repeatIndex < this._repeatCount) {
            this._shouldTimelineAdd = false;
            this._tweenTimeline.reverse().forEach(function(tween){
              if(isNumber(tween)){
                this.wait(tween);
              } else {
                this.to.apply(this, tween);
              }
            }.bind(this));

          }
          else {
            delete Tween.cache[_object[Tween.expando]];
          }

          this._triggerComplete();

        }
      }

    },
    _addTimeline: function(data){
      if(this._shouldTimelineAdd) {
        if(this._isFirstTimeline){
          this._tweenTimeline.push([EC.extend({}, this._startAttrs), this._duration, this._easingFunction]);
          this._isFirstTimeline = false;
        }
        this._tweenTimeline.push(data);
      }
    },
    _clearTimeline: function(){
      this._tweenTimeline = [];
    },
    onUpdate: function (callback) {
      this._updateCallback = callback;
      return this;
    },
    onStart: function (callback) {
      this._startCallback = callback;
      return this;
    },
    onStop: function (callback) {
      this._stopCallback = callback;
      return this;
    },
    call: function (callback, context) {
      this._completeCallback = isFunction(callback) ? callback.bind(context) : callback;
      return this;
    },
    _triggerStart: function () {
      if (!this._startCallbackFired) {
        isFunction(this._startCallback) && this._startCallback(this._tweenObj);
        this._startCallbackFired = true;
      }
    },
    _triggerUpdate: function () {
      isFunction(this._updateCallback) && this._updateCallback(this._tweenObj);
    },
    _triggerComplete: function () {
      isFunction(this._completeCallback) && this._completeCallback(this._tweenObj);
    },
    _triggerStop: function () {
      isFunction(this._stopCallback) && this._stopCallback(this._tweenObj);
    },
    queue: function (data) {
      if (!this._tweenObj[Tween.expando])
        this._tweenObj[Tween.expando] = ++Tween.uuid;

      var fx = Tween.cache[Tween.uuid];
      if (fx === undefined) {
        fx = Tween.cache[Tween.uuid] = [];
      }
      if (data) {
        fx.push(data);
      }

      if (fx[0] !== 'running') {
        this.dequeue();
      }

      return this;
    },

    dequeue: function () {
      var self = this,
        fx = Tween.cache[this._tweenObj[Tween.expando]] || [],
        delay,
        fn = fx.shift();

      if (fn === 'running') {
        fn = fx.shift();
      }
console.log(fn)
      if (fn) {
        fx.unshift('running');
        if (isNumber(fn)) {
          delay = window.setTimeout(function () {
            window.clearTimeout(delay);
            delay = null;
            self.dequeue();
          }, fn);
        }
        else if (isFunction(fn)) {
          fn.call(self);
        }
      }

      return this;
    }
  };

  EC.provide({
    Tween: Tween
  });

})(window.EC);