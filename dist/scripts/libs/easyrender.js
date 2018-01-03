/**
 * Created by semdy on 2016/9/6.
 */

var EC = {
  version: '1.1.1'
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

/**
 * Created by semdy on 2016/9/6.
 */
var requestAnimationFrame =
    window.requestAnimationFrame        ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    function (callback) {
        return setTimeout(callback, 1000 / 60);
    };

var cancelAnimationFrame =
    window.cancelAnimationFrame        ||
    window.webkitCancelAnimationFrame  ||
    window.mozCancelAnimationFrame     ||
    function (id) {
        return clearTimeout(id);
    };
/**
 * Created by semdy on 2016/9/6.
 */

(function (EC) {
  "use strict";

  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  var colorTransfer = {};

  /*RGB颜色转换为16进制*/
  colorTransfer.toHex = function (rgb) {
    if (/^(rgb|RGB)/.test(rgb)) {
      var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      var strHex = "#";
      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16);
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = rgb;
      }
      return strHex;
    } else if (reg.test(rgb)) {
      var aNum = rgb.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return rgb;
      } else if (aNum.length === 3) {
        var numHex = "#";
        for (var i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i]);
        }
        return numHex;
      }
    } else {
      return rgb;
    }
  };

  /*16进制颜色转为RGB格式*/
  colorTransfer.toRgb = function (hex, alpha) {
    var sColor = hex.toLowerCase();
    if (sColor && reg.test(sColor)) {
      var sPrefix = "rgb";
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      if (typeof alpha === 'number') {
        sColorChange.push(alpha);
        sPrefix = "rgba";
      }
      return sPrefix + "(" + sColorChange.join(",") + ")";
    } else {
      return sColor;
    }
  };

  function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return r[2];
    return null;
  }

  function hitTest(object, target) {
    return object.getBounds().intersects(target.getBounds());
  }

  EC.Util = EC.Util || {};

  EC.extend(EC.Util, {
    color: colorTransfer,
    getParameter: getParameter,
    hitTest: hitTest
  });

})(window.EC);
/**
 * Created by semdy on 2016/9/6.
 */
(function (EC) {
  "use strict";

  var slice = Array.prototype.slice;

  var Event = function () {
    this.initialize.apply(this, arguments);
  };

  EC.extend(Event.prototype, {

    initialize: function () {
      this._eventPool = {};
      return this;
    },

    on: function (name, callback, ctx) {
      var e = this._eventPool;

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx || this
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;

      function listener() {
        self.off(name, listener);
        callback.apply(this, arguments);
      }

      listener._ = callback;

      return this.on(name, listener, ctx);
    },

    has: function (name, callback) {
      var evts = this._eventPool[name];
      if (evts !== undefined) {
        if(callback) {
          for (var i = 0; i < evts.length; i++) {
            if (evts[i].fn === callback && evts[i].fn._ === callback) {
              return true;
            }
          }
        } else {
          return true;
        }
      }

      return false;
    },

    off: function (name, callback) {
      var e = this._eventPool;
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        liveEvents = evts.filter(function (evt) {
          return evt.fn !== callback && evt.fn._ !== callback;
        });
      }

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    },

    dispatch: function (name) {
      var args = slice.call(arguments, 1);
      var evts = (this._eventPool[name] || []).slice();

      if (evts.length) {
        evts.forEach(function (evt) {
          evt.fn.apply(evt.ctx, args);
        });
      }

      return this;
    },

    success: function (cb) {
      return this.on('success', cb);
    },

    complete: function (cb) {
      return this.on('complete', cb);
    },

    error: function (cb) {
      return this.on('error', cb);
    },

    progress: function (cb) {
      return this.on('progress', cb);
    },

    clear: function () {
      this._eventPool = {};
      return this;
    }
  });

  Event.extend = EC.classExtend;

  EC.provide({
    Event: Event
  });

})(window.EC);
/**
 * Created by semdy on 2017/9/22.
 */

;(function (EC) {
  "use strict";

  var GroupManager = function () {
    this._items = {};
  };

  GroupManager.prototype = {
    getAll: function () {
      return Object.keys(this._items).map(function (itemId) {
        return this._items[itemId];
      }.bind(this));

    },

    add: function (item) {
      this._items[item.getId()] = item;
    },

    get: function(id){
      return this._items[id];
    },

    remove: function (item) {
      delete this._items[item.getId()];
    },

    removeAll: function () {
      this._items = {};
    },

    update: function (keeping) {
      var item;
      var items = this._items;

      for (var itemId in items) {
        item = items[itemId];
        if (item && item.update() === false) {
          item._isPlaying = false;
          if (!keeping) {
            delete items[itemId];
          }
        }
      }

      return true;

    },

    nextId: function () {
      return GroupManager._nextId++;
    }
  };

  GroupManager._nextId = 0;

  EC.provide({
    groupManager: new GroupManager()
  });

})(window.EC);
/**
 * Created by semdy on 2016/9/6.
 */
