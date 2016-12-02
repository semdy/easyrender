/**
 * Created by shuxy on 2016/4/20
 */

+function(EC){
    "use strict";

    var slice = Array.prototype.slice;

    function drawImg(ctx, obj){

        var anchorW = -1*(obj.anchorX + obj.parent.anchorX)*obj.width,
            anchorH = -1*(obj.anchorY + obj.parent.anchorY)*obj.height;

        if( obj.sx !== undefined ){
            var _width = ctx.canvas.width,
                _height = ctx.canvas.height,
                swidth = obj.swidth,
                sheight = obj.sheight;

            if( swidth >= _width ) swidth = _width - 1;
            if( sheight >= _height ) sheight = _height - 1;

            ctx.drawImage(obj.bitMapData, obj.sx, obj.sy, swidth, sheight, anchorW, anchorH, obj.width, obj.height);
        } else {
            ctx.drawImage(obj.bitMapData, anchorW, anchorH, obj.width, obj.height);
        }
    }

    function drawText(ctx, obj){
        ctx.font = obj.size + "px " + obj.textFamily;
        ctx.textAlign = obj.textAlign;
        ctx.textBaseline = obj.textBaseline || "top";

        var anchorW = -1*(obj.anchorX + obj.parent.anchorX)*obj.width,
            anchorH = -1*(obj.anchorY + obj.parent.anchorY)*obj.height;

        if( obj.stroke ) {
            ctx.strokeStyle = obj.textColor;
            ctx.strokeText(obj.text, anchorW, anchorH);
        } else {
            ctx.fillStyle = obj.textColor;
            ctx.fillText(obj.text, anchorW, anchorH);
        }
    }

    function mixTextSize(ctx, obj){
        ctx.font = obj.size + "px " + obj.textFamily;
        obj.width = ctx.measureText(obj.text).width;
        obj.height = obj.size + 6;
    }

    function drawShape(ctx, obj){
        ctx.beginPath();
        drawShapeContext(ctx, obj);
        obj.draw(ctx);
    }

    function drawContext(ctx, obj){
        var isMasker = obj.$type === "Masker";
        var parent = obj.parent;
        obj = obj || {};
        ctx.globalAlpha = parent.alpha < 1 ? parent.alpha : obj.alpha;
        ctx.transform(
            obj.scaleX * parent.scaleX, //水平缩放绘图
            obj.skewX * parent.skewX, //水平倾斜绘图
            obj.skewY * parent.skewY, //垂直倾斜绘图
            obj.scaleY * parent.scaleY, //垂直缩放绘图
            parent.x + obj.x + (obj.moveX||0) + (obj.anchorX + parent.anchorX)*obj.width - ( isMasker ? 0 : (parent.mask ? parent.mask.x : 0 )), //水平移动绘图
            parent.y + obj.y + (obj.moveY||0) + (obj.anchorY + parent.anchorY)*obj.height - ( isMasker ? 0 : (parent.mask ? parent.mask.y : 0 )) //垂直移动绘图
        );
        ctx.rotate((obj.rotation + parent.rotation)*Math.PI/180);
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

    function getMin(vals){
        return Math.min.apply(Math, vals);
    }

    function getMax(vals){
        return Math.max.apply(Math, vals);
    }

    function getLineSize(coords){
        var widths = [],
            heights = [];
            coords.forEach(function(coord){
                widths.push(coord[0]);
                heights.push(coord[1]);
            });

        return {
            width: getMax(widths) - getMin(widths),
            height: getMax(heights) - getMin(heights)
        }
    }

    function getQuadraticLineSize(coords){
         var widths = [],
             heights = [];
        coords.forEach(function(coord, i){
           if( i%2 === 0 ){
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

    var drawShapeFuns = {
        rect: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.rect(-anchorW, -anchorH, obj.width, obj.height);
        },

        arc: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.arc(-anchorW + obj.radius, -anchorH + obj.radius, obj.radius, obj.startAngle, obj.endAngle, obj.counterclockwise);
        },

        arcTo: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.moveTo(-anchorW, -anchorH);
            ctx.arcTo(obj.startX - obj.moveX -anchorW, obj.startY - obj.moveY - anchorH, obj.endX - obj.moveX - anchorW, obj.endY - obj.moveY - anchorH, obj.radius);
        },

        roundRect: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.roundRect(-anchorW, -anchorH, obj.width, obj.height, obj.radius);
        },

        lineTo: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            var coords = (anchorW + anchorH + obj.moveX + obj.moveY == 0) ? obj.coords :
                obj.coords.map(function (coord) {
                return [coord[0] - obj.moveX - anchorW, coord[1] - obj.moveY - anchorH];
            });

            ctx.moveTo(-anchorW, -anchorH);
            coords.forEach(function (coord) {
                ctx.lineTo.apply(ctx, coord);
            });
        },

        line: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.moveTo(-anchorW, -anchorH);
            ctx.lineTo(obj.endX - obj.moveX - anchorW, obj.endY - obj.moveY - anchorH);
        },

        dashedLine: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.dashedLine(-anchorW, -anchorH, obj.endX - obj.moveX - anchorW, obj.endY - obj.moveY - anchorH, obj.dashLength);
        },

        ellipse: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            ctx.ellipse(-anchorW + obj.width/2, -anchorH + obj.height/2, obj.width, obj.height);
        },
        clip: function (ctx) {
            ctx.clip();
        },
        quadraticCurveTo: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            var coords = (anchorW + anchorH + obj.moveX + obj.moveY == 0) ? obj.coords :
                obj.coords.map(function (coord, i) {
                return i % 2 === 0 ? coord - obj.moveX - anchorW : coord - obj.moveY - anchorH;
            });
            ctx.moveTo(-anchorW, -anchorH);
            ctx.quadraticCurveTo.apply(ctx, coords);
        },
        bezierCurveTo: function (ctx, obj) {
            var anchorW = (obj.anchorX + obj.parent.anchorX)*obj.width,
                anchorH = (obj.anchorY + obj.parent.anchorY)*obj.height;
            var coords = (anchorW + anchorH + obj.moveX + obj.moveY == 0) ? obj.coords :
                obj.coords.map(function (coord, i) {
                return i % 2 === 0 ? coord - obj.moveX - anchorW : coord - obj.moveY - anchorH;
            });
            ctx.moveTo(-anchorW, -anchorH);
            ctx.bezierCurveTo.apply(ctx, coords);
        }
    };



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

        setParams: function ( params ) {
            if( EC.isObject(params) ) {
                for (var i in params) {
                    if (params.hasOwnProperty(i))
                        this[i] = params[i];
                }
            }

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
            this._fill = false;
            this._stroke = false;
            this._closePath = false;

            this.$type = "Shape";
        },
        _setStyle: function(type, color, alpha, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY){
            if(typeof alpha == 'number' && alpha < 1){
                this[type] = EC.Util.color.toRgb(color, alpha);
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
            this._fill = true;
            this._setStyle.apply(this, args);
        },
        stroke: function(){
            var args = slice.call(arguments);
            args.unshift("strokeStyle");
            this._stroke = true;
            this._setStyle.apply(this, args);
        },
        draw: function(ctx){
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
        rect: function (x, y, width, height) {
            this.moveX = x;
            this.moveY = y;
            this.width = width;
            this.height = height;
            this.drawType = 'rect';
            return this;
        },
        arc: function (x, y, radius, startAngle, endAngle, counterclockwise) {
            this.moveX = x;
            this.moveY = y;
            this.radius = radius;
            this.startAngle = startAngle;
            this.endAngle = endAngle;
            this.counterclockwise = counterclockwise;
            this.width = this.radius*2;
            this.height = this.radius*2;
            this.drawType = 'arc';
            return this;
        },
        arcTo: function (startX, startY, endX, endY, radius) {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.radius = radius;
            this.width = startX;
            this.height = radius;
            this.drawType = 'arcTo';
            return this;
        },
        roundRect: function (x, y, width, height, radius) {
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
        },
        lineTo: function () {
            this.coords = slice.call(arguments);
            var lineSize = getLineSize(this.coords);
            this.width = lineSize.width;
            this.height = lineSize.height;
            this.drawType = 'lineTo';
            return this;
        },
        line: function (x, y, endX, endY) {
            this.moveX = x;
            this.moveY = y;
            this.endX = endX;
            this.endY = endY;
            this.width = endX - x;
            this.height = this.lineWidth;
            this.drawType = 'line';
            return this;
        },
        dashedLine: function (x, y, endX, endY, dashLength) {
            this.moveX = x;
            this.moveY = y;
            this.endX = endX;
            this.endY = endY;
            this.dashLength = dashLength;
            this.width = endX - x;
            this.height = this.lineWidth;
            this.drawType = 'dashedLine';
            return this;
        },
        ellipse: function (x, y, width, height) {
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
            var lineSize = getQuadraticLineSize([this.moveX, this.moveY].concat(this.coords));
            this.width = lineSize.width;
            this.height = lineSize.height;
            this.drawType = 'quadraticCurveTo';
            return this;
        },
        bezierCurveTo: function () {
            this.coords = slice.call(arguments);
            var lineSize = getQuadraticLineSize([this.moveX, this.moveY].concat(this.coords));
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
            ctx.translate(-this.parent.x, -this.parent.y);
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

            /*var moveX = childObj.moveX || 0;
            var moveY = childObj.moveY || 0;
            var childs = this.getChilds().filter(function (obj) {
                return obj.$type !== 'Masker';
            });

            if (childs.length == 1) {
                this.width = childObj.x + moveX + childObj.width;
                this.height = childObj.y + moveY + childObj.height;
            } else {
                if (childObj.x + moveX + childObj.width > this.width) {
                    this.width = childObj.x + moveX + childObj.width;
                }
                if (childObj.y + moveY + childObj.height > this.height) {
                    this.height = childObj.y + moveY + childObj.height;
                }
            }*/
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
            this.width = 180;
            this.height = 32;
            this.backgroundAlpha = 1;
            this.backgroundColor = "";
            this.backgroundImage = "";
            this.backgroundRepeat = "repeat";
            this.borderAlpha = 1;
            this.borderColor = "#000";
            this.borderRadius = 0;
            this.borderWidth = 1;
            this.padding = 3;
            this.fontSize = 14;
            this.color = "#000";
            this.placeholder = "";
            this.fontFamily = "";
            this.lineHeight = 0;
            this.inputType = "text";

            this.on("addToStage", function () {
                this._create();
                this._events();
            }, this);
        },
        _create: function(){
            var pad = this.padding;
            this.touchEnabled = true;
            this.padding = EC.isArray(pad) ? pad : [pad, pad, pad, pad];

            this.input = new Shape();
            this.textField = new TextField();
            this.inputText = document.createElement(this.inputType == "textarea" ? "textarea" : "input");

            this.input.x = this.borderWidth/2;
            this.input.y = this.borderWidth/2;
            this.input.lineWidth = this.borderWidth;
            this.input.stroke(this.borderColor, this.borderAlpha);

            var bgPattern = this.backgroundImage;
            if( EC.isObject(bgPattern) ){
                var fillStyle = this.renderContext.createPattern(bgPattern.nodeName === "IMG" ? bgPattern : bgPattern.bitMapData, this.backgroundRepeat);
                this.input.fill(fillStyle);
            } else if( this.backgroundColor ) {
                this.input.fill(this.backgroundColor, this.backgroundAlpha);
            }

            if( this.borderRadius > 0 ){
                this.input.roundRect(0, 0, this.width, this.height, this.borderRadius);
            } else {
                this.input.rect(0, 0, this.width, this.height);
            }

            if( this.inputType != "textarea" ) {
                this.inputText.type = this.inputType;
                this.mask = new Masker();
                this.mask.rect(0, 0, this.width + this.borderWidth*2, this.height + this.borderWidth*2);
            } else {
                this.lineHeight = 18;
            }

            if( this.placeholder ){
                this.inputText.setAttribute("placeholder", this.placeholder);
            }

            this._setInputStyle();

            this.textField.text = this.placeholder;
            this.textField.textColor = this.color;
            this.textField.size = this.fontSize;
            this.textField.textFamily = this.fontFamily || this.textField.textFamily;

            this.addChild(this.input);
            this.addChild(this.textField);

            this.textField.x = this.borderWidth + this.padding[3];
            this.textField.y = this.inputType == "textarea" ? this.padding[0] : (this.height - this.textField.height + this.borderWidth)/2;

            document.body.appendChild(this.inputText);

        },
        _setInputStyle: function () {
            var self = this;
            var ratio = 1/this.stage.scaleRatio;
            this.inputText.style.cssText = "display:none;position:absolute;border:none;background:none;outline:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;appearance:none;-webkit-text-size-adjust:none;text-size-adjust:none;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;resize:none;" +
                "left:"+ (this.x + this.input.x)*ratio +"px;top:"+ (this.y + this.input.y)*ratio +"px;width:"+ this.width*ratio +"px;height:"+ this.height*ratio +"px;line-height:"+ (this.lineHeight || this.height)*ratio +"px;font-size:"+ this.fontSize*ratio +"px;font-family:"+ (this.fontFamily || this.textField.textFamily) +";color:"+ this.color +";padding:" +
                this.padding.map(function (pad) {return pad + self.borderWidth/2*ratio + "px"}).join(" ");
        },
        _events: function () {
            this.on("touch", function () {
                this._setInputStyle();
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
                this.textField.text = this.inputText.value;
                this.textField.visible = true;
                this.inputText.style.display = "none";alert("blur");
                this.dispatch("blur", {target: this, originalEvent: e, value: this.inputText.value});
            }.bind(this), false);

            this.inputText.addEventListener("input", function (e) {
                this.dispatch("input", {target: this, originalEvent: e, value: this.inputText.value});
            }.bind(this), false);

            if( EC.isTouch ){
                window.addEventListener(EC.EVENTS.RESIZE, function () {
                    this.inputText.blur();
                }.bind(this), false);
            }
        }
    });

    /**
     * Stage 渲染器
     * **/
    var Stage = ObjectContainer.extend({
        initialize: function(canvas, options){
            Stage.superclass.initialize.call(this);

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
            Stage.superclass.addChild.apply(this, arguments);
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

    [
        "createLinearGradient",
        "createPattern",
        "createRadialGradient",
        "addColorStop",
        "createImageData",
        "putImageData",
        "getImageData",
        "isPointInPath"
    ].forEach(function(method){
        Stage.prototype[method] = function(){
            return this.renderContext[method].apply(this.renderContext, arguments);
        };
    });

    EC.provide({
        TextField: TextField,
        BitMap: BitMap,
        Shape: Shape,
        TextInput: TextInput,
        Masker: Masker,
        Sprite: Sprite,
        Stage: Stage
    });

}(window.EC);