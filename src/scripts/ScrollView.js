;(function (EC, undefined) {
  'use strict';

  var ScrollView = EC.Sprite.extend({
    initialize: function () {
      ScrollView.superclass.initialize.apply(this, arguments);

      var self = this;
      this.cursor = '';
      this.vertical = true;
      this.adjustValue = 0;
      this.$layout = null;
      this.touchScroll = null;
      this.scroller = new EC.Sprite();

      this.on("addToStage", function() {
        this.mask = new EC.Masker();
        this.mask.rect(0, 0, this.width, this.height);
        this.touchScroll = this._createScroll();
        this.addChild(this.scroller);
      }, this);

      Object.defineProperty(this, 'layout', {
        set: function(target) {
          self.$layout = target;
          self.scroller.addChild(target);
        },
        get: function() {
          return self.$layout;
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
    _createScroll: function () {
      var self = this;
      var min = this.height - this.scroller.height - this.adjustValue;
      return new EC.TouchScroll({
        touch: this,
        vertical: this.vertical,
        target: this.scroller,
        property: this.vertical ? 'y' : 'x',
        max: 0,
        min: min,
        scroll: function (value) {
          if(value === 0) {
            self.dispatch('totop', value);
          } else if (value === min) {
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
    }
  });

  EC.provide({
    ScrollView: ScrollView
  });

})(window.EC);
