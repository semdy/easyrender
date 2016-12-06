/**
 * Created by mcake on 2016/9/6.
 */
(function(RES){
    "use strict";

    var regHttps = /^https?:\/\//;
    var assets = {};

    //加载图片
    var loadImg = function(src, suc, err){
        var img = new Image();
        img.addEventListener('load', function sucListener(){
            suc && suc(img);
            this.removeEventListener('load', sucListener, false);
        }, false);

        img.addEventListener('error', function errListener(){
            err && err();
            console.error('fail load:' + src);
            this.removeEventListener('error', errListener, false);
        }, false);

        img.src = src;

    };

    var IMGloader = EC.Event.extend({
        initialize: function(src){
            var self = this;
            IMGloader.superclass.initialize.call(this);

            loadImg(src, function(img){
                self.dispatch('success', img);
            }, function(img){
                self.dispatch('error', img);
            });
        }
    });

    var loadTexture = function(resItem, callback){
        var url = regHttps.test(resItem.url) ? resItem.url : (RES.baseUrl + resItem.url);
        loadImg(url, function(img){
            assets[resItem.name] = {
                width: img.width,
                height: img.height,
                texture: img
            };
            EC.extend(assets[resItem.name], resItem);
            EC.isFunction(callback) && callback(resItem);
        });
    };

    var loadScript = function(path, cb, errCb){
        var head = document.head || document.getElementsByTagName("head")[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = path;

        script.onload = script.onreadystatechange = function(){
            script.onload = script.onreadystatechange = new Function;
            if( !this.readyState || /loaded|complete/.test(this.readyState) ){
                script.parentNode.removeChild(script);
                if (typeof cb === 'function') {
                    cb(script);
                }
            }
        };

        script.onerror = function () {
            script.onerror = new Function;
            if( typeof errCb === 'function' ){
                errCb(null, 404, "not found");
            }
        };

        head.insertBefore(script, head.firstChild);
    };

    var scriptLoader = EC.Event.extend({
        initialize: function(url){
            var self = this;
            scriptLoader.superclass.initialize.call(this);

            loadScript(url, function(data){
                self.dispatch('success', data);
            }, function(xhr){
                self.dispatch('error', xhr);
            });
        }
    });

    var loadJsonp = function(url, loadSuc, loadErr){
        var callback = /callback=([^&]+)/.exec(url);
        if( !callback ) {
            return loadScript(url, null, loadErr);
        }

        callback = callback[1];

        if( callback == "?" ){
            callback = "jsonp" + (Date.now() + Math.random()*1e18);
            url = url.replace("callback=?", "callback=" + callback);
        }

        window[callback] = function(res){
            loadSuc(res);
            delete window[callback];
        };

        loadScript(url, null, loadErr);

    };

    var jsonpLoader = EC.Event.extend({
        initialize: function(url){
            var self = this;
            jsonpLoader.superclass.initialize.call(this);

            loadJsonp(url, function(data){
                self.dispatch('success', data);
            }, function(xhr){
                self.dispatch('error', xhr);
            });
        }
    });

    RES.ajaxSettings = {
        url: "",
        type: 'GET',
        async: true,
        data: {},
        headers: {},
        cache: true,
        cors: false,
        beforeSend: EC.noop,
        success: EC.noop,
        error: EC.noop,
        complete: EC.noop,
        timeout: 0,
        context: null,
        dataType: "text",
        callbackName: "?",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        createXHR: function () {
            if ( !!window.XMLHttpRequest ) {
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
            script: "text/javascript, application/javascript",
            json: "application/json, text/javascript",
            text: "text/plain",
            _default: "*/*"
        }
    };

    function getUrlModule(params, cache) {
        var data = "";
        if( !cache ){
            var rnd = Date.now() + Math.random() * 1e18;
        }
        if( typeof params == 'object' ){
            data = [];
            if( !cache ) {
                params._ = rnd;
            }
            for(var i in params){
                data.push( i + "=" + params[ i ] );
            }
            data = data.join("&");
        }
        else if( typeof params == 'string' ) {
            data = params;
            if( !cache ){
                data += "&_=" + rnd;
            }
        }

        return data;
    }

    function createAJAX( args ){
        args = EC.extend({}, RES.ajaxSettings, args||{});

        var xhr = args.createXHR();

        if ( !xhr ) return;

        if( args.beforeSend.call(args.context, xhr, xhr.statusText) === false ){
            return xhr.abort();
        }

        var dataType = args.dataType.toLowerCase(),
            type = args.type.toUpperCase(),
            url = args.url,
            data = getUrlModule(args.data, args.cache),
            timeout;

        function handleSuccess( res ) {
            if( timeout ){
                clearTimeout(timeout);
            }
            try {
                args.success.call(args.context, dataType == 'jsonp' ? res : (dataType == 'xml' ? xhr.responseXML :
                    (dataType == 'json' ? JSON.parse(xhr.responseText) : xhr.responseText)), xhr);
            } catch (e) {}

            args.complete.call(args.context, xhr, xhr.status, xhr.statusText);
        }

        function handleError() {
            if( timeout ){
                clearTimeout(timeout);
            }
            args.error.call(args.context, xhr, xhr.status, xhr.statusText);
            args.complete.call(args.context, xhr, xhr.status, xhr.statusText);
        }

        if( args.async && args.timeout > 0 ) {
            timeout = setTimeout(function () {
                if (xhr.readyState < 4) {
                    xhr.abort();
                    handleError();
                }
            }, args.timeout);
        }

        if( type == 'GET' && data ){
            url += url.indexOf("?") > -1 ? ("&" + data) : ("?" + data);
        }

        if( dataType == "jsonp" ) {
            url += ((url.indexOf("?") > -1 ? "&" : "?") + "callback=" + args.callbackName);
            loadJsonp(url, handleSuccess, handleError);
            return xhr;
        }

        if( xhr.onload ) {
            xhr.onload = function () {
                xhr.onload = new Function;
                handleSuccess();
            };
            xhr.onerror = function () {
                xhr.onerror = new Function;
                handleError();
            };
        } else {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        xhr.onreadystatechange = new Function;
                        handleSuccess();
                    } else {
                        handleError();
                    }
                }
            };
        }

        xhr.open(type, url, args.async);

        if ( args.cors ) {
            try{
                xhr.withCredentials = true;
            } catch (e) {}
        }

        if ( !args.cors ) {
            args.headers["X-Requested-With"] = "XMLHttpRequest";
        }

        args.headers['Content-Type'] = args['Content-Type'];

        for( var header in args.headers){
            xhr.setRequestHeader(header, args.headers[header]);
        }

        xhr.setRequestHeader("Accept", args.accepts[ dataType ] ?
        args.accepts[ dataType ] + ", */*; q=0.01" :
            args.accepts._default );

        xhr.send(data);

        return xhr;
    }

    var Request = EC.Event.extend({
        initialize: function( params ){
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
        if (typeof cfgItem != 'object') {
            return;
        }

        if (cfgItem.type == 'image') {
            loadTexture(cfgItem, function(){
                callback && callback(cfgItem);
            });
        }
        else if ( /^(?:json|sheet|font)$/.test( cfgItem.type ) ){
            loadJSON(cfgItem.url, function (data) {
                var obj = EC.extend({}, cfgItem, {data: data});
                assets[cfgItem.name] = obj;

                if( cfgItem.type == 'sheet' || cfgItem.type == 'font' ){
                    var url = cfgItem.url.substr(0, cfgItem.url.lastIndexOf("/") + 1) + data.file;
                    var name = data.file.replace(/\.(\w+)$/, "_$1");
                    var resObj = EC.extend({}, cfgItem, {url: url, name: name, type: 'image'});
                    loadTexture(resObj, function(){
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

    var getAsset = function(){
        return assets;
    };

    var getRes = function(resId, sheetKey){
        var pathReg = /\[(\d+\-\d+)\]/;
        var pathRes = pathReg.exec(resId);

        if( pathRes ){
            var textureGroup = [];
            var path = RegExp.$1.split('-');
            var pathPre = resId.replace(pathReg, "").split("_");
            for(var i = Number(path[0]); i<Number(path[1]) + 1; i++){
                var pathId = pathPre[0] + i + "_" + pathPre[1];
                textureGroup.push(assets[pathId]);
            }

            return textureGroup;
        }

        var asset = assets[resId];

        if( asset === undefined ){
            return console.error(resId + " does not exist!");
        }

        if( asset.type == 'json' || asset.type == 'sheet' ){
            if( sheetKey ) return asset.data.frames[sheetKey];
            return asset.data;
        }
        else {
            return asset;
        }

        return null;
    };

    var getElement = function (selector, container) {
        if( typeof selector != 'string' ) return selector;

        if( !/^(#|\.)/.test( selector ) ) return null;

        var type = selector.charAt(0);
        container = container || document;

        if (type == "#") {
            return document.getElementById(selector.substr(1, selector.length));
        }

        if( !!document.querySelectorAll ) {
            return container.querySelectorAll(selector);
        } else {
            try{
                return container.getElementsByClassName(selector);
            } catch(e) {
                var ary = [];
                var els = container.getElementsByTagName('*');
                els.forEach(function(el){
                    if( (" " + el.className + " ").indexOf(" " + selector + " ") > -1 ){
                        ary.push(el);
                    }
                });

                return ary;
            }
        }
    };

    var getKeys = function( groupKey, data ){
        var group = data.groups.find(function( group ){
            return group.name == groupKey;
        });

        if( group === undefined ){
            return console.error('group "' + groupKey + '" dose not exsit!');
        }

        var keys = group.keys.split(",").map(function( key ){
            return key.trim();
        });

        return keys;
    };

    var getLoadGroup = function(resources, keys){
        var groupRes = [];
        resources.forEach(function(res){
            if( keys.indexOf(res.name) > -1 ){
                groupRes.push(res);
            }
        });

        return groupRes;
    };

    var loadGroup = EC.Event.extend({
        initialize: function(groupKey, data){

            var keys = getKeys(groupKey, data);

            if( keys === undefined ) return;

            var sources = getLoadGroup(data.resources, keys);

            var self = this,
                loaded = 0,
                total = sources.length;

            loadGroup.superclass.initialize.call(this);

            sources.forEach(function(source){
                loadAsset(source, function(){
                    self.dispatch('progress', ++loaded, total, source);
                    if (loaded > total - 1) {
                        self.dispatch('complete');
                    }
                });
            });

        }
    });

    EC.extend(RES, {
        loadImage: function(src){
            return new IMGloader(src);
        },
        ajax: function (params) {
            return createAJAX(params);
        },
        request: function (params) {
            return new Request(params);
        },
        loadScript: function(url){
            return new scriptLoader(url);
        },
        loadJson: function(url){
            return new Request({url: url, dataType: "json"});
        },
        loadJsonp: function (url) {
            return new jsonpLoader(url);
        },
        loadGroup: function(groupKey, data){
            return new loadGroup(groupKey, data);
        },
        getAsset: getAsset,
        getRes: getRes,
        el: getElement,
        baseUrl: 'images/'
    });

    ['get', 'post', 'getJSON'].forEach(function (type, index) {
        RES.request[type] = function (url, params) {
            type = type.replace(/JSON?$/, "");
            return new Request({url: url, type: type, data: params, dataType: index == 2 ? 'json' : 'text'});
        };
    });

})(window.RES || (window.RES = {}));