(function (RES) {
  "use strict";

  var regHttps = /^https?:\/\//;
  var assets = {};

  //加载图片
  var loadImg = function (src, suc, err) {
    var img = new Image();
    img.addEventListener('load', function sucListener() {
      EC.isFunction(suc) && suc(img);
      this.removeEventListener('load', sucListener, false);
    }, false);

    img.addEventListener('error', function errListener() {
      var errMsg = 'fail load:' + src;
      console.error(errMsg);
      EC.isFunction(err) && err(errMsg);
      this.removeEventListener('error', errListener, false);
    }, false);

    img.src = src;

  };

  var ImgLoader = EC.Event.extend({
    initialize: function (src) {
      var self = this;
      ImgLoader.superclass.initialize.call(this);

      loadImg(src, function (img) {
        self.dispatch('success', img);
      }, function (errMsg) {
        self.dispatch('error', errMsg);
      });

      return this;
    }
  });

  var loadTexture = function (resItem, callback) {
    var url = regHttps.test(resItem.url) ? resItem.url : (RES.baseUrl + resItem.url);
    loadImg(url, function (img) {
      assets[resItem.name] = {
        width: img.width,
        height: img.height,
        texture: img
      };
      EC.extend(assets[resItem.name], resItem);
      EC.isFunction(callback) && callback(resItem);
    });
  };

  var loadScript = function (path, cb, errCb) {
    var head = document.head || document.getElementsByTagName("head")[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = path;

    script.onload = script.onreadystatechange = function () {
      script.onload = script.onreadystatechange = new Function;
      if (!this.readyState || /loaded|complete/.test(this.readyState)) {
        script.parentNode.removeChild(script);
        if (typeof cb === 'function') {
          cb(script);
        }
      }
    };

    script.onerror = function () {
      script.onerror = new Function;
      if (typeof errCb === 'function') {
        errCb(null, 404, "not found");
      }
    };

    head.insertBefore(script, head.firstChild);
  };

  var ScriptLoader = EC.Event.extend({
    initialize: function (url) {
      var self = this;
      ScriptLoader.superclass.initialize.call(this);

      loadScript(url, function (data) {
        self.dispatch('success', data);
      }, function (xhr) {
        self.dispatch('error', xhr);
      });

      return this;
    }
  });

  var loadJsonp = function (url, loadSuc, loadErr) {
    var callback = /callback=([^&]+)/.exec(url);
    if (!callback) {
      return loadScript(url, null, loadErr);
    }

    callback = callback[1];

    if (callback === "?") {
      callback = "jsonp" + (Date.now() + Math.random() * 1e18);
      url = url.replace("callback=?", "callback=" + callback);
    }

    window[callback] = function (res) {
      loadSuc(res);
      delete window[callback];
    };

    loadScript(url, null, loadErr);

  };

  var JsonpLoader = EC.Event.extend({
    initialize: function (url) {
      var self = this;
      JsonpLoader.superclass.initialize.call(this);

      loadJsonp(url, function (data) {
        self.dispatch('success', data);
      }, function (xhr) {
        self.dispatch('error', xhr);
      });

      return this;
    }
  });

  var ajaxSettings = {
    url: "",
    type: 'GET',
    async: true,
    data: {},
    headers: {},
    xhrFields: {},
    cache: true,
    cors: false,
    global: true,
    crossDomain: false,
    beforeSend: EC.noop,
    success: EC.noop,
    error: EC.noop,
    complete: EC.noop,
    progress: null,
    timeout: 0,
    context: null,
    dataType: "text",
    responseType: null,
    callbackName: "?",
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    xhr: function () {
      if (!!window.XMLHttpRequest) {
        return new XMLHttpRequest();
      } else {
        try {
          return new ActiveXObject("Microsoft.XMLHttp");
        } catch (e) {
          return null;
        }
      }
    },
    accepts: {
      xml: "application/xml, text/xml",
      html: "text/html",
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      json: "application/json, text/javascript",
      text: "text/plain",
      _default: "*/*"
    }
  };

  var originAnchor = document.createElement('a');
  originAnchor.href = window.location.href;

  function globalAjaxSetup(settings) {
    EC.extend(ajaxSettings, settings || {});
  }

  function getUrlModule(params, cache) {
    var data = null;
    if (!cache) {
      var rnd = Date.now() + Math.random() * 1e18;
    }
    if (typeof params === 'object') {
      data = [];
      if (!cache) {
        params._ = rnd;
      }
      for (var i in params) {
        data.push(i + "=" + params[i]);
      }
      data = data.join("&");
    }
    else if (typeof params === 'string') {
      data = params;
      if (!cache) {
        data += "&_=" + rnd;
      }
    }

    return data;
  }

  function mixFn(beforeFn, afterFn, triggerGlobal) {
    return function () {
      triggerGlobal && beforeFn.apply(this, arguments);
      return afterFn.apply(this, arguments);
    }
  }

  function createAJAX(args) {
    args = EC.extend({}, ajaxSettings, args || {});

    var xhr = args.xhr();

    if (!xhr) return;

    var dataType = args.dataType.toLowerCase(),
      type = args.type.toUpperCase(),
      url = args.url,
      data = getUrlModule(args.data, args.cache),
      timeout;

    if (!args.crossDomain) {
      var urlAnchor = document.createElement('a');
      urlAnchor.href = args.url;
      args.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host);
    }

    function handleSuccess(res) {
      if (timeout) {
        clearTimeout(timeout);
      }

      var data;
      if(/^(?:arraybuffer|blob|json)$/.test(args.responseType)){
        data = xhr.response;
      } else {
        data = dataType === 'jsonp' ? res : (dataType === 'xml' ? xhr.responseXML :
          (dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText));
      }

      mixFn(ajaxSettings.success, args.success, args.global).call(args.context, data, xhr);
      mixFn(ajaxSettings.complete, args.complete, args.global).call(args.context, xhr, xhr.status, xhr.statusText);
    }

    function handleError() {
      if (timeout) {
        clearTimeout(timeout);
      }
      mixFn(ajaxSettings.error, args.error, args.global).call(args.context, xhr, xhr.status, xhr.statusText);
      mixFn(ajaxSettings.complete, args.complete, args.global).call(args.context, xhr, xhr.status, xhr.statusText);
    }

    function handleProgress(event) {
      mixFn(ajaxSettings.progress, args.progress, args.global).call(args.context, event, xhr, xhr.status, xhr.statusText);
    }

    if (mixFn(ajaxSettings.beforeSend, args.beforeSend, args.global).call(args.context, xhr) === false) {
      xhr.abort();
      handleError();
      return xhr;
    }

    if (args.async && args.timeout > 0) {
      timeout = setTimeout(function () {
        if (xhr.readyState < 4) {
          xhr.abort();
          handleError();
        }
      }, args.timeout);
    }

    if (type === 'GET' && data) {
      url += url.indexOf("?") > -1 ? ("&" + data) : ("?" + data);
      data = null;
    }

    if (dataType === "jsonp") {
      url += ((url.indexOf("?") > -1 ? "&" : "?") + "callback=" + args.callbackName);
      loadJsonp(url, handleSuccess, handleError);
      return xhr;
    }

    if ('onload' in xhr) {
      xhr.addEventListener('load', function ajaxOnLoad() {
        xhr.removeEventListener('load', ajaxOnLoad, false);
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          handleSuccess();
        }
      }, false);

      xhr.addEventListener('error', function ajaxOnError() {
        xhr.removeEventListener('error', ajaxOnError, false);
        handleError();
      }, false);
    }
    else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            xhr.onreadystatechange = new Function;
            handleSuccess();
          } else {
            handleError();
          }
        }
      };
    }

    if('progress' in xhr) {
      if (ajaxSettings.progress || args.progress) {

        var loadEndHandler = function() {
          xhr.removeEventListener('progress', handleProgress, false);
          xhr.upload.removeEventListener('progress', handleProgress, false);
          xhr.removeEventListener('loadend', loadEndHandler, false);
          xhr.upload.removeEventListener('loadend', loadEndHandler, false);
        };

        xhr.addEventListener('progress', handleProgress, false);
        xhr.upload.addEventListener('progress', handleProgress, false);
        xhr.addEventListener('loadend', loadEndHandler, false);
        xhr.upload.addEventListener('loadend', loadEndHandler, false);

      }
    }

    xhr.open(type, url, args.async);

    if (args.cors) {
      args.xhrFields.withCredentials = true;
    }

    for (var name in args.xhrFields) {
      xhr[name] = args.xhrFields[name];
    }

    if (!args.crossDomain || !args.cors) {
      args.headers["X-Requested-With"] = "XMLHttpRequest";
    }

    args.headers['Content-Type'] = args.contentType;

    for (var header in args.headers) {
      xhr.setRequestHeader(header, args.headers[header]);
    }

    xhr.setRequestHeader("Accept", args.accepts[dataType] ?
      args.accepts[dataType] + ", */*; q=0.01" :
      args.accepts._default);

    xhr.send(data);

    return xhr;
  }

  var Request = EC.Event.extend({
    initialize: function (params) {
      var self = this;
      Request.superclass.initialize.call(this);

      var _suc = params.success;
      var _err = params.error;
      var _complete = params.complete;

      params.success = function () {
        var args = [].slice.call(arguments);
        _suc && _suc.apply(self, args);
        self.dispatch.apply(self, ['success'].concat(args));
      };

      params.error = function () {
        var args = [].slice.call(arguments);
        _err && _err.apply(self, args);
        self.dispatch.apply(self, ['error'].concat(args));
      };

      params.complete = function () {
        var args = [].slice.call(arguments);
        _complete && _complete.apply(self, args);
        self.dispatch.apply(self, ['complete'].concat(args));
      };

      createAJAX(params);

      return this;
    },
    then: function (onFulfilled, onRejected) {
      if (onFulfilled) {
        this.on("success", onFulfilled);
      }
      if (onRejected) {
        this.on("error", onRejected);
      }

      return this;
    },
    catch: function (onRejected) {
      if (onRejected) {
        this.on("error", onRejected);
      }

      return this;
    },
    always: function (onAlways) {
      if (onAlways) {
        this.on("complete", onAlways);
      }

      return this;
    }
  });

  var loadJSON = function (url, sucFn, errFn) {
    url = regHttps.test(url) ? url : (RES.baseUrl + url);
    return createAJAX({
      url: url,
      dataType: 'json',
      success: sucFn,
      error: function () {
        errFn.apply(null, arguments);
        console.error('fail load:' + url);
      }
    });
  };

  var loadAsset = function (cfgItem, callback) {
    if (typeof cfgItem !== 'object') {
      return;
    }

    if (cfgItem.type === 'image') {
      loadTexture(cfgItem, function () {
        callback && callback(cfgItem);
      });
    }
    else if (/^(?:json|sheet|font)$/.test(cfgItem.type)) {
      loadJSON(cfgItem.url, function (data) {
        var obj = EC.extend({}, cfgItem, {data: data});
        assets[cfgItem.name] = obj;

        if (cfgItem.type === 'sheet' || cfgItem.type === 'font') {
          var url = cfgItem.url.substr(0, cfgItem.url.lastIndexOf("/") + 1) + data.file;
          var name = data.file.replace(/\.(\w+)$/, "_$1");
          var resObj = EC.extend({}, cfgItem, {url: url, name: name, type: 'image'});
          loadTexture(resObj, function () {
            callback && callback(obj);
          });
        } else {
          callback && callback(obj);
        }
      });
    }
    else {
      assets[cfgItem.name] = cfgItem;
      callback && callback(cfgItem);
    }

  };

  var getAsset = function () {
    return assets;
  };

  var getRes = function (resId, sheetKey) {
    var pathReg = /\[(\d+\-\d+)\]/;
    var pathRes = pathReg.exec(resId);

    if (pathRes) {
      var textureGroup = [];
      var path = RegExp.$1.split('-');
      var pathPre = resId.replace(pathReg, "").split("_");
      for (var i = Number(path[0]); i < Number(path[1]) + 1; i++) {
        var pathId = pathPre[0] + i + "_" + pathPre[1];
        textureGroup.push(assets[pathId]);
      }

      return textureGroup;
    }

    var asset = assets[resId];

    if (asset === undefined) {
      return console.error(resId + " does not exist!");
    }

    if (asset.type === 'json' || asset.type === 'sheet') {
      if (sheetKey) {
        var resConfig = {};
        var data = asset.data.frames[sheetKey];
        resConfig.width = data.w;
        resConfig.height = data.h;
        resConfig.sx = data.x;
        resConfig.sy = data.y;
        resConfig.swidth = data.w;
        resConfig.sheight = data.h;
        resConfig.texture = asset.texture;
        return resConfig;
      }
      return asset.data;
    }
    else {
      return asset;
    }

    return null;
  };

  var getTexture = function (resId) {
    var res = getRes(resId);
    if (res) {
      return res.texture;
    } else {
      return null;
    }
  };

  var getElement = function (selector, container) {
    if (typeof selector !== 'string') return selector;

    if (!/^(#|\.)/.test(selector)) return null;

    var type = selector.charAt(0);
    container = container || document;

    if (type === "#") {
      return document.getElementById(selector.substr(1, selector.length));
    }

    if (!!document.querySelectorAll) {
      return container.querySelectorAll(selector);
    } else {
      try {
        return container.getElementsByClassName(selector);
      } catch (e) {
        var ary = [];
        var els = container.getElementsByTagName('*');
        els.forEach(function (el) {
          if ((" " + el.className + " ").indexOf(" " + selector + " ") > -1) {
            ary.push(el);
          }
        });

        return ary;
      }
    }
  };

  var getKeys = function (groupKey, data) {
    var group = data.groups.find(function (group) {
      return group.name === groupKey;
    });

    if (group === undefined) {
      return console.error('group "' + groupKey + '" dose not exsit!');
    }

    var keys = group.keys.split(",").map(function (key) {
      return key.trim();
    });

    return keys;
  };

  var getLoadGroup = function (resources, keys) {
    var groupRes = [];
    resources.forEach(function (res) {
      if (keys.indexOf(res.name) > -1) {
        groupRes.push(res);
      }
    });

    return groupRes;
  };

  var LoadGroup = EC.Event.extend({
    initialize: function (groupKey, data) {

      var keys = getKeys(groupKey, data);

      if (keys === undefined) return;

      var sources = getLoadGroup(data.resources, keys);

      var self = this,
        loaded = 0,
        total = sources.length;

      LoadGroup.superclass.initialize.call(this);

      sources.forEach(function (source) {
        loadAsset(source, function () {
          self.dispatch('progress', ++loaded, total, source);
          if (loaded > total - 1) {
            self.dispatch('complete');
          }
        });
      });

      return this;
    }
  });

  EC.extend(RES, {
    loadImage: function (src) {
      return new ImgLoader(src);
    },
    ajaxSetup: globalAjaxSetup,
    ajax: function (params) {
      return createAJAX(params);
    },
    request: function (params) {
      return new Request(params);
    },
    loadScript: function (url) {
      return new ScriptLoader(url);
    },
    loadJson: function (url) {
      return new Request({url: url, dataType: "json"});
    },
    loadJsonp: function (url) {
      return new JsonpLoader(url);
    },
    loadGroup: function (groupKey, data) {
      return new LoadGroup(groupKey, data);
    },
    getAsset: getAsset,
    getRes: getRes,
    getTexture: getTexture,
    el: getElement,
    baseUrl: 'images/'
  });

  ['get', 'post', 'getJSON'].forEach(function (type, index) {
    RES.request[type] = function (url, params) {
      type = type.replace(/(JSON)?$/, "");
      return new Request({url: url, type: type, data: params, dataType: index === 2 ? 'json' : 'text'});
    };
  });

})(window.RES || (window.RES = {}));

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
      this._frameRate = options.frameRate || 60;

      if (this._frameRate < 60) {
        this.useInterval = true;
      }
    },

    start: function () {
      var self = this;

      if (this.useInterval) {
        self.dispatch('ticker');
        self._ticker = setInterval(function() {
          self.dispatch('ticker', Date.now());
        }, 1000 / self._frameRate);
      }
      else {
        +function runTicker() {
          self._ticker = requestAnimationFrame(runTicker);
          self.dispatch('ticker', Date.now());
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
/**
 * Created by semdy on 2016/9/6.
 */
(function (EC) {
  "use strict";

  /**
   * Easing
   * **/
  var Easing = {

    Linear: {

      None: function (k) {

        return k;

      }

    },

    Quadratic: {

      In: function (k) {

        return k * k;

      },

      Out: function (k) {

        return k * (2 - k);

      },

      InOut: function (k) {

        if ((k *= 2) < 1) {
          return 0.5 * k * k;
        }

        return -0.5 * (--k * (k - 2) - 1);

      }

    },

    Cubic: {

      In: function (k) {

        return k * k * k;

      },

      Out: function (k) {

        return --k * k * k + 1;

      },

      InOut: function (k) {

        if ((k *= 2) < 1) {
          return 0.5 * k * k * k;
        }

        return 0.5 * ((k -= 2) * k * k + 2);

      }

    },

    Quartic: {

      In: function (k) {

        return k * k * k * k;

      },

      Out: function (k) {

        return 1 - (--k * k * k * k);

      },

      InOut: function (k) {

        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k;
        }

        return -0.5 * ((k -= 2) * k * k * k - 2);

      }

    },

    Quintic: {

      In: function (k) {

        return k * k * k * k * k;

      },

      Out: function (k) {

        return --k * k * k * k * k + 1;

      },

      InOut: function (k) {

        if ((k *= 2) < 1) {
          return 0.5 * k * k * k * k * k;
        }

        return 0.5 * ((k -= 2) * k * k * k * k + 2);

      }

    },

    Sinusoidal: {

      In: function (k) {

        return 1 - Math.cos(k * Math.PI / 2);

      },

      Out: function (k) {

        return Math.sin(k * Math.PI / 2);

      },

      InOut: function (k) {

        return 0.5 * (1 - Math.cos(Math.PI * k));

      }

    },

    Exponential: {

      In: function (k) {

        return k === 0 ? 0 : Math.pow(1024, k - 1);

      },

      Out: function (k) {

        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

      },

      InOut: function (k) {

        if (k === 0) {
          return 0;
        }

        if (k === 1) {
          return 1;
        }

        if ((k *= 2) < 1) {
          return 0.5 * Math.pow(1024, k - 1);
        }

        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);

      }

    },

    Circular: {

      In: function (k) {

        return 1 - Math.sqrt(1 - k * k);

      },

      Out: function (k) {

        return Math.sqrt(1 - (--k * k));

      },

      InOut: function (k) {

        if ((k *= 2) < 1) {
          return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }

        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

      }

    },

    Elastic: {

      In: function (k) {

        if (k === 0) {
          return 0;
        }

        if (k === 1) {
          return 1;
        }

        return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

      },

      Out: function (k) {

        if (k === 0) {
          return 0;
        }

        if (k === 1) {
          return 1;
        }

        return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

      },

      InOut: function (k) {

        if (k === 0) {
          return 0;
        }

        if (k === 1) {
          return 1;
        }

        k *= 2;

        if (k < 1) {
          return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        }

        return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

      }

    },

    Back: {

      In: function (k) {

        var s = 1.70158;

        return k * k * ((s + 1) * k - s);

      },

      Out: function (k) {

        var s = 1.70158;

        return --k * k * ((s + 1) * k + s) + 1;

      },

      InOut: function (k) {

        var s = 1.70158 * 1.525;

        if ((k *= 2) < 1) {
          return 0.5 * (k * k * ((s + 1) * k - s));
        }

        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

      }

    },

    Bounce: {

      In: function (k) {

        return 1 - Easing.Bounce.Out(1 - k);

      },

      Out: function (k) {

        if (k < (1 / 2.75)) {
          return 7.5625 * k * k;
        } else if (k < (2 / 2.75)) {
          return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        } else if (k < (2.5 / 2.75)) {
          return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        } else {
          return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
        }

      },

      InOut: function (k) {

        if (k < 0.5) {
          return Easing.Bounce.In(k * 2) * 0.5;
        }

        return Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

      }

    }

  };

  EC.provide({
    Easing: Easing
  });

})(window.EC);
/**
 * Created by semdy on 2016/9/6.
 */
(function (EC, undefined) {
  "use strict";

  /**
   * Tween 动画类
   * **/

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

  var isFunction = EC.isFunction;
  var isNumber = EC.isNumber;
  var queueManager = new QueueManager();

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
    this._id = EC.groupManager.nextId();

    if (_cfg.reverse === true) {
      this._repeatCount = 2;
    }

    if (isNumber(_cfg.loop)) {
      this._repeatCount = _cfg.loop;
    }

    if(_cfg.loop === true || _cfg.yoyo === true) {
      this._repeatCount = -1;
    }

    setTimeout(this.start.bind(this));
  };

  Tween.get = function (obj, cfg) {
    return new Tween(obj, cfg);
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

      EC.groupManager.add(this);
      this._tweenObj._tweenId = this.getId();
      this._isPlaying = true;
      this._startCallbackFired = false;

      return this;
    },
    stop: function(){
      var tweenInstance = EC.groupManager.get(this._tweenObj._tweenId);
      if(tweenInstance) {
        tweenInstance._stopTween();
      }

      return this;
    },
    _stopTween: function () {
      if (!this._isPlaying) {
        return this;
      }

      EC.groupManager.remove(this);
      queueManager.remove(this);
      this._clearTimeline();
      delete this._tweenObj._tweenId;
      this._isPlaying = false;
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
    update: function (time) {

      var percent, _object, value,
        elapse = (time || Date.now()) - this._startTime;

      if(this._waitTime > 0) {
        if(elapse >= this._waitTime) {
          this._timeup = true;
        }
        return true;
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

            return true;

          } else {
            this.stop();
            return false;
          }

        } else {
          return true;
        }
      }

      return true;
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
/**
 * Created by semdy on 2016/9/6.
 */

(function (EC, undefined) {
  "use strict";

  var EVENTS = EC.EVENTS,
    isTouch = EC.isTouch,
    isFirefox = /Firefox\/([\d.]+)/.test(navigator.userAgent);

  function getBoundingClientRect(el) {
    // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect
    try {
      return el.getBoundingClientRect();
    }
    catch (e) {
      return {
        left: 0,
        top: 0
      };
    }
  }

  function getBounding(el, e) {
    if (isFirefox && e.layerX !== undefined && e.layerX !== e.offsetX) {
      return {
        x: e.layerX,
        y: e.layerY
      }
    }
    else if (e.offsetX !== undefined) {
      return {
        x: e.offsetX,
        y: e.offsetY
      }
    }
    else {
      var box = getBoundingClientRect(el);
      return {
        x: e.clientX - box.left,
        y: e.clientY - box.top
      }
    }
  }

  var TouchEvent = function () {
    this.enableStack = [];
    this._touchX = 0;
    this._touchY = 0;
    this._lastObject = null;
    this._touchTimer = null;
  };

  TouchEvent.prototype = {
    attach: function (stage) {
      this.stage = stage;
      this.element = stage.canvas;
      this._startTime = 0;
      this._bindEvents();
    },
    _bindEvents: function () {
      this.element.addEventListener(EVENTS.START, this._onTouchStart.bind(this), false);
      this.element.addEventListener(EVENTS.MOVE, this._onTouchMove.bind(this), false);
      this.element.addEventListener(EVENTS.END, this._onTouchEnd.bind(this), false);
      this.element.addEventListener("mouseout", this._onMouseOut.bind(this), false);
    },
    _onTouchStart: function (event) {
      //event.preventDefault();
      event = isTouch ? event.targetTouches[0] : event;

      this._startTime = Date.now();

      this._clearTouchTimer();
      this._setTouchXY(event);
      this.enableStack = this._getTouchEnables();

      this._triggerEvent("touchstart", event);

      this._touchTimer = setTimeout(function () {
        this._triggerEvent("longtouch", event);
      }.bind(this), 350);
    },
    _onTouchMove: function (event) {
      event.preventDefault();
      event = isTouch ? event.changedTouches[0] : event;

      this._clearTouchTimer();

      if (!EC.isTouch) {
        this.enableStack = this._getTouchEnables();
      }

      this._setTouchXY(event);
      this._triggerEvent("touchmove", event);
    },
    _onTouchEnd: function (event) {
      event = isTouch ? event.changedTouches[0] : event;

      this._clearTouchTimer();
      this._setTouchXY(event);
      this._triggerEvent("touchend", event);

      var diffTime = Date.now() - this._startTime;

      if (diffTime < 200) {
        this._triggerEvent("touch", event);
      }

      this._resetTouch();
    },
    _onMouseOut: function () {
      this._clearTouchTimer();
      this._resetTouch();
      this._triggerLastStack();
    },
    _clearTouchTimer: function () {
      if (this._touchTimer) {
        clearTimeout(this._touchTimer);
      }
    },
    _resetTouch: function () {
      this._lastObject = null;
    },
    _triggerEvent: function (type, event) {
      var self = this;
      var ratio = this.stage.scaleRatio;
      var isMouseMove = !EC.isTouch && type === "touchmove";
      var enableObject = this.enableStack.find(function (obj) {
        return EC.isPointInPath({x: self._touchX * ratio, y: self._touchY * ratio}, obj);
      });

      if (isMouseMove && this._lastObject !== enableObject) {
        this._triggerLastStack();
      }

      if (enableObject) {
        var eventObj = EC.extend({
          type: type,
          stageX: this._touchX * ratio,
          stageY: this._touchY * ratio,
          scaleRatio: ratio
        }, this._getOriginalEventProps(event));

        event = new Event(event, eventObj);

        var obj = enableObject;
        while (obj) {

          if (event.isPropagationStopped()) break;

          if (obj.$type === "Sprite" || obj.$type === "Stage") {
            if (obj.touchEnabled) {
              obj.dispatch(type, EC.extend(event, {target: this._getTouchedTarget(obj) || obj}));
            }
          } else {
            obj.dispatch(type, EC.extend(event, {target: obj}));
          }

          if (isMouseMove && obj.touchEnabled && !obj._touchentered && this._lastObject !== obj) {
            obj.dispatch("touchenter", EC.extend(event, {type: "touchenter", target: obj}));
            if (obj.cursor) {
              this.element.style.cursor = obj.cursor;
            }
            obj._touchentered = true;
          }

          obj = obj.parent;
        }

      }

      this._lastObject = enableObject;
    },
    _triggerLastStack: function () {
      var obj = this._lastObject;

      if (obj) {
        obj.dispatch("touchout", {type: "touchout", target: obj});
        this.element.style.cursor = "";
        this._lastObject = null;
      }

      while (obj) {
        delete obj._touchentered;
        obj = obj.parent;
      }
    },
    _getTouchedTarget: function (target) {
      var elStack = [];
      var self = this;
      var ratio = this.stage.scaleRatio;

      function getItems(obj) {
        var childs = obj.getChilds();
        var i = childs.length;
        while (i--) {
          if (!childs[i].visible) continue;
          if (childs[i].$type === "Sprite") {
            getItems(childs[i]);
          } else {
            elStack.push(childs[i]);
          }
        }
      }

      getItems(target);

      return elStack.find(function (obj) {
        return EC.isPointInPath({x: self._touchX * ratio, y: self._touchY * ratio}, obj);
      });
    },
    _getTouchEnables: function () {
      var enableStack = [];

      function getItems(obj) {
        var childs = obj.getChilds();
        var i = childs.length;
        while (i--) {
          if (!childs[i].visible) continue;
          if (childs[i].$type === "Sprite") {
            getItems(childs[i]);
          }
          if (childs[i].touchEnabled) {
            enableStack.push(childs[i]);
          }
        }
      }

      getItems(this.stage);

      if (this.stage.touchEnabled) {
        enableStack.push(this.stage);
      }

      return enableStack;
    },
    _getOriginalEventProps: function (event) {
      var props = {};
      ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY", "radiusX", "radiusY", "rotationAngle"].forEach(function (prop) {
        props[prop] = event[prop];
      });

      return props;
    },
    _setTouchXY: function (event) {
      var bound = getBounding(this.element, event);
      this._touchX = bound.x;
      this._touchY = bound.y;
    }
  };

  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  }

  var Event = function (src, props) {

    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;

      this.isDefaultPrevented = src.defaultPrevented ||
      src.defaultPrevented === undefined &&

      // Support: Android <=2.3 only
      src.returnValue === false ?
        returnTrue :
        returnFalse;

      this.target = src.target;
      this.currentTarget = src.currentTarget;
      this.relatedTarget = src.relatedTarget;

    } else {
      this.type = src;
    }

    if (props) {
      EC.extend(this, props);
    }

    this.timeStamp = src && src.timeStamp || Date.now();

  };

  Event.prototype = {
    constructor: Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function () {
      var e = this.originalEvent;

      this.isDefaultPrevented = returnTrue;

      if (e) {
        e.preventDefault();
      }
    },
    stopPropagation: function () {
      var e = this.originalEvent;

      this.isPropagationStopped = returnTrue;

      if (e) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function () {
      var e = this.originalEvent;

      this.isImmediatePropagationStopped = returnTrue;

      if (e) {
        e.stopImmediatePropagation();
      }

      this.stopPropagation();
    }
  };

  EC.provide({
    TouchEvent: TouchEvent
  });

})(window.EC);
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
        var touches = getEvent(evt),
          currentX = touches.pageX * this.scaleRatio,
          currentY = touches.pageY * this.scaleRatio;

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

        if (touches.length === 1) {
          if (this.x2 !== null) {
            evt.deltaX = currentX - this.x2;
            evt.deltaY = currentY - this.y2;

          } else {
            evt.deltaX = 0;
            evt.deltaY = 0;
          }
          this.pressMove.call(this, evt, this.target[this.property]);
        }
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
        var self = this,
          current = this.target[this.property],
          touches = getEvent(evt),
          pageX = touches.pageX * this.scaleRatio,
          pageY = touches.pageY * this.scaleRatio,
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

