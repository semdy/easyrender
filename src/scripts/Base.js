/**
 * Created by semdy on 2016/9/6.
 */

var EC = {
  version: '1.0.7'
};

(function (EC) {
  "use strict";

  var
    slice = Array.prototype.slice,
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    arrayProto = Array.prototype,
    funProto = Function.prototype;

  !!Date.now || (Date.now = function () {
    return +( new Date() );
  });

  !!funProto.bind || (funProto.bind = function () {
    var self = this,
      context = [].shift.call(arguments),
      args = [].slice.call(arguments);
    return function () {
      return self.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
  });

  !!arrayProto.find || (arrayProto.find = function (cb) {
    var i = 0,
      l = this.length;

    for (; i < l; i++) {
      if (cb && cb(this[i], i, this) === true) {
        return this[i];
      }
    }

  });

  !!Array.isArray || (Array.isArray = function (obj) {
    return toString.call(obj) === '[object Array]';
  });

  arrayProto.contains = arrayProto.includes || function (prop) {
    return this.indexOf(prop) > -1;
  };

  var inherits = function() {

    function Temp() {}

    return function (proto) {

      if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
        throw TypeError('Argument must be an object, or null');
      }

      Temp.prototype = proto;
      var obj = new Temp();
      Temp.prototype = null;

      if (arguments.length > 1) {
        var Properties = Object(arguments[1]);
        for (var prop in Properties) {
          if (hasOwn.call(Properties, prop)) {
            obj[prop] = Properties[prop];
          }
        }
      }

      return obj;
    };
  }();


  var isTouch = 'ontouchstart' in document;
  var ua = navigator.userAgent;
  var pointerEnabled = window.navigator.msPointerEnabled;
  var isIeMobile = pointerEnabled && /IEMobile/i.test(ua);

  isTouch = isTouch || isIeMobile || false;

  var EVENTS = isIeMobile ? {
    START: 'MSPointerDown',
    MOVE: 'MSPointerMove',
    END: 'MSPointerCancel'
  } : {
    START: isTouch ? 'touchstart' : 'mousedown',
    MOVE: isTouch ? 'touchmove' : 'mousemove',
    END: isTouch ? 'touchend' : 'mouseup'
  };

  EVENTS.RESIZE = 'onorientationchange' in window ? 'orientationchange' : 'resize';

  /**
   * Extend
   * **/
  var Extend = (function(){
    return Object.assign || function (source) {
      var props = slice.call(arguments, 1);
      var prop, p;
      for (var i = 0; i < props.length; i++) {
        for (p in (prop = props[i])) {
          if (prop.hasOwnProperty(p)) {
            source[p] = prop[p];
          }
        }
      }

      return source;
    }
  })();

  EC.provide = function (props) {
    if (typeof props !== 'object') return;
    Extend(EC, props);
    return EC;
  };

  EC.provide({
    isDefined: function (obj) {
      return typeof obj !== 'undefined';
    },
    isNumber: function (obj) {
      return typeof obj === 'number';
    },
    isString: function (obj) {
      return typeof obj === 'string';
    },
    isFunction: function (obj) {
      return typeof obj === 'function';
    },
    isObject: function (obj) {
      return typeof obj === 'object' && obj !== null;
    },
    isArray: Array.isArray,
    copy: function(props, depth){
      if(depth){
        return JSON.parse(JSON.stringify(props));
      } else {
        return Extend({}, props);
      }
    },
    camelize: function (key) {
      return key.replace(/\-(\w)/g, function (m, n) {
        return n.toUpperCase();
      });
    },
    lowercase: function(key){
      return key.replace(/[A-Z]/g, function (m) {
        return "-" + m.toLowerCase();
      });
    },
    getStyle: function (node, prop) {
      return window.getComputedStyle(node, null)[EC.camelize(prop)];
    }
  });

  /**
   * 类的继承封装
   * **/
  var ClassExtend = function (protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && hasOwn.call(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function () {
        return parent.apply(this, arguments);
      };
    }

    Extend(child, parent, staticProps);

    child.prototype = inherits(parent.prototype, protoProps);
    child.prototype.constructor = child;

    child.superclass = parent.prototype;

    return child;
  };

  EC.provide({
    extend: Extend,
    classExtend: ClassExtend,
    ua: ua,
    isTouch: isTouch,
    noop: function () {},
    EVENTS: EVENTS
  });

})(EC);
