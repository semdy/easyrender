/**
 * Created by shuxy on 2016/4/20
 */

+function(EC){
    "use strict";

    var slice = Array.prototype.slice,
        RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize';

    function drawImg(ctx, obj){

        var anchorX = obj.anchorX + obj.parent.anchorX,
            anchorY = obj.anchorY + obj.parent.anchorY;

        if( 'sx' in obj ){
            var _width = ctx.canvas.width,
                _height = ctx.canvas.height,
                swidth = obj.swidth,
                sheight = obj.sheight;

            if( swidth >= _width ) swidth = _width - 1;
            if( sheight >= _height ) sheight = _height - 1;

            ctx.drawImage(obj.bitMapData, obj.sx, obj.sy, swidth, sheight, -1*anchorX*obj.width, -1*anchorY*obj.height, obj.width, obj.height);
        } else {
            ctx.drawImage(obj.bitMapData, -1*anchorX*obj.width, -1*anchorY*obj.height, obj.width, obj.height);
        }
    }

    function drawText(ctx, obj){
        ctx.font = obj.size + "px " + obj.textFamily;
        ctx.textAlign = obj.textAlign;
        ctx.textBaseline = obj.textBaseline || "top";

        var anchorX = obj.anchorX + obj.parent.anchorX,
            anchorY = obj.anchorY + obj.parent.anchorY;

        if( obj.stroke ) {
            ctx.strokeStyle = obj.textColor;
            ctx.strokeText(obj.text, -1*anchorX*obj.width, -1*anchorY*obj.height);
        } else {
            ctx.fillStyle = obj.textColor;
            ctx.fillText(obj.text, -1*anchorX*obj.width, -1*anchorY*obj.height);
        }
    }

    function mixTextSize(ctx, obj){
        ctx.font = obj.size + "px " + obj.textFamily;
        obj.width = ctx.measureText(obj.text).width;
        obj.height = obj.size + 2;
    }

    function drawShape(ctx, obj){
        ctx.beginPath();
        drawShapeContext(ctx, obj);
        obj.draw(ctx, obj);
    }

    function drawContext(ctx, obj){
        obj = obj || {};
        ctx.globalAlpha = obj.parent.alpha < 1 ? obj.parent.alpha : obj.alpha;
        ctx.transform(
            obj.scaleX * obj.parent.scaleX, //水平缩放绘图
            obj.skewX * obj.parent.skewX, //水平倾斜绘图
            obj.skewY * obj.parent.skewY, //垂直倾斜绘图
            obj.scaleY * obj.parent.scaleY, //垂直缩放绘图
            obj.parent.x + obj.x + (obj.anchorX + obj.parent.anchorX)*obj.width, //水平移动绘图
            obj.parent.y + obj.y + (obj.anchorY + obj.parent.anchorY)*obj.height //垂直移动绘图
        );
        ctx.rotate((obj.rotation + obj.parent.rotation)*Math.PI/180);
    }

    function drawShapeContext(ctx, obj){
        ctx.fillStyle = obj.fillStyle;
        ctx.strokeStyle = obj.strokeStyle;
        ctx.shadowColor = obj.shadowColor;
        ctx.shadowBlur = obj.shadowBlur || 0;
        ctx.shadowOffsetX = obj.shadowOffsetX || 0;
        ctx.shadowOffsetY = obj.shadowOffsetY || 0;
        ctx.lineCap = obj.lineCap;
        ctx.lineJoin = obj.lineJoin;
        ctx.lineWidth = obj.lineWidth || 0;
        ctx.miterLimit = obj.miterLimit;
    }

    var baseMethods = [
        "rect",
        "arc",
        "arcTo",
        "moveTo",
        "lineTo",
        "clip",
        "quadraticCurveTo",
        "bezierCurveTo"
    ];

    /**
     * ObjectContainer 操作基类
     * **/
    var ObjectContainer = EC.Event.extend({

        initialize: function(){
            ObjectContainer.superclass.initialize.call(this);

            this.x = 0;
            this.y = 0;

            this.visible = true;
            this.alpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.skewX = 0;
            this.skewY = 0;
            this.anchorX = 0;
            this.anchorY = 0;

            this.$type = "ObjectContainer";

            this._children = [];
            this.numChildren = 0;
        },

        addChild: function( object, index ){
            if( !EC.isObject(object) ){
                throw new Error(String(object) + "is not a instance of EC");
            }

            object.parent = this;

            object.visible = EC.isDefined(object.visible) ? object.visible : this.visible;
            object.alpha = EC.isDefined(object.alpha) ? object.alpha : this.alpha;
            object.rotation = EC.isDefined(object.rotation) ? object.rotation : this.rotation;
            object.scaleX = EC.isDefined(object.scaleX) ? object.scaleX : this.scaleX;
            object.scaleY = EC.isDefined(object.scaleY) ? object.scaleY : this.scaleY;

            if( !EC.isNumber(index) ) {
                this._children.push(object);
            } else {
                this._children.splice(index, 0, object);
            }

            if( object.$type == 'TextField' ){
                mixTextSize(object.renderContext, object);
            }

            this.numChildren = this._children.length;

            return this;
        },

        addChildAt: function( object, index ){
            return this.addChild(object, index);
        },

        removeChild: function(object){

            this._stopTweens(object);

            for(var i = 0; i < this._children.length; i++){
                if( this._children[i] === object ){
                    this._children.splice(i, 1);
                    break;
                }
            }

            this.numChildren = this._children.length;

            return this;
        },

        removeAllChildren: function(){
            this._stopAllTweens();
            this._children = [];
            this.numChildren = 0;
            return this;
        },

        getChilds: function(){
            return this._children;
        },

        getChildIndex: function(childObj){
            for(var i=0; i<this._children.length; i++){
                if( this._children[i] == childObj ) return i;
            }

            return -1;
        },

        setChildIndex: function( childObj, index ){
            this.removeChild(childObj);
            this._children.splice(index, 0, childObj);
            return this;
        },

        transform: function(scaleX, skewX, skewY, scaleY, x, y){
            this.x = x;
            this.y = y;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            this.skewX = skewX;
            this.skewY = skewY;

            return this;
        },

        setTransform: function(rotation, skewX, skewY, scaleY, x, y){
            this.x = x;
            this.y = y;
            this.rotation = rotation;
            this.scaleY = scaleY;
            this.skewX = skewX;
            this.skewY = skewY;

            return this;
        },

        _stopTweens: function( target ){
            EC.Tween.removeTweens(target);
            return this;
        },

        _stopAllTweens: function(){
            EC.Tween.removeAllTweens(this);
            return this;
        }
    });

    /**
     * TextField 文字类
     * **/
    var TextField = ObjectContainer.extend({
        initialize: function(text, size, x, y, color, align, family, width, height){
            TextField.superclass.initialize.call(this);

            this.text = text || "";
            this.size = size || 16;
            this.textAlign = align || "start";
            this.textBaseline = "";
            this.textFamily = family || "Microsoft yahei,Arial,sans-serif";
            this.textColor = color || "#000";
            this.stroke = false;

            this.x = x||0;
            this.y = y||0;
            this.width = width||0;
            this.height = height||0;

            this.$type = "TextField";
        }
    });

    /**
     * BitMap 位图类
     * **/
    var BitMap = ObjectContainer.extend({
        initialize: function(key, x, y, width, height, sx, sy, swidth, sheight){
            BitMap.superclass.initialize.call(this);

            this.x = x||0;
            this.y = y||0;

            if( EC.isDefined(sx) ) {
                this.sx = sx;
            }
            if( EC.isDefined(sy) ) {
                this.sy = sy;
            }
            if( EC.isDefined(swidth) ) {
                this.swidth = swidth || 0.1;
            }
            if( EC.isDefined(sheight) ) {
                this.sheight = sheight || 0.1;
            }

            this.$type = "BitMap";

            if( EC.isDefined(key) ) {
                EC.extend(this, EC.isObject(key) ? (key.nodeName === "IMG" ? {bitMapData: key, width: key.width, height: key.height} : key) : RES.getRes(key));
            }

            if( EC.isDefined(width) ){
                this.width = width;
            }

            if( EC.isDefined(height) ){
                this.height = height;
            }

        },
        setBitMap: function( bitMapObject ){
            if( !EC.isObject(bitMapObject) )
                throw new Error(String(bitMapObject) + "is a invalid bitMapObject");
            if( 'nodeType' in bitMapObject ){
                this.bitMapData = bitMapObject;
            } else {
                EC.extend(this, bitMapObject);
            }
        }
    });

    /**
     * Shape 图形界面
     * **/
    var Shape = ObjectContainer.extend({
        initialize: function(x, y, w, h){
            Shape.superclass.initialize.call(this);

            this.x = x||0;
            this.y = y||0;
            this.width = w||0;
            this.height = h||0;

            this._drawFuns = [];
            this._drawTypes = [];
            this._closePathTypes = [];

            this.$type = "Shape";
        },
        _setStyle: function(type, color, alpha, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY){
            this._drawTypes.push(type.replace("Style", ""));

            if(typeof alpha == 'number' && alpha < 1){
                this[type] = EC.util.color.toRgb(color, alpha);
            } else {
                this[type] = color;
            }

            this.shadowColor = shadowColor || 0;
            this.shadowBlur = shadowBlur || 0;
            this.shadowOffsetX = shadowOffsetX || 0;
            this.shadowOffsetY = shadowOffsetY || 0;
        },
        fill: function(){
            var args = slice.call(arguments);
            args.unshift("fillStyle");
            this._setStyle.apply(this, args);
        },
        stroke: function(){
            var args = slice.call(arguments);
            args.unshift("strokeStyle");
            this._setStyle.apply(this, args);
        },
        draw: function(ctx){
            this._drawFuns.forEach(function(fun){
                fun(ctx);
            });

            this._closePathTypes.forEach(function(closeType){
                ctx[closeType]();
            });
            
            this._drawTypes.forEach(function(drawType){
                ctx[drawType]();
            });
        },
        close: function () {
            this._closePathTypes.push("closePath");
        }
    });

    baseMethods.forEach(function(method){
        Shape.prototype[method] = function(){
            var self = this;
            var args = slice.call(arguments);
            if( method == 'rect' || method == 'arc' ){
                self.x = self.x + args.shift();
                self.y = self.y + args.shift();
                if( method == 'arc' ) {
                    self.width = args[0]*2;
                    self.height = args[0]*2;
                } else {
                    self.width = args[0];
                    self.height = args[1];
                }
                args = [-1*self.anchorX*self.width, -1*self.anchorY*self.height].concat(args);
            }

            this._drawFuns.push(function(ctx){
                ctx[method].apply(ctx, args);
            });
        };
    });

    /**
     * Sprite 雪碧图类
     * **/
    var Sprite = ObjectContainer.extend({
        initialize: function(x, y, w, h){
            Sprite.superclass.initialize.call(this);

            this.x = x||0;
            this.y = y||0;
            this.width = w||0;
            this.height = h||0;

            this.$type = "Sprite";

        },
        addChild: function( childObj ){
            childObj.renderContext = this.renderContext;
            childObj.stage = this.stage;
            Sprite.superclass.addChild.apply(this, arguments);

            this._addMask();

            if( this.getChilds().length == 1 ) {
                this.width = childObj.x + childObj.width;
                this.height = childObj.y + childObj.height;
            } else {
                if( childObj.x + childObj.width > this.width ){
                    this.width = childObj.x + childObj.width;
                }
                if( childObj.y + childObj.height > this.height ){
                    this.height = childObj.y + childObj.height;
                }
            }
        },
        _addMask: function () {
            if( !this.mask ) return;
            if( this.mask instanceof EC.Shape ) {
                this.mask.maskType = this.mask.maskType || "destination-in";
                Sprite.superclass.addChild.call(this, this.mask);
            } else {
                console.error("mask must be a instance of EC.Sahpe");
            }
        }
    });

    /**
    * Masker
    * */

    var Masker = Shape.extend({
        initialize: function(){
            Masker.superclass.initialize.apply(this, arguments);
            this.$type = "Masker";
        },
        draw: function(ctx, obj){
            ctx.globalCompositeOperation = obj.maskType;
            Masker.superclass.draw.call(this, ctx);
            ctx.globalCompositeOperation = "source-over";
        }
    });

    /**
     * Renderer 渲染器
     * **/
    var Renderer = ObjectContainer.extend({
        initialize: function(canvas, options){
            Renderer.superclass.initialize.call(this);

            this.canvas = canvas;
            this.renderContext = this.canvas.getContext('2d');
            this.compositeOperation = "source-over"; /*source-over source-atop source-in source-out destination-over destination-atop destination-in destination-out lighter copy source-over*/
            this.$type = "Stage";
            this.options = EC.extend({}, {showFps: false, scaleMode: 'showAll', width: window.innerWidth, height: window.innerHeight}, options||{});
            this.width = parseFloat(this.canvas.getAttribute("width")) || this.options.width;
            this.height = parseFloat(this.canvas.getAttribute("height")) || this.options.height;
            this.scaleRatio = 1;
            this._isRendering = false;
            this._ticker = new EC.Ticker();

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            if( this.options.scaleMode !== 'noScale' ) {
                this.setAdapter();
            }

            if( this.options.showFps ){
                this.createFps();
                this.showFps();
            }

            this._initEvents();
            this.start();
        },
        addChild: function( childObj ){
            if( !EC.isObject(childObj) ){
                throw new Error(String(childObj) + "is not a instance of EC");
            }
            childObj.renderContext = this.renderContext;
            childObj.stage = this;
            Renderer.superclass.addChild.apply(this, arguments);
            this._triggerAddToStage(childObj);
        },
        render: function(){
            var self = this;
            var _render = function (obj) {
                if (obj.$type == 'Sprite') {
                    obj.getChilds().forEach(function(item){
                        _render(item);
                    });
                } else {
                    self._renderItem(obj);
                }
            };

            this.renderContext.globalCompositeOperation = this.compositeOperation;
            this._children.forEach(_render);

            return this;
        },
        _renderItem: function(obj){
            var self = this;

            if( obj.visible === false ) return;

            var ctx = self.renderContext;
            ctx.save();
            drawContext(ctx, obj);
            switch ( obj.$type ){
                case 'BitMap':
                    drawImg(ctx, obj);
                    break;
                case 'TextField':
                    drawText(ctx, obj);
                    break;
                case 'Shape':
                case 'Masker':
                    drawShape(ctx, obj);
                    break;
            }
            ctx.restore();
        },
        clear: function(){
            this.renderContext.clearRect(0, 0, this.width, this.height);
            return this;
        },
        clearChildren: function(){
            this.removeAllChildren();
        },
        start: function(){
            if( this._isRendering ) return;
            this._isRendering = true;
            this._ticker.start();

            return this;
        },
        stop: function(){
            this._ticker.stop();
            this.dispatch("stop");
            this._isRendering = false;
            return this;
        },
        _triggerAddToStage: function( childObj ){

            var _runAddToStage = function( obj ){

                obj.dispatch("addToStage");

                if (obj.$type == 'Sprite') {
                    obj.getChilds().forEach(_runAddToStage);
                }
            };

            childObj.dispatch("addToStage", childObj);
            childObj.getChilds().forEach(_runAddToStage);
        },
        _triggerEnterFrame: function(){

            var _runEnterFrame = function( obj ){

                obj.dispatch("enterframe");

                if (obj.$type == 'Sprite') {
                    obj.getChilds().forEach(_runEnterFrame);
                }
            };

            this.getChilds().forEach(_runEnterFrame);
        },
        setAdapter: function(){
            var parent = this.canvas.parentNode;
            var parentW = parent.nodeName == 'BODY' ? window.innerWidth : parent.offsetWidth - parseFloat(EC.getStyle(parent, 'padding-left')) - parseFloat(EC.getStyle(parent, 'padding-right'));
            var parentH = parent.nodeName == 'BODY' ? window.innerHeight : parent.offsetHeight - parseFloat(EC.getStyle(parent, 'padding-top')) - parseFloat(EC.getStyle(parent, 'padding-bottom'));
            var width = parentW;
            var height = this.height/this.width*width;

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
            this.scaleRatio = this.width/width;

            return this;
        },
        _initEvents: function(){
            var isShowFPS = this.options.showFps;

            this._ticker.on("ticker", function(){
                isShowFPS && this.FPS.begin();
                this.clear();
                this.render();
                this.dispatch("enterframe");
                isShowFPS && this.FPS.end();
            }, this);

            this.on("enterframe", this._triggerEnterFrame, this);

            if( this.options.scaleMode !== 'noScale' ) {
                window.addEventListener(RESIZE_EVENT, function () {
                    this.setAdapter();
                }.bind(this), false);
            }

            new EC.TouchEvent().attach(this);

        },
        createFps: function(){
            this.FPS = new Stats();
        },
        showFps: function( position ){
            if( EC.isObject(position) ){
                this.FPS.dom.style.left = EC.isDefined( position.left ) ? (EC.isNumber(position.left) ? position.left + "px" : position.left) : "";
                this.FPS.dom.style.right = EC.isDefined( position.right ) ? (EC.isNumber(position.right) ? position.right + "px" : position.right) : "";
                this.FPS.dom.style.top = EC.isDefined( position.top ) ? (EC.isNumber(position.top) ? position.top + "px" : position.top) : "";
                this.FPS.dom.style.bottom = EC.isDefined( position.bottom ) ? (EC.isNumber(position.bottom) ? position.bottom + "px" : position.bottom) : "";
            }

            if( !this._fpsDom ){
                document.body.appendChild(this._fpsDom = this.FPS.dom);
            }
        }
    });

    baseMethods.concat([
        "createLinearGradient",
        "createPattern",
        "createRadialGradient",
        "addColorStop",
        "createImageData",
        "putImageData",
        "getImageData",
        "isPointInPath"
    ]).forEach(function(method){
        Renderer.prototype[method] = function(){
            return this.renderContext[method].apply(this.renderContext, arguments);
        };
    });

    EC.provide({
        TextField: TextField,
        BitMap: BitMap,
        Shape: Shape,
        Masker: Masker,
        Sprite: Sprite,
        Stage: Renderer
    });

}(window.EC);