/**
 * Created by semdy on 2016/4/20
 */

;(function (EC, undefined) {
  "use strict";

  var PI = Math.PI;
  var CONST_ANGLE = PI / 180;
  var slice = Array.prototype.slice;
  var tmpCtx = document.createElement("canvas").getContext("2d");

  function drawImg(ctx, obj) {
    if (!obj.texture) return;
    if (obj.sx !== undefined) {
      var
        _width = ctx.canvas.width,
        _height = ctx.canvas.height,
        swidth = obj.swidth,
        sheight = obj.sheight;

      if (swidth >= _width) swidth = _width - 1;
      if (sheight >= _height) sheight = _height - 1;
      ctx.drawImage(obj.texture, obj.sx, obj.sy, swidth, sheight, 0, 0, obj.width, obj.height);
    } else {
      ctx.drawImage(obj.texture, 0, 0, obj.width, obj.height);
    }
  }

  function fillBitMapText(obj) {
    var data = obj.fontData.frames;
    var texture = obj.fontTexture;
    var startX = 0;
    var lastWidth = 0;
    var item;
    var bitMapText;
    var textwrap = obj.$textwrap;

    textwrap.children.length = 0;
    obj.$textArr.forEach(function (n) {
      item = data[n];
      bitMapText = new BitMap().setParams({
        texture: texture,
        width: item.w,
        height: item.h,
        sx: item.x,
        sy: item.y,
        x: startX += (lastWidth + obj.letterSpacing),
        swidth: item.w,
        sheight: item.h
      });

      lastWidth = item.w;
      textwrap.addChild(bitMapText);

    });

    if (obj.textAlign === 'center') {
      textwrap.x = (obj.width - textwrap.width) / 2;
    }
    else if (obj.textAlign === 'right') {
      textwrap.x = obj.width - textwrap.width;
    }
  }

  function drawBitMapText(ctx, obj) {
    fillBitMapText(obj);
    ctx.save();
    ctx.translate(obj.$textwrap.x, obj.$textwrap.y);
    obj.$textwrap.each(function (childObj) {
      ctx.save();
      ctx.translate(childObj.x, childObj.y);
      drawImg(ctx, childObj);
      ctx.restore();
    });
    ctx.restore();
  }

  function drawText(ctx, obj) {
    ctx.font = obj.font || (obj.textStyle + " " + obj.textWeight + " " + obj.size + "px " + obj.fontFamily);
    ctx.textAlign = obj.textAlign;
    ctx.textBaseline = obj.textBaseline;

    var textX = obj.textAlign === "center" ? obj.width / 2 : (obj.textAlign === "right" ? obj.width : 0),
      textY = 0;

    if (!obj.strokeOnly) {
      if (obj.textColor) {
        ctx.fillStyle = obj.textColor;
      }
      drawMultiText(ctx, "fillText", obj, textX, textY);
    }

    if (obj.stroke || obj.strokeOnly) {
      if (obj.strokeColor) {
        ctx.strokeStyle = obj.strokeColor;
      }
      drawMultiText(ctx, "strokeText", obj, textX, textY);
    }
  }

  function drawMultiText(ctx, drawType, obj, initX, initY) {
    var lineHeight = obj.size + obj.lineSpacing;
    obj.$textArr.forEach(function (text, i) {
      ctx[drawType](text, initX, initY + lineHeight * i);
    });
  }

  function calcTextArr(obj, str) {
    var lineWidth = 0;
    var strArr = str.split("");

    for (var i = 0; i < strArr.length; i++) {
      if (strArr[i] === '\n') {
        lineWidth = 0;
        continue;
      }
      lineWidth += getTextWidth(obj, strArr[i]);
      if (lineWidth > obj.width) {
        lineWidth = 0;
        strArr.splice(i, 0, "\n");
      }
    }

    return strArr.join("");
  }

  function getMaxLenText(textArr) {
    if (textArr.length === 1) {
      return textArr[0];
    }
    var maxLens = textArr.map(function (text) {
      return text.length;
    });
    return textArr[maxLens.indexOf(getMax(maxLens))];
  }

  function getTextWidth(obj, text) {
    tmpCtx.font = obj.font || (obj.textStyle + " " + obj.textWeight + " " + obj.size + "px " + obj.fontFamily);
    tmpCtx.textAlign = obj.textAlign;
    return tmpCtx.measureText(text).width;
  }

  function drawShape(ctx, obj) {
    ctx.beginPath();
    drawShapeContext(ctx, obj);
    obj.draw(ctx);
  }

  function drawContext(ctx, obj) {
    var parent = obj.parent || {};
    var moveX = obj.moveX * (obj.anchorX > 0 ? 1 : 0);
    var moveY = obj.moveY * (obj.anchorY > 0 ? 1 : 0);
    var anchorW = obj.anchorX * obj.width;
    var anchorH = obj.anchorY * obj.height;
    var x = obj.x + moveX + anchorW - ( obj.isMasker ? 0 : (parent.mask ? parent.mask.x : 0 ));
    var y = obj.y + moveY + anchorH - ( obj.isMasker ? 0 : (parent.mask ? parent.mask.y : 0 ));

    if (obj.alpha < 1) {
      ctx.globalAlpha = obj.alpha;
    }
    if (x !== 0 || y !== 0) {
      ctx.translate(x, y);
    }
    if (obj.scaleX !== 1 || obj.scaleY !== 1) {
      ctx.scale(obj.scaleX, obj.scaleY);
    }
    if (obj.skewX !== 0 || obj.skewY !== 0) {
      ctx.transform(1, obj.skewX, obj.skewY, 1, 0, 0);
    }
    if (obj.rotation !== 0) {
      ctx.rotate(obj.rotation * CONST_ANGLE);
    }
    if (obj.anchorX > 0 || obj.anchorY > 0) {
      ctx.translate(-moveX - anchorW, -moveY - anchorH);
    }
  }

  function drawShapeContext(ctx, obj) {
    if (obj.fillStyle) {
      ctx.fillStyle = obj.fillStyle;
    }
    if (obj.strokeStyle) {
      ctx.strokeStyle = obj.strokeStyle;
    }
    if (obj.shadowColor) {
      ctx.shadowColor = obj.shadowColor;
    }
    if (obj.shadowBlur > 0) {
      ctx.shadowBlur = obj.shadowBlur;
    }
    if (obj.shadowOffsetX > 0) {
      ctx.shadowOffsetX = obj.shadowOffsetX;
    }
    if (obj.shadowOffsetY > 0) {
      ctx.shadowOffsetY = obj.shadowOffsetY;
    }
    if (obj.lineCap) {
      ctx.lineCap = obj.lineCap;
    }
    if (obj.lineJoin) {
      ctx.lineJoin = obj.lineJoin;
    }
    if (obj.lineWidth > 0) {
      ctx.lineWidth = obj.lineWidth;
    }
    if (obj.miterLimit) {
      ctx.miterLimit = obj.miterLimit;
    }
    if (obj.dashLength > 0) {
      try {
        ctx.setLineDash([obj.dashLength, obj.dashGap || obj.dashLength]);
      } catch (e) {}
    }
  }

  function getMin(vals) {
    return Math.min.apply(Math, vals);
  }

  function getMax(vals) {
    return Math.max.apply(Math, vals);
  }

  function getLineSize(coords, moveX, moveY) {
    var widths = [moveX],
        heights = [moveY];
    coords.forEach(function (coord) {
      widths.push(coord[0]);
      heights.push(coord[1]);
    });

    return {
      width: getMax(widths) - getMin(widths),
      height: getMax(heights) - getMin(heights)
    }
  }

  function getQuadraticLineSize(coords, moveX, moveY) {
    var widths = [moveX], heights = [moveY];
    coords.forEach(function (coord, i) {
      if (i % 2 === 0) {
        widths.push(coord);
      } else {
        heights.push(coord);
      }
    });

    return {
      width: getMax(widths) - getMin(widths),
      height: getMax(heights) - getMin(heights)
    }
  }

  function getTotalOffset(object, includeMoveOffset) {
    var x = object.x + ( includeMoveOffset ? object.moveX : 0 );
    var y = object.y + ( includeMoveOffset ? object.moveY : 0 );
    var parent = object.parent;
    while (parent) {
      x += parent.x;
      y += parent.y;
      parent = parent.parent;
    }

    return {
      x: x,
      y: y
    }
  }

  function isPointInPath(coord, object) {
    var objectOffset = getTotalOffset(object);
    var ctx = object.renderContext;

    var ObjConstructor = function () {};
    ObjConstructor.prototype = object;
    var newObj = new ObjConstructor();
    newObj.x = objectOffset.x;
    newObj.y = objectOffset.y;

    ctx.save();
    drawContext(ctx, newObj);
    ctx.beginPath();
    drawShapeFuns[newObj.drawType||'rect'](ctx, newObj);
    ctx.restore();

    return ctx.isPointInPath(coord.x, coord.y);
  }

  function Bounds(object) {
    var offset = getTotalOffset(object, true);
    this.x = offset.x;
    this.y = offset.y;
    this.width = object.width;
    this.height = object.height;
  }

  Bounds.prototype = {
    intersects: function (target) {
      if((target.x <= this.x + this.width) && (target.x + target.width >= this.x) &&
        (target.y <= this.y + this.height) && (target.y + target.height >= this.y)) {
        return true;
      }

      return false;
    }
  };

  var drawShapeFuns = {
    rect: function (ctx, obj) {
      ctx.rect(obj.moveX, obj.moveY, obj.width, obj.height);
    },

    arc: function (ctx, obj) {
      ctx.arc(obj.radius + obj.moveX, obj.radius + obj.moveY, obj.radius, obj.startAngle * PI, obj.endAngle * PI, obj.counterclockwise);
    },

    sector: function (ctx, obj) {
      ctx.moveTo(obj.radius + obj.moveX, obj.radius + obj.moveY);
      this.arc.apply(this, arguments);
    },

    arcTo: function (ctx, obj) {
      ctx.moveTo(obj.moveX, obj.moveY);
      ctx.arcTo(obj.startX, obj.startY, obj.endX, obj.endY, obj.radius);
    },

    roundRect: function (ctx, obj) {
      ctx.roundRect(obj.moveX, obj.moveY, obj.width, obj.height, obj.radius);
    },

    lineTo: function (ctx, obj) {
      ctx.moveTo(obj.moveX, obj.moveY);
      obj.coords.forEach(function (coord) {
        ctx.lineTo.apply(ctx, coord);
      });
    },

    line: function (ctx, obj) {
      ctx.moveTo(obj.moveX, obj.moveY);
      ctx.lineTo(obj.endX, obj.endY);
    },

    dashedLine: function (ctx, obj) {
      ctx.dashedLine(obj.moveX, obj.moveY, obj.endX, obj.endY, obj.dashLength);
    },

    ellipse: function (ctx, obj) {
      ctx.ellipse(obj.width / 2 + obj.moveX, obj.height / 2 + obj.moveY, obj.width, obj.height);
    },

    clip: function (ctx) {
      ctx.clip();
    },

    quadraticCurveTo: function (ctx, obj) {
      ctx.moveTo(obj.moveX, obj.moveY);
      ctx.quadraticCurveTo.apply(ctx, obj.coords);
    },

    bezierCurveTo: function (ctx, obj) {
      ctx.moveTo(obj.moveX, obj.moveY);
      ctx.bezierCurveTo.apply(ctx, obj.coords);
    }
  };

  /**
   * DisplayObject 操作基类
   * **/
  var DisplayObject = EC.Event.extend({

    initialize: function () {
      DisplayObject.superclass.initialize.call(this);

      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;

      this.alpha = 1;
      this.scaleX = 1;
      this.scaleY = 1;
      this.rotation = 0;
      this.skewX = 0;
      this.skewY = 0;
      this.anchorX = 0;
      this.anchorY = 0;
      this.moveX = 0;
      this.moveY = 0;

      this.visible = true;
      this.touchEnabled = false;
      this._stageAdded = false;
      this._stageAddFired = false;

      this.cursor = 'pointer';
      this.$type = 'DisplayObject';

      this.children = [];

      this.once("addToStage", function (e) {
        this.renderContext = e.renderContext;
        this.stage = e.stage;
        this._stageAdded = true;
        this._stageAddFired = true;
      }, this);
    },

    remove: function(){
      if(this.parent){
        this.parent.removeChild(this);
      }

      return this;
    },

    each: function (iterator, context) {
      var childs = this.children,
        i = 0, len = childs.length;

      for (; i < len; i++) {
        if (iterator.call(context || this, childs[i], i, childs) === false) break;
      }

      return this;
    },

    broadcast: function () {
      var args = slice.call(arguments);

      function _triggerEvent(obj) {
        if (obj.visible) {
          obj.dispatch.apply(obj, args);
          obj.each(function (obj) {
            _triggerEvent(obj);
          });
        }
      }

      _triggerEvent(this);

      return this;
    },

    emit: function () {
      var args = slice.call(arguments);
      var parent = this.parent;

      this.dispatch.apply(this, args);
      while (parent) {
        parent.dispatch.apply(parent, args);
        parent = parent.parent;
      }

      return this;
    },

    getBounds: function () {
      return new Bounds(this);
    },

    setParams: function (params) {
      if (EC.isObject(params)) {
        for (var i in params) {
          if (params.hasOwnProperty(i))
            this[i] = params[i];
        }
      }

      return this;
    },

    transform: function (scaleX, skewX, skewY, scaleY, x, y) {
      this.x = x;
      this.y = y;
      this.scaleX = scaleX;
      this.scaleY = scaleY;
      this.skewX = skewX;
      this.skewY = skewY;

      return this;
    },

    setTransform: function (rotation, skewX, skewY, scaleY, x, y) {
      this.x = x;
      this.y = y;
      this.rotation = rotation;
      this.scaleY = scaleY;
      this.skewX = skewX;
      this.skewY = skewY;

      return this;
    },

    observe: function (property, descriptor) {
      Object.defineProperty(this, property, descriptor);
      return this;
    },

    _triggerAddToStage: function (childObj, context) {
      var setParams = function(obj){
        return {target: obj, renderContext: context.renderContext, stage: context};
      };
      var _runAddToStage = function (obj) {
        if(!obj._stageAddFired){
          obj.dispatch("addToStage", setParams(obj));
          if (obj.$type === 'Sprite') {
            obj.each(_runAddToStage);
          }
        }
      };
      if(!childObj._stageAddFired) {
        childObj.dispatch("addToStage", setParams(childObj));
        childObj.each(_runAddToStage);
      }
    },

    _triggerRemove: function (childObj) {

      var _runRemove = function (obj) {

        obj.dispatch("remove", obj);

        if (obj.$type === 'Sprite') {
          obj.each(_runRemove);
        }
      };

      childObj.dispatch("remove", childObj);
      childObj.each(_runRemove);
    }
  });


  /**
   * DisplayObjectContainer 操作基类
   * **/
  var DisplayObjectContainer = DisplayObject.extend({
    initialize: function () {
      DisplayObjectContainer.superclass.initialize.call(this);

      this.$type = 'Sprite';

      this.observe('numChildren', {
        get: function () {
          return this.size();
        },
        enumerable: true
      });
    },

    addChildAt: function (object, index) {
      if (!(object instanceof DisplayObject)) {
        throw new TypeError(String(object) + " is not a instance of EC.DisplayObject");
      }

      if (object.parent) {
        object.parent.removeChild(object);
      }

      object.parent = this;

      if (!EC.isNumber(index)) {
        this.children.push(object);
      } else {
        this.children.splice(index, 0, object);
      }

      if(this._stageAdded){
        this._triggerAddToStage(object, this.stage);
      }

      return this;
    },

    addChild: function(object){
      return this.addChildAt(object);
    },

    removeChild: function (object) {
      this.getChilds().splice(this.getChildIndex(object), 1);
      this._stopTweens(object);
      this._triggerRemove(object);

      return this;
    },

    removeChildAt : function (i) {
      var c = this.children;
      if (c.length <= i) {
        return this;
      }

      var object = c.splice(i, 1)[0];
      if(object) {
        delete object.parent;
        this._stopTweens(object);
        this._triggerRemove(object);
      }

      return this;
    },

    removeAllChildren: function () {
      this._stopAllTweens();
      this.each(function(child) {
        this._triggerRemove(child);
      }, this);
      this.children.length = 0;
      this.$width = 0;
      this.$height = 0;

      return this;
    },

    getChilds: function () {
      return this.children;
    },

    getChildAt : function (i) {
      var c = this.children;
      if (c.length === 0 || c.length <= i) {
        return null;
      }

      return c[i];
    },

    getChildIndex: function (child) {
      return this.getChilds().indexOf(child);
    },

    contains: function (child) {
      return this.getChildIndex(child) > -1;
    },

    size: function () {
      return this.children.length;
    },

    setChildIndex: function (child, index) {
      this.children.splice(this.getChildIndex(child), 1);
      this.children.splice(index, 0, child);

      return this;
    },

    _stopTweens: function (target) {
      EC.Tween.removeTweens(target);
    },

    _stopAllTweens: function () {
      EC.Tween.removeAllTweens(this);
    }
  });

  /**
   * TextField 文字类
   * **/
  var TextField = DisplayObject.extend({
    initialize: function (text, size, x, y, color, align, family, width, height) {
      TextField.superclass.initialize.call(this);

      this.$text = text || "";
      this.$textArr = [];
      this.size = size || 16;
      this.textAlign = align || "start";
      this.textBaseline = "top";
      this.textColor = color || "#000";
      this.fontFamily = family || "Arial";
      this.strokeColor = color || "#000";
      this.textStyle = "normal";
      this.textWeight = "normal";
      this.lineSpacing = 2;
      this.stroke = false;
      this.strokeOnly = false;
      this.multiple = false;

      this.x = x || 0;
      this.y = y || 0;
      this.$width = width || 0;
      this.$height = height || 0;

      this.$type = "TextField";

      this.$hasW = false;
      this.$hasH = false;

      this.observe('text', {
        get: function () {
          return this.$text;
        },
        set: function (newVal) {
          this.$text = newVal;
          if (this.multiple) {
            this.$textArr = calcTextArr(this, newVal).split(/\n/);
          }
          else {
            this.$textArr = newVal.split(/\n/);
            if (!this.$hasW) {
              this.$width = getTextWidth(this, getMaxLenText(this.$textArr));
            }
          }
          if (!this.$hasH) {
            this.$height = (this.size + 4 + this.lineSpacing) * this.numLines - this.lineSpacing;
          }
        },
        enumerable: true
      });

      this.observe('numLines', {
        get: function () {
          return this.$textArr.length;
        },
        enumerable: true
      });

      this.observe('width', {
        set: function (newVal) {
          this.$width = newVal;
          this.$hasW = true;
        },
        get: function () {
          return this.$width;
        },
        enumerable: true
      });

      this.observe('height', {
        set: function (newVal) {
          this.$height = newVal;
          this.$hasH = true;
        },
        get: function () {
          return this.$height;
        },
        enumerable: true
      });

      if(this.$text) {
        this.text = this.$text;
      }

    }
  });

  /**
   * BitMap 位图类
   * **/
  var BitMap = DisplayObject.extend({
    initialize: function (key, x, y, width, height, sx, sy, swidth, sheight) {
      BitMap.superclass.initialize.call(this);

      this.x = x || 0;
      this.y = y || 0;

      this.texture = null;

      if (EC.isDefined(sx)) {
        this.sx = sx;
      }
      if (EC.isDefined(sy)) {
        this.sy = sy;
      }
      if (EC.isDefined(swidth)) {
        this.swidth = swidth || 0.1;
      }
      if (EC.isDefined(sheight)) {
        this.sheight = sheight || 0.1;
      }

      this.$type = "BitMap";

      if (EC.isDefined(key)) {
        this.setTexture(key);
      }

      if (EC.isDefined(width)) {
        this.width = width;
      }

      if (EC.isDefined(height)) {
        this.height = height;
      }

    },
    setTexture: function (data) {
      if (EC.isString(data)) {
        this.setTexture(RES.getRes(data));
      } else if (EC.isObject(data)) {
        if (data.nodeName === "IMG") {
          this.setParams({
            texture: data,
            width: data.width,
            height: data.height
          })
        } else {
          this.setParams(data);
        }
      } else {
        throw new TypeError(String(data) + " is a invalid texture");
      }

      return this;
    }
  });

  /**
   * Shape 图形界面
   * **/
  var Shape = DisplayObject.extend({
    initialize: function (x, y, w, h) {
      Shape.superclass.initialize.call(this);

      this.x = x || 0;
      this.y = y || 0;
      this.width = w || 0;
      this.height = h || 0;
      this.radius = 0;
      this.dashLength = 0;
      this.dashGap = 0;
      this.lineWidth = 0;
      this.fillStyle = null;
      this.strokeStyle = null;
      this.shadowColor = null;
      this.shadowBlur = 0;
      this.shadowOffsetX = 0;
      this.shadowOffsetY = 0;
      this.lineCap = null;
      this.lineJoin = null;
      this.miterLimit = null;
      this.coords = [];
      this._fill = false;
      this._stroke = false;
      this._closePath = false;

      this.$type = "Shape";
    },
    _setStyle: function (type, color, alpha) {
      if (typeof alpha === 'number' && alpha < 1) {
        this[type] = EC.Util.color.toRgb(color, alpha);
      } else {
        this[type] = color || "#000";
      }
    },
    fill: function () {
      var args = slice.call(arguments);
      args.unshift("fillStyle");
      this._fill = true;
      this._setStyle.apply(this, args);
    },
    stroke: function () {
      var args = slice.call(arguments);
      args.unshift("strokeStyle");
      this._stroke = true;
      this._setStyle.apply(this, args);
    },
    draw: function (ctx) {
      drawShapeFuns[this.drawType](ctx, this);
      this._closePath && ctx.closePath();
      this._fill && ctx.fill();
      this._stroke && ctx.stroke();
    },
    close: function () {
      this._closePath = true;
    }
  });

  EC.extend(Shape.prototype, {
    drawRect: function (x, y, width, height) {
      this.moveX = x;
      this.moveY = y;
      this.width = width;
      this.height = height;
      this.drawType = 'rect';
      return this;
    },
    drawArc: function (x, y, radius, startAngle, endAngle, counterclockwise) {
      this.moveX = x;
      this.moveY = y;
      this.radius = radius;
      this.startAngle = startAngle;
      this.endAngle = endAngle;
      this.counterclockwise = counterclockwise || false;
      this.width = this.radius * 2;
      this.height = this.radius * 2;
      this.drawType = 'arc';
      return this;
    },
    drawCircle: function (x, y, radius) {
      this.drawArc(x, y, radius, 0, 2, true);
      return this;
    },
    drawSector: function () {
      this.drawArc.apply(this, arguments);
      this.drawType = 'sector';
      return this;
    },
    arcTo: function (startX, startY, endX, endY, radius) {
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.radius = radius;
      this.width = startX - startY;
      this.height = radius;
      this.drawType = 'arcTo';
      return this;
    },
    drawRoundRect: function (x, y, width, height, radius) {
      this.moveX = x;
      this.moveY = y;
      this.width = width;
      this.height = height;
      this.radius = radius;
      this.drawType = 'roundRect';
      return this;
    },
    moveTo: function (x, y) {
      this.moveX = x;
      this.moveY = y;
      return this;
    },
    lineTo: function (x, y) {
      if(Array.isArray(x)) {
        [].push.apply(this.coords, x);
      } else {
        this.coords.push([x, y]);
      }
      var lineSize = getLineSize(this.coords, this.moveX, this.moveY);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'lineTo';
      return this;
    },
    drawLine: function (x, y, endX, endY) {
      this.moveX = x;
      this.moveY = y;
      this.endX = endX;
      this.endY = endY;
      this.width = endX - x;
      this.height = this.lineWidth;
      this.drawType = 'line';
      return this;
    },
    drawDashedLine: function (x, y, endX, endY, dashLength, dashGap) {
      this.moveX = x;
      this.moveY = y;
      this.endX = endX;
      this.endY = endY;
      this.dashLength = dashLength;
      this.dashGap = dashGap || dashLength;
      this.width = endX - x;
      this.height = this.lineWidth;
      this.drawType = 'dashedLine';
      return this;
    },
    drawEllipse: function (x, y, width, height) {
      this.moveX = x;
      this.moveY = y;
      this.width = width;
      this.height = height;
      this.drawType = 'ellipse';
      return this;
    },
    clip: function () {
      this.drawType = 'clip';
      return this;
    },
    quadraticCurveTo: function () {
      this.coords = slice.call(arguments);
      var lineSize = getQuadraticLineSize(this.coords, this.moveX, this.moveY);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'quadraticCurveTo';
      return this;
    },
    bezierCurveTo: function () {
      this.coords = slice.call(arguments);
      var lineSize = getQuadraticLineSize(this.coords, this.moveX, this.moveY);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'bezierCurveTo';
      return this;
    }
  });

  EC.extend(CanvasRenderingContext2D.prototype, {
    roundRect: function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;

      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    },
    dashedLine: function (x1, y1, x2, y2, dashLength) {
      if (this.setLineDash) {
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
      } else {
        var dashLen = dashLength === undefined ? 5 : dashLength,
          xpos = x2 - x1,
          ypos = y2 - y1,
          numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);

        for (var i = 0; i < numDashes; i++) {
          if (i % 2 === 0) {
            this.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
          } else {
            this.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
          }
        }
      }
      return this;
    },
    ellipse: function (x, y, width, height) {
      var k = (width / 0.75) / 2,
        h = height / 2;

      this.moveTo(x, y - h);
      this.bezierCurveTo(x + k, y - h, x + k, y + h, x, y + h);
      this.bezierCurveTo(x - k, y + h, x - k, y - h, x, y - h);
      this.closePath();
      return this;
    }
  });

  /**
   * Rectangle 矩形类
   * **/
  var Rectangle = Shape.extend({
    initialize: function (x, y, width, height) {
      Rectangle.superclass.initialize.call(this);
      this.drawRect(x, y, width, height);
    }
  });

  /**
   * Masker
   * */

  var Masker = Shape.extend({
    initialize: function () {
      Masker.superclass.initialize.apply(this, arguments);
      this.isMasker = true;
    },
    draw: function (ctx) {
      Masker.superclass.draw.call(this, ctx);
      ctx.clip();
    }
  });

  /**
   * Sprite 雪碧图类
   * **/
  var Sprite = DisplayObjectContainer.extend({
    initialize: function (x, y, w, h) {
      Sprite.superclass.initialize.call(this);

      this.x = x || 0;
      this.y = y || 0;
      this.$width = w || 0;
      this.$height = h || 0;
      this.$hasW = false;
      this.$hasH = false;

      this.observe('width', {
        set: function (newVal) {
          this.$width = newVal;
          this.$hasW = true;
        },
        get: function () {
          return this.$width;
        },
        enumerable: true
      });

      this.observe('height', {
        set: function (newVal) {
          this.$height = newVal;
          this.$hasH = true;
        },
        get: function () {
          return this.$height;
        },
        enumerable: true
      });

    },
    addChild: function (childObj) {
      this._addMask();
      Sprite.superclass.addChild.apply(this, arguments);
      this.resize();

      return this;
    },
    removeChild: function (){
      Sprite.superclass.removeChild.apply(this, arguments);
      this.resize();

      return this;
    },
    _addMask: function () {
      if (!this.mask || this._isMaskAdded) return;
      if (this.mask instanceof EC.Masker) {
        Sprite.superclass.addChild.call(this, this.mask, 0);
        this._isMaskAdded = true;
      } else {
        throw new TypeError("mask must be a instance of EC.Masker");
      }
    },
    _getSize: function (obj){
      var x = obj.x + obj.moveX;
      var y = obj.y + obj.moveY;
      var lineWidth = obj.lineWidth || 0;
      var width = x + obj.width + lineWidth;
      var height = y + obj.height + lineWidth;

      return {
        width: width,
        height: height
      }
    },
    resize: function () {
      var widths = [];
      var heights = [];
      var size;

      this.each(function(obj){
        size = this._getSize(obj);
        widths.push(size.width);
        heights.push(size.height);
      }, this);

      if (!this.$hasW) {
        this.$width = getMax(widths);
      }
      if (!this.$hasH) {
        this.$height = getMax(heights);
      }
    }
  });

  /**
   * TextInput
   * */

  var TextInput = Sprite.extend({
    initialize: function () {
      TextInput.superclass.initialize.apply(this, arguments);
      this.width = 400;
      this.height = 64;
      this.backgroundAlpha = 1;
      this.backgroundColor = "";
      this.backgroundImage = "";
      this.backgroundRepeat = "repeat";
      this.borderAlpha = 1;
      this.borderColor = "#000";
      this.borderRadius = 0;
      this.borderWidth = 2;
      this.padding = 3;
      this.fontSize = 28;
      this.color = "#000";
      this.placeholderColor = "#999";
      this.placeholder = "";
      this.fontFamily = "";
      this.lineHeight = 16;
      this.lineSpacing = 2;
      this.inputType = "text";

      this.on("addToStage", function () {
        this._create();
        this._events();
      }, this);

      this.on("remove", function () {
        this.inputText.parentNode.removeChild(this.inputText);
        window.removeEventListener(EC.EVENTS.RESIZE, this.resizeListener, false);
      }, this);
    },
    _create: function () {
      var pad = this.padding;
      this.touchEnabled = true;
      this.cursor = "";
      this.padding = EC.isArray(pad) ? pad : [pad, pad, pad, pad];

      this.input = new Shape();
      this.textField = new TextField();
      this.inputText = document.createElement(this.inputType === "textarea" ? "textarea" : "input");

      this.input.x = this.borderWidth / 2;
      this.input.y = this.borderWidth / 2;
      this.input.lineWidth = this.borderWidth;
      this.input.stroke(this.borderColor, this.borderAlpha);

      var bgPattern = this.backgroundImage;
      if (EC.isObject(bgPattern)) {
        var fillStyle = this.renderContext.createPattern(bgPattern.nodeName === "IMG" ? bgPattern : bgPattern.texture, this.backgroundRepeat);
        this.input.fill(fillStyle);
      } else if (this.backgroundColor) {
        this.input.fill(this.backgroundColor, this.backgroundAlpha);
      }

      if (this.borderRadius > 0) {
        this.input.drawRoundRect(0, 0, this.width, this.height, this.borderRadius);
      } else {
        this.input.drawRect(0, 0, this.width, this.height);
      }

      if (this.inputType !== "textarea") {
        this.inputText.type = this.inputType;
      }

      if (this.placeholder) {
        this.inputText.setAttribute("placeholder", this.placeholder);
        this.textField.text = this.placeholder;
        this.textField.textColor = this.placeholderColor;
      }

      this.textField.width = this.width - this.padding[1] - this.padding[3];
      this.textField.multiple = true;
      this.textField.lineSpacing = this.inputType !== "textarea" ? this.height : this.lineSpacing;
      this.textField.size = this.fontSize;
      this.textField.fontFamily = this.fontFamily || this.textField.fontFamily;
      this.textField.x = this.borderWidth + this.padding[3];
      this.textField.y = this.inputType === "textarea" ? this.padding[0] : (this.height - this.textField.height + this.borderWidth) / 2;

      this.mask = new Masker();
      this.mask.drawRect(0, 0, this.width + this.borderWidth, this.height + this.borderWidth);

      this.addChild(this.input);
      this.addChild(this.textField);

      this._setInputStyle();
      document.body.appendChild(this.inputText);

    },
    _setInputStyle: function () {
      var self = this;
      var ratio = 1 / this.stage.scaleRatio;
      var lineHeight = this.inputType !== "textarea" ? this.height : this.lineHeight;
      var totalOffset = getTotalOffset(this);
      this.inputText.style.cssText = "display:none;position:absolute;border:none;background:none;outline:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;appearance:none;-webkit-text-size-adjust:none;text-size-adjust:none;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:auto;resize:none;" +
        "left:" + (totalOffset.x + self.borderWidth / 2) * ratio + "px;top:" + totalOffset.y * ratio + "px;width:" + this.width * ratio + "px;height:" + this.height * ratio + "px;line-height:" + lineHeight * ratio + "px;font-size:" + this.fontSize * ratio + "px;font-family:" + (this.fontFamily || this.textField.fontFamily) + ";color:" + this.color + ";padding:" +
        this.padding.map(function (pad) {
          return (pad + self.borderWidth / 2) * ratio + "px"
        }).join(" ");
    },
    _events: function () {
      this.on("touch", function () {
        this.textField.visible = false;
        this.inputText.style.display = "block";
        this.inputText.focus();
      }, this);

      this.inputText.addEventListener("focus", function (e) {
        this.dispatch("focus", {target: this, originalEvent: e, value: this.inputText.value});
      }.bind(this), false);

      this.inputText.addEventListener("change", function (e) {
        this.dispatch("change", {target: this, originalEvent: e, value: this.inputText.value});
      }.bind(this), false);

      this.inputText.addEventListener("blur", function (e) {
        var value = this.inputText.value;
        this.textField.text = value || this.placeholder;
        this.textField.textColor = value ? this.color : this.placeholderColor;
        this.textField.visible = true;
        this.inputText.style.display = "none";
        this.dispatch("blur", {target: this, originalEvent: e, value: value});
      }.bind(this), false);

      this.inputText.addEventListener("input", function (e) {
        this.dispatch("input", {target: this, originalEvent: e, value: this.inputText.value});
      }.bind(this), false);

      window.addEventListener(EC.EVENTS.RESIZE, this.resizeListener = function () {
        this._setInputStyle();
      }.bind(this), false);
    }
  });

  /**
   * BitMapText
   * */

  var BitMapText = Sprite.extend({
    initialize: function () {
      BitMapText.superclass.initialize.apply(this, arguments);
      this.$text = "";
      this.font = "";
      this.textAlign = 'left';
      this.letterSpacing = 0;
      this.$type = "BitMapText";
      this.$textArr = [];
      this.$textwrap = new Sprite();

      this.observe('text', {
        set: function (newVal) {
          this.$text = newVal;
          this.$textArr = newVal.split("");
        },
        get: function () {
          return this.$text;
        },
        enumerable: true
      });

      this.on("addToStage", function () {
        this._create();
        this.addChild(this.$textwrap);
      }, this);
    },
    _create: function () {
      this.fontData = (EC.isString(this.font) ? RES.getRes(this.font + "_fnt") : this.font).data;
      this.fontTexture = RES.getRes(this.fontData.file.replace(/\.(\w+)$/, "_$1")).texture;
    }
  });

  /**
   * Button
   * */

  var Button = Sprite.extend({
    initialize: function (statusArgs) {
      Button.superclass.initialize.call(this);

      var _DEFAULTS = {
        x: 0,
        y: 0,
        size: 16,
        textColor: "#000",
        alpha: 1
      };

      var NORMAL = EC.extend({}, _DEFAULTS, this._getConfig(statusArgs.normal) || {});
      var HOVER = EC.extend({}, _DEFAULTS, this._getConfig(statusArgs.hover) || {});
      var ACTIVE = EC.extend({}, _DEFAULTS, this._getConfig(statusArgs.active) || {});
      var DISABLED = EC.extend({}, _DEFAULTS, this._getConfig(statusArgs.disabled) || {});

      this.statusCfg = {
        normal: NORMAL,
        hover: HOVER,
        active: ACTIVE,
        disabled: DISABLED
      };

      for (var i in this.statusCfg) {
        if (EC.isString(this.statusCfg[i].texture)) {
          EC.extend(this.statusCfg[i], RES.getRes(this.statusCfg[i].texture));
        }
      }

      this.bitMap = new BitMap();
      this.shape = new Shape();
      this.textField = new TextField();

      this.on("addToStage", function () {
        this._create();
        this._events();
      }, this);
    },
    _create: function () {
      this.setButton("normal");
      this.addChild(this.bitMap);
      this.addChild(this.shape);
      this.addChild(this.textField);
    },
    _getConfig: function (status) {
      return EC.isString(status) ? RES.getRes(status) : status;
    },
    setButton: function (status) {
      this.touchEnabled = status === 'disabled' ? false : true;

      var _config = EC.isString(status) ? this.statusCfg[status] : status;
      _config = EC.extend({}, this.statusCfg.normal, _config);

      EC.extend(this, {width: _config.width, height: _config.height});

      if (_config.texture) {
        EC.extend(this.bitMap, {
          x: _config.x,
          y: _config.y,
          alpha: _config.alpha,
          texture: _config.texture,
          width: _config.width,
          height: _config.height
        });
        this.bitMap.visible = true;
      } else {
        this.bitMap.visible = false;
      }

      if (_config.fillStyle || _config.strokeStyle) {
        EC.extend(this.shape, _config);
        if (_config.radius && _config.radius > 0) {
          this.shape.drawRoundRect(0, 0, _config.width, _config.height, _config.radius);
        } else {
          this.shape.drawRect(0, 0, _config.width, _config.height);
        }

        if (_config.fillStyle) {
          this.shape.fill(_config.fillStyle);
        }

        if (_config.strokeStyle) {
          this.shape.stroke(_config.strokeStyle);
        }

        this.shape.visible = true;
      } else {
        this.shape.visible = false;
      }

      if (_config.text) {
        this.textField.text = _config.text;
        var injectCfg = {
          textAlign: "center",
          y: _config.y + (this.height - this.textField.height) / 2,
          height: this.textField.height
        };
        EC.extend(this.textField, EC.extend({}, _config, injectCfg));
        this.textField.visible = true;
      } else {
        this.textField.visible = false;
      }

      return _config;
    },
    _events: function () {
      this.on("touchstart", function () {
        this.setButton("active");
      }, this);

      this.on("touchend", function () {
        this.setButton("normal");
      }, this);

      if (!EC.isTouch) {
        this.on("touchenter", function () {
          this.setButton("hover");
        }, this);

        this.on("touchout", function () {
          this.setButton("normal");
        }, this);
      }
    }
  });

  /**
   * Point
   * **/

  var Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  EC.extend(Point.prototype, {
    toString: function() {
      return "[object EC.Point(" + this.x + "," + this.y + ")]";
    },
    set: function (x, y) {
      this.x = x;
      this.y = y;

      return this;
    },
    clone: function() {
      return new Point(this.x, this.y);
    },
    add: function(e) {
      return new Point(this.x + e.x, this.y + e.y);
    },
    distance: function(){
      return Point.calcDistance(this.x, this.y, 0, 0);
    },
    copyFrom: function(t) {
      this.set(t.x, t.y);

      return this;
    },
    equals: function(t) {
      return this.x === t.x && this.y === t.y;
    },
    offset: function(t, e) {
      this.x += t;
      this.y += e;

      return this;
    },
    subtract: function(e) {
      return new Point(this.x - e.x, this.y - e.y);
    },
    getAngle: function(){
      return Point.getAngle(0, 0, this.x, this.y);
    }
  });

  EC.extend(Point, {
    calcDistance: function(x1, y1, x2, y2) {
      var n = Math.abs(x2 - x1),
        s = Math.abs(y2 - y1);
      return Math.sqrt(n * n + s * s);
    },
    distance: function(e, o) {
      return this.calcDistance(e.x, e.y, o.x, o.y);
    },
    fromValues: function(x, y) {
      var out = new Array(2);
      out[0] = x;
      out[1] = y;
      return out;
    },
    getAngle: function(px, py, mx, my){
      var x = Math.abs(px-mx);
      var y = Math.abs(py-my);
      var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
      var cos = y/z;
      var radina = Math.acos(cos);//用反三角函数求弧度
      var angle = 180/(Math.PI/radina);//将弧度转换成角度

      if(mx > px && my > py){//目标点在第四象限
        angle = 180 - angle;
      }

      if(mx === px && my > py){//目标点在y轴负方向上
        angle = 180;
      }

      if(mx > px && my === py){//目标点在x轴正方向上
        angle = 90;
      }

      if(mx < px && my > py){//目标点在第三象限
        angle = 180 + angle;
      }

      if(mx < px && my === py){//目标点在x轴负方向
        angle = 270;
      }

      if(mx < px && my < py){//目标点在第二象限
        angle = 360 - angle;
      }

      return angle;
    }
  });

  /**
   * Stage 渲染器
   * **/
  var Stage = DisplayObjectContainer.extend({
    initialize: function (canvas, options) {
      Stage.superclass.initialize.call(this);

      this.canvas = canvas;
      this.renderContext = this.canvas.getContext('2d');

      var self = this;
      var opts = this.options = EC.extend({}, {
        showFps: false,
        scaleMode: 'showAll',
        forceUpdate: false,
        frameRate: 60,
        width: window.innerWidth,
        height: window.innerHeight,
        blendMode: null,
        autoRender: true
      }, options || {});

      this.width = parseFloat(this.canvas.getAttribute("width")) || opts.width;
      this.height = parseFloat(this.canvas.getAttribute("height")) || opts.height;
      this.scaleRatio = 1;
      this.cursor = "";
      this._isRendering = false;
      this._ticker = new EC.Ticker({
        useInterval: opts.forceUpdate,
        frameRate: opts.frameRate
      });

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.observe('blendMode', {
        set: function (value) {
          self.renderContext.globalCompositeOperation = value;
        },
        enumerable: true
      });

      if (opts.blendMode) {
        this.blendMode = opts.blendMode;
      }

      if (opts.scaleMode !== "noScale") {
        this.setAdapter();
      }

      if (opts.showFps) {
        this.createFps();
        this.showFps();
      }

      this._initEvents();

      if (opts.autoRender) {
        this.startRender();
      }
    },
    addChild: function (childObj) {
      Stage.superclass.addChild.apply(this, arguments);
      this._triggerAddToStage(childObj, this);

      return this;
    },
    render: function (time) {
      var self = this;
      var ctx = this.renderContext;
      var _render = function (obj) {
        if (obj.visible) {
          obj.dispatch("enterframe", time);
          if (obj.$type === 'Sprite') {
            ctx.save();
            drawContext(ctx, obj);
            obj.children.forEach(function (item) {
              _render(item);
            });
            ctx.restore();
          } else {
            self._renderItem(ctx, obj);
          }
        }
      };

      _render(this);

      return this;
    },
    _renderItem: function (ctx, obj) {
      obj.isMasker || ctx.save();
      drawContext(ctx, obj);
      switch (obj.$type) {
        case 'BitMap':
          drawImg(ctx, obj);
          break;
        case 'BitMapText':
          drawBitMapText(ctx, obj);
          break;
        case 'TextField':
          drawText(ctx, obj);
          break;
        case 'Shape':
          drawShape(ctx, obj);
          break;
      }
      obj.isMasker || ctx.restore();
    },
    clear: function () {
      this.renderContext.clearRect(0, 0, this.width, this.height);
      return this;
    },
    startRender: function () {
      if (this._isRendering) return;
      this._isRendering = true;
      this._ticker.start();

      return this;
    },
    stopRender: function () {
      this._ticker.stop();
      this._isRendering = false;
      return this;
    },
    setAdapter: function () {
      var parent = this.canvas.parentNode;
      var parentW = parent.nodeName === 'BODY' ? window.innerWidth : parent.offsetWidth - parseFloat(EC.getStyle(parent, 'padding-left')) - parseFloat(EC.getStyle(parent, 'padding-right'));
      var parentH = parent.nodeName === 'BODY' ? window.innerHeight : parent.offsetHeight - parseFloat(EC.getStyle(parent, 'padding-top')) - parseFloat(EC.getStyle(parent, 'padding-bottom'));
      var width = parentW;
      var height = this.height / this.width * width;

      switch (this.options.scaleMode) {
        case 'showAll':
          if (height > parentH) {
            height = parentH;
            width = this.width / this.height * height;
          }
          break;
        case 'fixedWidth':
          break;
      }

      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.scaleRatio = this.width / width;

      return this;
    },
    _initEvents: function () {

      var opts = this.options;
      var isShowFPS = opts.showFps;

      this._ticker.on("ticker", function (time) {
        isShowFPS && this.FPS.begin();
        this.clear();
        this.render(time);
        EC.groupManager.update(time);
        isShowFPS && this.FPS.end();
      }, this);

      if (opts.scaleMode !== 'noScale') {
        window.addEventListener(EC.EVENTS.RESIZE, function () {
          this.setAdapter();
        }.bind(this), false);
      }

      new EC.TouchEvent().attach(this);

    },
    createFps: function () {
      this.FPS = new Stats();
    },
    showFps: function (position) {
      if(!this.options.showFps) return;
      if (EC.isObject(position)) {
        this.FPS.dom.style.left = EC.isDefined(position.left) ? (EC.isNumber(position.left) ? position.left + "px" : position.left) : "";
        this.FPS.dom.style.right = EC.isDefined(position.right) ? (EC.isNumber(position.right) ? position.right + "px" : position.right) : "";
        this.FPS.dom.style.top = EC.isDefined(position.top) ? (EC.isNumber(position.top) ? position.top + "px" : position.top) : "";
        this.FPS.dom.style.bottom = EC.isDefined(position.bottom) ? (EC.isNumber(position.bottom) ? position.bottom + "px" : position.bottom) : "";
      }

      if (!this._fpsDom) {
        document.body.appendChild(this._fpsDom = this.FPS.dom);
      }
    }
  });

  [
    "createLinearGradient",
    "createPattern",
    "createRadialGradient",
    "addColorStop",
    "createImageData",
    "putImageData",
    "getImageData",
    "isPointInPath"
  ].forEach(function (method) {
    Stage.prototype[method] = function () {
      return this.renderContext[method].apply(this, arguments);
    };
  });

  EC.provide({
    TextField: TextField,
    BitMap: BitMap,
    BitMapText: BitMapText,
    Shape: Shape,
    Rectangle: Rectangle,
    TextInput: TextInput,
    Masker: Masker,
    DisplayObject: DisplayObject,
    DisplayObjectContainer : DisplayObjectContainer,
    Sprite: Sprite,
    Button: Button,
    Point: Point,
    Stage: Stage,
    isPointInPath: isPointInPath
  });

})(window.EC);
/**
 * Created by semdy on 2016/9/6.
 */

