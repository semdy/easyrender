;(function (EC, undefined) {
  'use strict';

  var ScrollView = EC.Sprite.extend({
    initialize: function () {
      ScrollView.superclass.initialize.apply(this, arguments);

      this.cursor = '';
      this.vertical = true;
      this.adjustValue = 0;
      this.initialValue = 0;
      this.disabled = false;
      this.$layout = null;
      this.touchScroll = null;

      this.once("addToStage", function() {
        this.mask = new EC.Masker();
        this.mask.drawRect(0, 0, this.width, this.height);
        if (this.layout) {
          this.addChild(this.layout);
          this._createScroll();
        }
      }, this);

      Object.defineProperty(this, 'layout', {
        set: function(target) {
          this.$layout = target;
          if (this.$hasAddToStage) {
            this.clearContent();
            this.addChild(target);
            if (this.touchScroll) {
              this.refresh();
            } else {
              this._createScroll();
            }
          }
        },
        get: function() {
          return this.$layout;
        },
        enumerable: true
      });
    },
    scrollTo: function () {
      var ts = this.touchScroll;
      if (ts) {
        ts.scrollTo.apply(ts, arguments);
      }

      return this;
    },
    stop: function (){
      var ts = this.touchScroll;
      if (ts) {
        ts.stop.apply(ts, arguments);
      }

      return this;
    },
    setContent: function (sprContent) {
      this.layout = sprContent;
      return this;
    },
    clearContent: function () {
      this.removeAllChildren();
      return this;
    },
    refresh: function () {
      this.touchScroll.min = Math.min(0, ((this.vertical ? (this.height - this.layout.height) : (this.width - this.layout.width)) - this.adjustValue));
      return this;
    },
    _createScroll: function () {
      var self = this;
      this.touchScroll = new EC.TouchScroll({
        touch: this,
        vertical: this.vertical,
        target: this.layout,
        property: this.vertical ? 'y' : 'x',
        max: 0,
        min: 0,
        step: this.step,
        fixed: this.disabled,
        initialValue: this.initialValue,
        scroll: function (value) {
          if (value === 0) {
            self.dispatch('totop', value);
          } else if (value === self.touchScroll.min) {
            self.dispatch('tobottom', value);
          } else {
            self.dispatch('scroll', value);
          }
        },
        reboundEnd: function(value) {
          self.dispatch('rebound', value);
        },
        animationEnd: function(value) {
          self.dispatch('scrollstop', value);
        }
      });
      this.refresh();
    }
  });

  EC.provide({
    ScrollView: ScrollView
  });

})(window.EC);
