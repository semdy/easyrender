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

  if (!arrayProto.filter) {
    arrayProto.filter = function(fun) {
      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++)
      {
        if (i in t)
        {
          var val = t[i];
          if (fun.call(thisArg, val, i, t))
            res.push(val);
        }
      }

      return res;
    };
  }

  if (!arrayProto.indexOf) {
    arrayProto.indexOf = function(searchElement, fromIndex) {

      var k;

      if (this === null) {
        throw new TypeError('"this" is null or not defined');
      }

      var O = Object(this);

      var len = O.length >>> 0;

      if (len === 0) {
        return -1;
      }

      var n = +fromIndex || 0;

      if (Math.abs(n) === Infinity) {
        n = 0;
      }

      if (n >= len) {
        return -1;
      }

      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      while (k < len) {
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  if (!arrayProto.indexOf) {
    arrayProto.indexOf = function (prop) {
      return this.indexOf(prop) > -1;
    };
  }

  if (typeof Object.assign !== 'function') {
    Object.assign = function (source) {
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
  }

  if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }

        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      }
    })()
  }

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
  var Extend = Object.assign;

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
    copy: function(target, depth){
      if(depth){
        return JSON.parse(JSON.stringify(target));
      } else {
        if(Array.isArray(target)) {
          return target.slice();
        } else {
          return Extend({}, target);
        }
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