(function (EC, undefined) {
  "use strict";

  var MovieClip = EC.Sprite.extend({
    initialize: function (resUrl, res, resKey) {
      MovieClip.superclass.initialize.call(this);

      this._startFrame = 0;
      this._playTimes = -1;
      this._resKey = resKey;
      this.currentFrame = 0;

      this.setRES(resUrl, res);
      this._clip = new EC.BitMap(this.RESUrl);

      if (Array.isArray(this.RESUrl)) {
        this.width = this.RESUrl[0].width;
        this.height = this.RESUrl[0].height;
        this.totalFrames = this.RESUrl.length;
        this.setFrame = this.setFrameByPath;
      } else {
        var _key = this.RES.mc[resKey].frames[0].res;
        var _resData = this.RES.res[_key];
        this.width = _resData.w;
        this.height = _resData.h;
        this.setFrame = this.setFrameBySprite;
      }

      this._timer = new EC.Timer(this.frameRate, this._repeatCount);
      this._initEvents();
    },

    setRES: function (resUrl, res, frameRate) {
      this.RESUrl = _getResUrl(resUrl);
      this.RES = _getResData(res, this._resKey);
      this.currentFrame = 0;
      this.frame = this.getMovieClipData(this._resKey);
      this.frameRate = Math.round(1000 / (this.frame.frameRate || 24));
      this.totalFrames = this.frame.frames.length;

      if (!Array.isArray(this.RESUrl)) {
        if (EC.isObject(this.RESUrl) && ("nodeType" in this.RESUrl)) {
          this.RESUrl = {
            texture: this.RESUrl,
            width: this.RESUrl.width,
            height: this.RESUrl.height
          }
        }
        this.texture = this.RESUrl.texture;
      } else {
        this.texture = this.RESUrl[this.currentFrame].texture;
      }

      if (frameRate) {
        this.setFrameRate(frameRate);
      }
    },

    getMovieClipData: function (key) {
      return this.RES.mc[key] || [];
    },

    gotoAndPlay: function (startFrame, playTimes, frameRate) {
      startFrame = Math.max(0, startFrame - 1);

      this._startFrame = startFrame;
      this._playTimes = playTimes;
      this.currentFrame = startFrame;

      if (this._playTimes > 0) {
        this._repeatCount = this._playTimes * this.totalFrames;
        this._timer.setRepeatCount(this._repeatCount);
      }

      if (frameRate) {
        this.setFrameRate(Math.round(1000 / frameRate));
      }

      this.setFrame(this.currentFrame);
      this.play();

      return this;
    },

    gotoAndStop: function (frameIndex) {
      this.stop();
      this.setFrame(frameIndex);
      return this;
    },

    prevFrame: function () {
      return this.setFrame(--this.currentFrame);
    },

    nextFrame: function () {
      return this.setFrame(++this.currentFrame);
    },

    play: function () {
      if (this.isPlaying()) {
        return this;
      }

      this._timer.start();

      return this;
    },

    isPlaying: function(){
      return this._timer.isPlaying();
    },

    stop: function () {
      this._timer.stop();
      return this;
    },

    pause: function (dur) {
      this._timer.pause(dur);
      return this;
    },

    wait: function (waitTime) {
      this._timer.wait(waitTime);
      return this;
    },

    setFrameRate: function (frameRate) {
      this.frameRate = frameRate;
    },

    setFrameBySprite: function (index) {
      var resItem = this.frame.frames[index] || {};
      var res = this.RES.res[resItem.res];

      if (res === undefined) return;

      this._timer.delay = (resItem.duration || 0) * this.frameRate;

      this._clip.x = resItem.x || 0;
      this._clip.y = resItem.y || 0;
      this._clip.sx = res.x || 0;
      this._clip.sy = res.y || 0;
      this._clip.swidth = res.w || this.width || 0;
      this._clip.sheight = res.h || this.height || 0;
      this._clip.width = this._clip.swidth;
      this._clip.height = this._clip.sheight;

      /*this.width = this.width || this._clip.width;
      this.height = this.height || this._clip.height;*/

      this.width = this._clip.width;
      this.height = this._clip.height;

      return this;
    },

    setFrameByPath: function (index) {
      var resItem = this.frame.frames[index] || {};
      var resData = this.RESUrl[index];

      this._timer.delay = (resItem.duration || 0) * this.frameRate;

      this._clip.texture = resData.texture;
      this._clip.x = resItem.x || 0;
      this._clip.y = resItem.y || 0;
      this._clip.width = resData.width || this._clip.width || 0;
      this._clip.height = resData.height || this._clip.height || 0;
      this.width = this._clip.width;
      this.height = this._clip.height;

      return this;
    },

    _initEvents: function () {

      this.on("addToStage", function () {
        this.addChild(this._clip);
      }, this);

      this.on("remove", function () {
        this.stop();
      }, this);

      this._timer.on('timer', function () {
        if (++this.currentFrame > this.totalFrames - 1) {
          this.currentFrame = this._startFrame;
          this.dispatch('loopcomplete');
        }

        this.setFrame(this.currentFrame);
      }, this);

      this._timer.on('complete', function () {
        this.dispatch('complete');
      }, this);

      this._timer.on('pause', function () {
        this.dispatch('pause');
      }, this);
    }

  });

  var _getResUrl = function (resUrl) {
    if (/_(png|jpg|jpeg|gif|bmp|webp)$/.test(resUrl)) {
      return RES.getRes(resUrl);
    }
    return resUrl;
  };

  var _getResData = function (res, resKey) {
    if (typeof res === 'string') {
      return RES.getRes(res);
    }
    else if (Array.isArray(res)) {
      var resFrames = [];
      var resObj = {};
      var resCfg = {mc: {}, res: {}};

      res.forEach(function (resItem) {
        var pos = resItem.split(' ');
        var uid = _genUID();
        resFrames.push({
          res: uid,
          x: 0,
          y: 0,
          duration: 1
        });

        resObj[uid] = {
          x: -1 * pos[0],
          y: -1 * pos[1]
        }
      });

      resCfg.mc[resKey] = {
        frames: resFrames,
        frameRate: 24
      };

      resCfg.res = resObj;

      return resCfg;
    } else if (typeof res === 'object' && !res.mc) {
      var resFrames = [];
      var resObj = {};
      var resCfg = {mc: {}, res: {}};

      for (var i in res) {
        var pos = res[i];
        var uid = _genUID();
        resFrames.push({
          res: uid,
          key: i,
          x: pos.offX,
          y: pos.offY,
          duration: pos.duration === undefined ? 1 : pos.duration
        });

        resObj[uid] = {
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h
        }
      }

      resFrames = resFrames.sort(function (a, b) {
        return parseInt(a.key.replace(/^[^\d]+/, "")) - parseInt(b.key.replace(/^[^\d]+/, ""));
      });

      resCfg.mc[resKey] = {
        frames: resFrames,
        frameRate: 24
      };

      resCfg.res = resObj;

      return resCfg;
    }

    return res;
  };

  var _genUID = function (len) {
    var g = '',
      i = 0;
    len = len || 8;

    while (i++ < len) {
      g += Math.floor(Math.random() * 16.0).toString(16);
    }

    return g.toUpperCase();
  };

  EC.provide({
    MovieClip: MovieClip
  });

})(window.EC);
;(function (EC, undefined) {
  'use strict';

  var ScrollView = EC.Sprite.extend({
    initialize: function () {
      ScrollView.superclass.initialize.apply(this, arguments);

      var self = this;
      this.cursor = '';
      this.vertical = true;
      this.adjustValue = 0;
      this.initialValue = 0;
      this.disabled = false;
      this.$layout = null;
      this.touchScroll = null;

      this.on("addToStage", function() {
        this.mask = new EC.Masker();
        this.mask.drawRect(0, 0, this.width, this.height);
        if (this.layout) {
          this.touchScroll = this._createScroll();
          this.addChild(this.layout);
        }
      }, this);

      Object.defineProperty(this, 'layout', {
        set: function(target) {
          self.$layout = target;
          self.addChild(target);
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
      var min = (this.vertical ? (this.height - this.layout.height) : (this.width - this.layout.width)) - this.adjustValue;
      return new EC.TouchScroll({
        touch: this,
        vertical: this.vertical,
        target: this.layout,
        property: this.vertical ? 'y' : 'x',
        max: 0,
        min: min,
        step: this.step,
        fixed: this.disabled,
        initialValue: this.initialValue,
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

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	function getNow(){
		return window.performance && performance.now ? performance.now() : Date.now();
  }

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = getNow(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = getNow();

		},

		end: function () {

			frames ++;

			var time = getNow();

			msPanel.update( time - beginTime, 200 );

			if ( time > prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

if ( typeof module === 'object' ) {

	module.exports = Stats;

}
