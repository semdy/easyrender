;(function (EC, undefined) {
  'use strict';

  function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  function reverseEase(y) {
    return 1 - Math.sqrt(1 - y * y);
  }

  function getEvent(evt) {
    return evt.changedTouches ? evt.changedTouches[0] : evt;
  }

  function noop() {
  }

  var TouchScroll = function (option) {

    this.element = option.touch;
    this.target = this._getValue(option.target, this.element);
    this.vertical = this._getValue(option.vertical, true);
    this.property = option.property;

    this.initialValue = this._getValue(option.initialValue, this.target[this.property]);
    this.target[this.property] = this.initialValue;
    this.fixed = this._getValue(option.fixed, false);
    this.sensitivity = this._getValue(option.sensitivity, 1);
    this.moveFactor = this._getValue(option.moveFactor, 1);
    this.factor = this._getValue(option.factor, 1);
    this.outFactor = this._getValue(option.outFactor, 0.3);
    this.min = option.min;
    this.max = option.max;
    this.deceleration = 0.0006;
    this.maxRegion = this._getValue(option.maxRegion, 600);
    this.springMaxRegion = this._getValue(option.springMaxRegion, 60);
    this.maxSpeed = option.maxSpeed;
    this.hasMaxSpeed = !(this.maxSpeed === undefined);
    this.lockDirection = this._getValue(option.lockDirection, true);
    this.scaleRatio = 1;

    this.scroll = option.scroll || noop;
    this.touchEnd = option.touchEnd || noop;
    this.touchStart = option.touchStart || noop;
    this.touchMove = option.touchMove || noop;
    this.reboundEnd = option.reboundEnd || noop;
    this.animationEnd = option.animationEnd || noop;
    this.correctionEnd = option.correctionEnd || noop;
    this.tap = option.tap || noop;
    this.pressMove = option.pressMove || noop;
    this.eventTarget = window;

    this.hasMin = !(this.min === undefined);
    this.hasMax = !(this.max === undefined);
    if (this.hasMin && this.hasMax && this.min > this.max) {
      throw "the min value can't be greater than the max value."
    }
    this.isTouchStart = false;
    this.step = option.step;
    this.inertia = this._getValue(option.inertia, true);

    this._calculateIndex();

    this.element.touchEnabled = true;
    this.element.on("touchstart", this._start, this);
    this.eventTarget.addEventListener(EC.EVENTS.END, this._end.bind(this), false);
    this.eventTarget.addEventListener(EC.EVENTS.MOVE, this._move.bind(this), {passive: false, capture: false});
    this.x1 = this.x2 = this.y1 = this.y2 = null;
  };

  TouchScroll.prototype = {
    _getValue: function (obj, defaultValue) {
      return obj === undefined ? defaultValue : obj;
    },
    stop: function () {
      this._stopTweens();
      this._calculateIndex();
    },
    _start: function (evt) {
      this.isTouchStart = true;
      this.touchStart.call(this, evt, this.target[this.property]);
      this._stopTweens();
      this._calculateIndex();
      this.startTime = Date.now();
      this.scaleRatio = evt.scaleRatio;
      this.x1 = this.preX = evt.stageX;
      this.y1 = this.preY = evt.stageY;
      this.start = this.vertical ? this.preY : this.preX;
      this._firstTouchMove = true;
      this._preventMove = false;
    },
    _move: function (evt) {
      if (this.isTouchStart) {
        evt = getEvent(evt);
        var bound = EC.Util.getBounding(this.element.stage.canvas, evt),
        currentX = bound.x * this.scaleRatio,
        currentY = bound.y * this.scaleRatio;

        if (this._firstTouchMove && this.lockDirection) {
          var dDis = Math.abs(currentX - this.x1) - Math.abs(currentY - this.y1);
          if (dDis > 0 && this.vertical) {
            this._preventMove = true;
          } else if (dDis < 0 && !this.vertical) {
            this._preventMove = true;
          }
          this._firstTouchMove = false;
        }
        if (!this._preventMove) {
          var d = (this.vertical ? currentY - this.preY : currentX - this.preX) * this.sensitivity;
          var f = this.moveFactor;
          if (this.hasMax && this.target[this.property] > this.max && d > 0) {
            f = this.outFactor;
          } else if (this.hasMin && this.target[this.property] < this.min && d < 0) {
            f = this.outFactor;
          }
          d *= f;
          this.preX = currentX;
          this.preY = currentY;
          if (!this.fixed) {
            this.target[this.property] += d;
          }

          this.scroll.call(this, this.target[this.property]);
          var timestamp = Date.now();
          if (timestamp - this.startTime > 300) {
            this.startTime = timestamp;
            this.start = this.vertical ? this.preY : this.preX;
          }
          this.touchMove.call(this, evt, this.target[this.property]);
        }


        if (this.x2 !== null) {
          evt.deltaX = currentX - this.x2;
          evt.deltaY = currentY - this.y2;

        } else {
          evt.deltaX = 0;
          evt.deltaY = 0;
        }

        this.pressMove.call(this, evt, this.target[this.property]);
        this.x2 = currentX;
        this.y2 = currentY;
      }
    },
    scrollTo: function (v, time, user_ease) {
      this._to(v, this._getValue(time, 600), user_ease || ease, this.scroll, function (value) {
        this._calculateIndex();
        this.reboundEnd.call(this, value);
        this.animationEnd.call(this, value);
      }.bind(this));

    },
    _calculateIndex: function () {
      if (this.hasMax && this.hasMin) {
        this.currentPage = Math.round((this.max - this.target[this.property]) / this.step);
      }
    },
    _end: function (evt) {
      if (this.isTouchStart) {
        this.isTouchStart = false;
        evt = getEvent(evt);
        var self = this,
          current = this.target[this.property],
          bound = EC.Util.getBounding(this.element.stage.canvas, evt),
          pageX = bound.x * this.scaleRatio,
          pageY = bound.y * this.scaleRatio,
          triggerTap = (Math.abs(pageX - this.x1) < 30 && Math.abs(pageY - this.y1) < 30);
        if (triggerTap) {
          this.tap.call(this, evt, current);
        }
        if (this.touchEnd.call(this, evt, current, this.currentPage) === false) return;
        if (this.hasMax && current > this.max) {
          this._to(this.max, 200, ease, this.scroll, function (value) {
            this.reboundEnd.call(this, value);
            this.animationEnd.call(this, value);
          }.bind(this));
        } else if (this.hasMin && current < this.min) {
          this._to(this.min, 200, ease, this.scroll, function (value) {
            this.reboundEnd.call(this, value);
            this.animationEnd.call(this, value);
          }.bind(this));
        } else if (this.inertia && !triggerTap && !this._preventMove) {
          var dt = Date.now() - this.startTime;
          if (dt < 300) {
            var distance = ((this.vertical ? pageY : pageX) - this.start) * this.sensitivity,
              speed = Math.abs(distance) / dt,
              speed2 = this.factor * speed;
            if (this.hasMaxSpeed && speed2 > this.maxSpeed) {
              speed2 = this.maxSpeed;
            }
            var destination = current + (speed2 * speed2) / (2 * this.deceleration) * (distance < 0 ? -1 : 1);

            var tRatio = 1;
            if (destination < this.min) {
              if (destination < this.min - this.maxRegion) {
                tRatio = reverseEase((current - this.min + this.springMaxRegion) / (current - destination));
                destination = this.min - this.springMaxRegion;
              } else {
                tRatio = reverseEase((current - this.min + this.springMaxRegion * (this.min - destination) / this.maxRegion) / (current - destination));
                destination = this.min - this.springMaxRegion * (this.min - destination) / this.maxRegion;
              }
            } else if (destination > this.max) {
              if (destination > this.max + this.maxRegion) {
                tRatio = reverseEase((this.max + this.springMaxRegion - current) / (destination - current));
                destination = this.max + this.springMaxRegion;
              } else {
                tRatio = reverseEase((this.max + this.springMaxRegion * ( destination - this.max) / this.maxRegion - current) / (destination - current));
                destination = this.max + this.springMaxRegion * (destination - this.max) / this.maxRegion;

              }
            }
            var duration = Math.round(speed / self.deceleration) * tRatio;

            self._to(Math.round(destination), duration, ease, self.scroll, function (value) {
              if (self.hasMax && self.target[self.property] > self.max) {

                self._to(self.max, 600, ease, self.scroll, self.animationEnd);

              } else if (self.hasMin && self.target[self.property] < self.min) {

                self._to(self.min, 600, ease, self.scroll, self.animationEnd);

              } else {
                if (self.step) {
                  self._correction()
                } else {
                  self.animationEnd.call(self, value);
                }
              }

              self.scroll.call(this, value);
            });


          } else {
            self._correction();
          }
        } else {
          self._correction();
        }

      }
      this.x1 = this.x2 = this.y1 = this.y2 = null;

    },
    _to: function (value, time, ease, onChange, onEnd) {
      if (this.fixed) return;

      var self = this;
      var property = this.property;
      var toProps = {};
      toProps[property] = value;

      EC.Tween.get(self.target).to(toProps, time, ease).onUpdate(function(obj){
        onChange && onChange.call(self, obj[property]);
      }).call(function() {
        onEnd && onEnd.call(self, value);
      });

    },
    _stopTweens: function () {
      EC.Tween.removeTweens(this.target);
    },
    _correction: function () {
      if (this.step === undefined) return;
      var el = this.target,
        property = this.property;
      var value = el[property];
      var rpt = Math.floor(Math.abs(value / this.step));
      var dy = value % this.step;
      if (Math.abs(dy) > this.step / 2) {
        this._to((value < 0 ? -1 : 1) * (rpt + 1) * this.step, 400, ease, this.scroll, function (value) {
          this._calculateIndex();
          this.correctionEnd.call(this, value);
          this.animationEnd.call(this, value);
        }.bind(this));
      } else {
        this._to((value < 0 ? -1 : 1) * rpt * this.step, 400, ease, this.scroll, function (value) {
          this._calculateIndex();
          this.correctionEnd.call(this, value);
          this.animationEnd.call(this, value);
        }.bind(this));
      }
    }
  };

  EC.provide({
    TouchScroll: TouchScroll
  });

})(window.EC);
