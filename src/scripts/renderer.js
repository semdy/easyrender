/**
 * Created by shuxy on 2016/4/20
 */

+function(EC){
    "use strict";

    var slice = Array.prototype.slice;

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
            obj.parent.x + obj.x + (obj.anchorX + obj.parent.anchorX)*obj.width - ( obj.$type === "Masker" ? 0 : (obj.parent.mask ? obj.parent.mask.x : 0 )), //水平移动绘图
            obj.parent.y + obj.y + (obj.anchorY + obj.parent.anchorY)*obj.height - ( obj.$type === "Masker" ? 0 : (obj.parent.mask ? obj.parent.mask.y : 0 )) //垂直移动绘图
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
        "bezierCurveTo",
        "roundRect",
        "dashedLine",
        "ellipse"
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
            this.radius = 0;

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
            if( /(?:rect|roundRect|arc|ellipse|dashedLine)/.test(method) ){
                self.x = self.x + args.shift();
                self.y = self.y + args.shift();
                var x = -1*self.anchorX*self.width,
                    y = -1*self.anchorY*self.height;
                if( method == 'arc' ) {
                    self.radius = args.shift();
                    self.width = self.radius*2;
                    self.height = self.radius*2;
                    args = [x + self.width/2, y + self.height/2, self.radius].concat(args);
                } else {
                    self.width = args[0];
                    self.height = args[1];
                    if( method == 'ellipse' ){
                        args = [x + self.width/2, y + self.height/2].concat(args);
                    } else if( method == 'roundRect' ){
                        var w = args.shift();
                        var h = args.shift();
                        self.radius = args.shift();
                        args = [x, y, w, h, self.radius].concat(args);
                    } else if( method == 'dashedLine' ) {
                        var x2 = args.shift();
                        var y2 = args.shift();
                        args = [x, y, x2 + x - self.x, y2 + y - self.y].concat(args);
                    } else {
                        args = [x, y].concat(args);
                    }
                }
            }

            this._drawFuns.push(function(ctx){
                ctx[method].apply(ctx, args);
            });
        };
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
            return this;
        },
        ellipse: function (x, y, width, height) {
            var k = (width/0.75)/2,
                h = height/2;

            this.moveTo(x, y-h);
            this.bezierCurveTo(x+k, y-h, x+k, y+h, x, y+h);
            this.bezierCurveTo(x-k, y+h, x-k, y-h, x, y-h);
            this.closePath();
            return this;
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
        draw: function(ctx){
            Masker.superclass.draw.call(this, ctx);
            ctx.clip();
        }
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

            this._addMask();
            Sprite.superclass.addChild.apply(this, arguments);

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
            if( !this.mask || this._isMaskAdded ) return;
            if( this.mask instanceof EC.Masker ) {
                Sprite.superclass.addChild.call(this, this.mask, 0);
                this._isMaskAdded = true;
            } else {
                console.error("mask must be a instance of EC.Masker");
            }
        }
    });

    /**
     * TextInput
     * */

    var TextInput = Sprite.extend({
        initialize: function(){
            TextInput.superclass.initialize.apply(this, arguments);
        },
        addChild: function(){
            TextInput.superclass.addChild.apply(this, arguments);
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
            this.compositeOperation = "source-over"; /*source-over source-atop source-in source-out destination-over destination-atop destination-in destination-out xor lighter copy source-over*/
            this.$type = "Stage";
            this.options = EC.extend({}, {showFps: false, scaleMode: 'showAll', width: window.innerWidth, height: window.innerHeight}, options||{});
            this.width = parseFloat(this.canvas.getAttribute("width")) || this.options.width;
            this.height = parseFloat(this.canvas.getAttribute("height")) || this.options.height;
            this.scaleRatio = 1;
            this._isRendering = false;
            this._ticker = new EC.Ticker();

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            if( this.options.scaleMode !== "noScale" ) {
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
            var ctx = this.renderContext;
            var _render = function (obj) {
                if (obj.$type == 'Sprite') {

                    obj.mask && ctx.save();

                    obj.getChilds().forEach(function(item){
                        _render(item);
                    });

                    obj.mask && ctx.restore();

                } else {
                    self._renderItem(obj, ctx);
                }
            };

            ctx.globalCompositeOperation = this.compositeOperation;
            this._children.forEach(_render);

            return this;
        },
        _renderItem: function(obj, ctx){

            if( obj.visible === false ) return;

            switch ( obj.$type ){
                case 'BitMap':
                    ctx.save();
                    drawContext(ctx, obj);
                    drawImg(ctx, obj);
                    ctx.restore();
                    break;
                case 'TextField':
                    ctx.save();
                    drawContext(ctx, obj);
                    drawText(ctx, obj);
                    ctx.restore();
                    break;
                case 'Shape':
                    ctx.save();
                    drawContext(ctx, obj);
                    drawShape(ctx, obj);
                    ctx.restore();
                    break;
                case 'Masker':
                    drawContext(ctx, obj);
                    drawShape(ctx, obj);
                    break;
            }
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
                window.addEventListener(EC.EVENTS.RESIZE, function () {
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