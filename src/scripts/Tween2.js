/**
 * Created by semdy on 2016/9/6.
 */
(function (EC) {
  "use strict";

  /**
   * Tween 动画类
   * **/

  var Group = function () {
    this._tweens = {};
  };

  Group.prototype = {
    getAll: function () {
      return Object.keys(this._tweens).map(function (tweenId) {
        return this._tweens[tweenId];
      }.bind(this));

    },

    removeAll: function () {
      this._tweens = {};
    },

    add: function (tween) {
      this._tweens[tween.getId()] = tween;
    },

    remove: function (tween) {
      delete this._tweens[tween.getId()];
    },

    get: function(id){
      return this._tweens[id];
    }
  };

  var QueueManager = function () {
    this._queues = {};
  };

  QueueManager.prototype = {
    add: function (item, data) {
      var _id = item.getId();
      if (this._queues[_id] === undefined ) {
        this._queues[_id] = [];
      }
      this._queues[_id].push(data);
    },

    get: function(item) {
      return this._queues[item.getId()] || [];
    },

    remove: function (item) {
      delete this._queues[item.getId()];
    },

    removeAll: function () {
      this._queues = {};
    }
  };

  var group = new Group();
  var queueManager = new QueueManager();

  var isFunction = EC.isFunction;
  var isNumber = EC.isNumber;

  var _registCallback = function(callback, context){
    return isFunction(callback) && context ? callback.bind(context) : callback;
  };

  var Tween = function (obj, cfg) {
    var _cfg = cfg || {};

    this._tweenObj = obj;
    this._ticker = null;
    this._startCallback = null;
    this._updateCallback = null;
    this._completeCallback = null;
    this._stopCallback = null;
    this._duration = 1000;
    this._startAttrs = {};
    this._endAttrs = {};
    this._startTime = null;
    this._easingFunction = EC.Easing.Linear.None;
    this._repeatIndex = 0;
    this._repeatCount = 0;
    this._startCallbackFired = false;
    this._isPlaying = false;
    this._tweenTimeline = [];
    this._shouldTimelineAdd = true;
    this._isFirstTimeline = true;
    this._isReverse = false;
    this._waitTime = 0;
    this._id = Tween.nextId();

    if (_cfg.reverse === true) {
      this._repeatCount = 2;
    }

    if (isNumber(_cfg.loop)) {
      this._repeatCount = _cfg.loop;
    }

    if(_cfg.loop === true || _cfg.yoyo === true) {
      this._repeatCount = -1;
    }

    this.start();
  };

  Tween.get = function (obj, cfg) {
    return new Tween(obj, cfg);
  };

  Tween.group = group;

  Tween._nextId = 0;
  Tween.nextId = function () {
    return Tween._nextId++;
  };

  Tween.removeTweens = function (target) {
    if (EC.isObject(target) && target._tweenId !== undefined) {
      Tween.get(target).stop();
    }

    return this;
  };

  Tween.removeAllTweens = function (container) {
    if(!(container instanceof EC.DisplayObjectContainer)) return this;
    var removeTweens = function (container) {
      container.children.forEach(function (target) {
        Tween.removeTweens(target);
        if (target.children.length > 0) {
          removeTweens(target);
        }
      });
    };

    removeTweens(container);

    return this;
  };

  Tween.prototype = {
    getId: function () {
      return this._id;
    },
    start: function () {
      if(this._isPlaying || this._tweenObj._tweenId !== undefined) {
        return this;
      }

      var self = this;
      group.add(this);
      this._tweenObj._tweenId = this.getId();
      this._isPlaying = true;
      this._startCallbackFired = false;

      function callUpdate(){
        self._ticker = requestAnimationFrame(callUpdate);
        self.update();
      }

      setTimeout(callUpdate, 0);

      return this;
    },
    stop: function(){
      var tweenInstance = group.get(this._tweenObj._tweenId);
      if(tweenInstance) {
        tweenInstance._stopTween();
      }

      return this;
    },
    _stopTween: function () {
      if (!this._isPlaying) {
        return this;
      }

      cancelAnimationFrame(this._ticker);
      group.remove(this);
      queueManager.remove(this);
      this._clearTimeline();
      delete this._tweenObj._tweenId;
      this._isPlaying = false;
      this._ticker = null;
      this._shouldTimelineAdd = true;
      this._isFirstTimeline = true;
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

      this._triggerUpdate(percent);

      if (percent === 1) {
        this.dequeue();

        var fx = queueManager.get(this);
        if (!fx.length) {

          this._triggerComplete();

          if (this._repeatCount === -1 || ++this._repeatIndex < this._repeatCount) {
            var lastArgs;
            this._shouldTimelineAdd = false;
            this._isReverse = !this._isReverse;
            this._tweenTimeline.reverse().forEach(function(tweenArgs, i, self) {
              if(this._isReverse) {
                lastArgs = self[i + 1];
                if(lastArgs === undefined) return false;
              } else {
                if(i === 0) return false;
                lastArgs = tweenArgs;
              }
              if(isNumber(lastArgs)){
                this.wait(lastArgs);
              } else {
                var _speed;
                var _easing;
                if(isNumber(tweenArgs)) {
                  if(i === 0) return false;
                  _speed = self[i-1][1];
                  _easing = self[i-1][2];
                } else {
                  _speed = tweenArgs[1];
                  _easing = tweenArgs[2];
                }
                this.to(lastArgs[0], _speed, _easing);
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
    _triggerUpdate: function (elapse) {
      isFunction(this._updateCallback) && this._updateCallback(this._tweenObj, elapse);
    },
    _triggerComplete: function () {
      isFunction(this._completeCallback) && this._completeCallback(this._tweenObj);
    },
    _triggerStop: function () {
      isFunction(this._stopCallback) && this._stopCallback(this._tweenObj);
    },
    queue: function (data) {
      if (data) {
        queueManager.add(this, data);
      }

      var fx = queueManager.get(this);
      if (fx[0] !== 'running') {
        this.dequeue();
      }

      return this;
    },

    dequeue: function () {
      var self = this,
        fx = queueManager.get(this),
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