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

  var _registCallback = function(callback, context){
    return isFunction(callback) && context ? callback.bind(context) : callback;
  };

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
    this._tweenTimeline = [];
    this._shouldTimelineAdd = true;
    this._isFirstTimeline = true;
    this._waitTime = 0;

    if (_cfg.reverse === true) {
      this._repeatCount = 2;
    }

    if (isNumber(_cfg.loop)) {
      this._repeatCount = _cfg.loop;
    }

    if(_cfg.loop === true || _cfg.yoyo === true) {
      this._repeatCount = -1;
    }

    setTimeout(this.start.bind(this),0);
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
    start: function () {
      var self = this;
      var _object = this._tweenObj;
      var timer = Tween.timerCache[_object[Tween.expando]];
      this._isPlaying = true;
      this._startCallbackFired = false;

      if (timer) {
        return this;
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
      this._shouldTimelineAdd = true;
      this._isFirstTimeline = true;
      this._isPlaying = false;
      delete Tween.timerCache[expando];
      delete Tween.cache[expando];
      this._triggerStop();

      return this;
    },
    isPlaying: function () {
      return this._isPlaying;
    },
    _setProperty: function (attrs, duration, easing) {
      this._startTime = Date.now();
      this._duration = duration || 1000;
      this._easingFunction = easing || EC.Easing.Linear.None;
      this._startAttrs = {};
      this._endAttrs = attrs || {};

      for (var attr in this._endAttrs) {
        if (this._tweenObj[attr] === undefined) {
          continue;
        }
        this._startAttrs[attr] = Number(this._tweenObj[attr]);
      }

      return this;
    },
    to: function (attrs, duration, easing) {
      this.queue(this._setProperty.bind(this, attrs, duration, easing));
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

      var percent, _object, value,
        elapse = Date.now() - this._startTime;

      if(this._waitTime > 0) {
        if(elapse >= this._waitTime) {
          this._timeup = true;
        }
        return;
      }

      this._triggerStart();

      percent = elapse / this._duration;
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
        this.dequeue();

        var fx = Tween.cache[_object[Tween.expando]] || [];
        if (!fx.length) {

          this._triggerComplete();

          if (this._repeatCount === -1 || ++this._repeatIndex < this._repeatCount) {
            this._shouldTimelineAdd = false;
            this._tweenTimeline.reverse().forEach(function(tween){
              if(isNumber(tween)){
                this.wait(tween);
              } else {
                this.to.apply(this, tween);
              }
            }.bind(this));

          } else {
            this.stop();
          }

        }
      }

    },
    _addTimeline: function(data){
      if(this._shouldTimelineAdd) {
        if(this._isFirstTimeline){
          this._tweenTimeline.push([EC.copy(this._startAttrs), this._duration, this._easingFunction]);
          this._isFirstTimeline = false;
        }
        this._tweenTimeline.push(data);
      }
    },
    _clearTimeline: function(){
      this._tweenTimeline = [];
    },
    _timeout: function(delayCallback, delay){
      var self = this;
      self._startTime = Date.now();
      self._waitTime = delay;
      if(!Object.prototype.hasOwnProperty.call(self, '_timeup')) {
        Object.defineProperty(self, '_timeup', {
          set: function(reached){
            if(reached === true){
              self._waitTime = 0;
              delayCallback();
            }
          }
        });
      }
    },
    onStart: function (callback, context) {
      this._startCallback = _registCallback(callback, context);
      return this;
    },
    onUpdate: function (callback, context) {
      this._updateCallback = _registCallback(callback, context);
      return this;
    },
    onStop: function (callback, context) {
      this._stopCallback = _registCallback(callback, context);
      return this;
    },
    call: function (callback, context) {
      this._completeCallback = _registCallback(callback, context);
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
        fn = fx.shift();

      if (fn === 'running') {
        fn = fx.shift();
      }

      if (fn) {
        fx.unshift('running');
        if (isNumber(fn)) {
          self._timeout(function () {
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