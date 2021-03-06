/**
 * Created by semdy on 2016/4/20
 */

;(function (EC, undefined) {
  "use strict";

  var PI = Math.PI;
  var CONST_ANGLE = PI / 180;
  var slice = Array.prototype.slice;
  var tmpCtx = document.createElement("canvas").getContext("2d");
  var heightCache = {};
  var textInputDiv;

  function drawImg(ctx, obj) {
    if (!obj.texture) return;
    if (obj.sx !== undefined) {
      ctx.drawImage(obj.texture, obj.sx, obj.sy, obj.swidth, obj.sheight, obj.offsetX, obj.offsetY, obj.width, obj.height);
    }
    else if (obj.cacheAsBitmap) {
      ctx.drawImage(obj.texture, obj.offsetX, obj.offsetY, obj.texture.width, obj.texture.height);
    }
    else {
      ctx.drawImage(obj.texture, obj.offsetX, obj.offsetY, obj.width, obj.height);
    }
  }

  function fillBitmapText(obj) {
    var data = obj.$fontData.frames;
    var texture = obj.$fontTexture;
    var textwrap = obj.$textwrap;
    var startX = 0;
    var lastWidth = 0;
    var bitmapText;
    var item;

    textwrap.children.length = 0;
    obj.$textArr.forEach(function (n) {
      item = data[n];
      bitmapText = new Bitmap().setParams({
        $texture: texture,
        $width: item.w,
        $height: item.h,
        $sx: item.x,
        $sy: item.y,
        $offsetX: startX += (lastWidth + obj.$letterSpacing),
        $swidth: item.w,
        $sheight: item.h
      });

      lastWidth = item.w;
      textwrap.addChild(bitmapText);

    });

    if (obj.$textAlign === 'center') {
      textwrap.$x = (obj.parent.width - textwrap.width) / 2;
    }
    else if (obj.$textAlign === 'right') {
      textwrap.$x = obj.parent.width - textwrap.width;
    }
  }

  function drawBitmapText(ctx, obj) {
    fillBitmapText(obj);
    ctx.save();
    ctx.translate(obj.$textwrap.x, obj.$textwrap.y);
    obj.$textwrap.each(function (childObj) {
      drawImg(ctx, childObj);
    });
    ctx.restore();
  }

  function drawShape(ctx, obj) {
    ctx.beginPath();
    drawShapeContext(ctx, obj);
    obj.draw(ctx);
  }

  function drawContext(ctx, obj) {
    var parent = obj.parent || {};
    var offsetX = obj.offsetX * (obj.anchorX > 0 ? 1 : 0);
    var offsetY = obj.offsetY * (obj.anchorY > 0 ? 1 : 0);
    var anchorW = obj.anchorX * obj.width;
    var anchorH = obj.anchorY * obj.height;

    var x = obj.x + offsetX + anchorW - ( obj.$isMasker ? 0 : (parent.mask ? parent.mask.x : 0 ));
    var y = obj.y + offsetY + anchorH - ( obj.$isMasker ? 0 : (parent.mask ? parent.mask.y : 0 ));

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
      ctx.translate(-offsetX - anchorW, -offsetY - anchorH);
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
      } catch (e) {
      }
    }
  }

  function getFontStyle(obj) {
    return obj.font || (obj.textStyle + " " + obj.textWeight + " " + obj.size + "px " + obj.fontFamily);
  }

  function drawText(ctx, obj) {
    ctx.font = getFontStyle(obj);
    ctx.textAlign = obj.textAlign;
    ctx.textBaseline = obj.textBaseline;

    var textX = obj.textAlign === "center" ? obj.width / 2 : (obj.textAlign === "right" ? obj.width : 0);
    var textY = 0;

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
    tmpCtx.font = getFontStyle(obj);
    tmpCtx.textAlign = obj.textAlign;
    return tmpCtx.measureText(text).width;
  }

  function getChildren(obj) {
    return obj.$mask ? [obj.$mask].concat(obj.children) : obj.children;
  }

  //检测BOM环境
  function isBOMEnv() {
    return typeof window === 'object' && !!window.document && !!window.setInterval;
  }

  //BOM环境测量文本高度的方法
  function determineFontHeight(fontStyle) {
    var result = heightCache[fontStyle];

    if (!result) {
      var body = document.body;
      var dummy = document.createElement('div');

      var dummyText = document.createTextNode('gM');
      dummy.appendChild(dummyText);
      dummy.setAttribute('style', 'font:' + fontStyle + ';position:absolute;top:0;left:-9999px');
      body.appendChild(dummy);
      result = dummy.offsetHeight;
      heightCache[fontStyle] = result;
      body.removeChild(dummy);
    }

    return result;
  }

  //非BOM环境测量文本高度的方法
  function determineFontHeightInPixels(fontStyle) {
    var result = heightCache[fontStyle];

    if (!result) {
      var fontDraw = document.createElement("canvas");
      var ctx = fontDraw.getContext('2d');
      ctx.fillRect(0, 0, fontDraw.width, fontDraw.height);
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'white';
      ctx.font = fontStyle;
      ctx.fillText('gM', 0, 0);
      var pixels = ctx.getImageData(0, 0, fontDraw.width, fontDraw.height).data;
      var start = -1;
      var end = -1;
      for (var row = 0; row < fontDraw.height; row++) {
        for (var column = 0; column < fontDraw.width; column++) {
          var index = (row * fontDraw.width + column) * 4;
          if (pixels[index] === 0) {
            if (column === fontDraw.width - 1 && start !== -1) {
              end = row;
              row = fontDraw.height;
              break;
            }
            continue;
          }
          else {
            if (start === -1) {
              start = row;
            }
            break;
          }
        }
      }
      result = end - start;
      heightCache[fontStyle] = result;
    }

    return result;
  }

  var getTextHeight = isBOMEnv() ? function (obj) {
    return determineFontHeight(getFontStyle(obj));
  } : function (obj) {
    return determineFontHeightInPixels(getFontStyle(obj));
  };

  function getMin(vals) {
    return vals.length === 0 ? 0 : Math.min.apply(Math, vals);
  }

  function getMax(vals) {
    return vals.length === 0 ? 0 : Math.max.apply(Math, vals);
  }

  function getLineSize(coords, offsetX, offsetY) {
    var widths = [offsetX];
    var heights = [offsetY];
    coords.forEach(function (coord) {
      widths.push(coord[0]);
      heights.push(coord[1]);
    });

    return {
      width: getMax(widths) - getMin(widths),
      height: getMax(heights) - getMin(heights)
    }
  }

  function getQuadraticLineSize(coords, offsetX, offsetY) {
    var widths = [offsetX || 0];
    var heights = [offsetY || 0];
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

  function getBezierCurveLineSize(coords) {
    var widths = [];
    var heights = [];
    coords.forEach(function (coord) {
      widths.push(coord[0]);
      heights.push(coord[1]);
    });

    return {
      width: getMax(widths) - getMin(widths),
      height: getMax(heights) - getMin(heights)
    }
  }

  function getTotalOffset(object, includeMoveOffset) {
    var x = object.x + ( includeMoveOffset ? object.offsetX : 0 );
    var y = object.y + ( includeMoveOffset ? object.offsetY : 0 );
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

    var NewObj = function () {
    };
    NewObj.prototype = object;
    var newObj = new NewObj();
    newObj.$x = objectOffset.x;
    newObj.$y = objectOffset.y;

    ctx.save();
    drawContext(ctx, newObj);
    ctx.beginPath();
    drawShapeMethods[newObj.drawType || 'rect'](ctx, newObj);
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
      if ((target.x <= this.x + this.width) && (target.x + target.width >= this.x) &&
        (target.y <= this.y + this.height) && (target.y + target.height >= this.y)) {
        return true;
      }

      return false;
    }
  };

  var drawShapeMethods = {
    rect: function (ctx, obj) {
      ctx.rect(obj.offsetX, obj.offsetY, obj.width, obj.height);
    },

    arc: function (ctx, obj) {
      ctx.arc(obj.radius + obj.offsetX, obj.radius + obj.offsetY, obj.radius, obj.startAngle * PI, obj.endAngle * PI, obj.counterclockwise);
    },

    sector: function (ctx, obj) {
      ctx.moveTo(obj.radius + obj.offsetX, obj.radius + obj.offsetY);
      this.arc.apply(this, arguments);
    },

    arcTo: function (ctx, obj) {
      ctx.moveTo(obj.offsetX, obj.offsetY);
      ctx.arcTo(obj.startX, obj.startY, obj.endX, obj.endY, obj.radius);
    },

    roundRect: function (ctx, obj) {
      ctx.roundRect(obj.offsetX, obj.offsetY, obj.width, obj.height, obj.radius);
    },

    lineTo: function (ctx, obj) {
      ctx.moveTo(obj.offsetX, obj.offsetY);
      obj.coords.forEach(function (coord) {
        ctx.lineTo.apply(ctx, coord);
      });
    },

    line: function (ctx, obj) {
      ctx.moveTo(obj.offsetX, obj.offsetY);
      ctx.lineTo(obj.endX, obj.endY);
    },

    dashedLine: function (ctx, obj) {
      ctx.dashedLine(obj.offsetX, obj.offsetY, obj.endX, obj.endY, obj.dashLength);
    },

    ellipse: function (ctx, obj) {
      ctx.ellipse(obj.width / 2 + obj.offsetX, obj.height / 2 + obj.offsetY, obj.width, obj.height);
    },

    curve: function (ctx, obj) {
      ctx.curve(obj.coords);
    },

    quadraticCurveTo: function (ctx, obj) {
      ctx.moveTo(obj.offsetX, obj.offsetY);
      ctx.quadraticCurveTo.apply(ctx, obj.coords);
    },

    bezierCurveTo: function (ctx, obj) {
      ctx.moveTo(obj.offsetX, obj.offsetY);
      ctx.bezierCurveTo.apply(ctx, obj.coords);
    }
  };

  /**
   * DisplayObject 基类
   * **/
  var DisplayObject = EC.Event.extend({

    initialize: function () {
      DisplayObject.superclass.initialize.call(this);

      this.$x = 0;
      this.$y = 0;
      this.$offsetX = 0;
      this.$offsetY = 0;
      this.$width = 0;
      this.$height = 0;
      this.$rotation = 0;
      this.$skewX = 0;
      this.$skewY = 0;
      this.$alpha = 1;
      this.$scaleX = 1;
      this.$scaleY = 1;
      this.$anchorX = 0;
      this.$anchorY = 0;
      this.$mask = null;
      this.$visible = true;
      this.$touchEnabled = false;
      this.$hasDefineWidth = false;
      this.$hasDefineHeight = false;
      this.$hasAddToStage = false;
      this.$renderType = 'DisplayObject';

      this.cursor = 'pointer';
      this.children = [];

      this.once("addToStage", function (e) {
        this.renderContext = e.renderContext;
        this.stage = e.stage;
        this.$hasAddToStage = true;
        if (this.$mask) {
          this.addMask(this.$mask);
        }
      }, this);

      ['x', 'y', 'offsetX', 'offsetY', 'width', 'height', 'rotation',
        'skewX', 'skewY', 'alpha', 'scaleX', 'scaleY', 'anchorX',
        'anchorY', 'visible', 'touchEnabled'
      ].forEach(function (prop) {
        this.defineProperty(prop, {
          get: function () {
            return this['$' + prop];
          },
          set: function (newVal) {
            this['$' + prop] = newVal;
            if (prop === 'width') {
              this.$hasDefineWidth = true;
            }
            else if (prop === 'height') {
              this.$hasDefineHeight = true;
            }
            this.updateRender();
          },
          enumerable: true
        });
      }.bind(this));

      this.defineProperty('mask', {
        set: function (masker) {
          this.$mask = masker;
          this.addMask(masker);
        },
        get: function () {
          return this.$mask;
        },
        enumerable: true
      });

    },

    updateRender: function (fromSelf) {
      var target = fromSelf
        ? this
        : this.parent;

      if (!target || !target.$hasAddToStage) return;

      if (target.$throttle) clearTimeout(target.$throttle);

      target.$throttle = setTimeout(function () {

        while (target && target.size() > 0) {
          if (target.$cacheRenderer) {
            target.$cacheRenderer.clear();
            target.$cacheRenderer.renderCache(target);
          }
          target = target.parent;
        }

      });
    },

    remove: function () {
      if (this.parent) {
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

    getSize: function () {
      var x = this.x + this.offsetX;
      var y = this.y + this.offsetY;
      var lineWidth = this.lineWidth || 0;
      var width = x + this.width + lineWidth;
      var height = y + this.height + lineWidth;

      return {
        width: width,
        height: height
      }
    },

    getBounds: function () {
      return new Bounds(this);
    },

    collideWith: function (displayObject) {
      return EC.Util.hitTest(this, displayObject);
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

    defineProperty: function (property, descriptor) {
      Object.defineProperty(this, property, descriptor);
      return this;
    },

    addMask: function (masker) {
      if (!this.$hasAddToStage) return;

      var isSprite = this.$renderType === 'Sprite';
      var target = isSprite
        ? this
        : this.parent;

      if (masker === null && target.$hasAddMask) {
        target.$mask = null;
        target.$hasAddMask = false;
        if (target.cacheAsBitmap) {
          this.updateRender(isSprite);
        }
        return;
      }

      if (masker instanceof EC.Shape) {
        masker.parent = target;
        target.$mask = masker;
        masker.$isMasker = true;
        target.$hasAddMask = true;
        target.cacheAsBitmap && this.updateRender(isSprite);
      } else {
        throw new TypeError("mask must be a instance of EC.Shape");
      }
    },

    $triggerAddToStage: function (childObj, context) {
      var setParams = function (obj) {
        return {target: obj, renderContext: context.renderContext, stage: context};
      };
      var _runAddToStage = function (obj) {
        if (!obj.$hasAddToStage) {
          obj.dispatch("addToStage", setParams(obj));
        }
        if (obj.$renderType === 'Sprite') {
          obj.each(_runAddToStage);
        }
      };
      _runAddToStage(childObj);
    },

    $triggerRemove: function (childObj) {
      var _runRemove = function (obj) {
        obj.dispatch("remove", obj);
        if (obj.$renderType === 'Sprite') {
          obj.each(_runRemove);
        }
      };
      _runRemove(childObj);
    }
  });


  /**
   * DisplayObjectContainer 操作基类
   * **/
  var DisplayObjectContainer = DisplayObject.extend({
    initialize: function () {
      DisplayObjectContainer.superclass.initialize.call(this);

      this.$renderType = 'Sprite';

      this.defineProperty('numChildren', {
        get: function () {
          return this.size();
        },
        enumerable: true
      });
    },

    addChild: function (object, index) {
      if (!(object instanceof DisplayObject)) {
        throw new TypeError(String(object) + " is not a instance of EC.DisplayObject");
      }

      /*if (object.parent) {
        object.parent.removeChild(object);
      }*/

      object.parent = this;

      if (!EC.isNumber(index)) {
        this.children.push(object);
      } else {
        this.children.splice(index, 0, object);
      }

      if (this.$hasAddToStage) {
        this.$triggerAddToStage(object, this.stage);
      }

      return this;
    },

    addChildAt: function () {
      return this.addChild.apply(this, arguments);
    },

    removeChild: function (object) {
      var index = this.getChildIndex(object);
      if (index > -1) {
        this.getChilds().splice(index, 1);
      }

      delete object.parent;
      object.clearEvent();
      EC.Tween.removeTweens(object);
      this.$triggerRemove(object);

      return this;
    },

    removeChildAt: function (i) {
      var c = this.children;
      if (c.length <= i) {
        return this;
      }

      var object = c.splice(i, 1)[0];
      if (object) {
        delete object.parent;
        object.clearEvent();
        EC.Tween.removeTweens(object);
        this.$triggerRemove(object);
      }

      return this;
    },

    removeAllChildren: function () {
      EC.Tween.removeAllTweens(this);

      this.each(function (child, index) {
        this.removeChildAt(index);
      }, this);

      this.children.length = 0;

      return this;
    },

    setChildIndex: function (child, index) {
      var i = this.getChildIndex(child);
      if (i > -1) {
        this.children.splice(i, 1);
        this.children.splice(index, 0, child);
      }

      return this;
    },

    getChilds: function () {
      return this.children;
    },

    getChildAt: function (i) {
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
    }
  });

  /**
   * TextField 文字类
   * **/
  var TextField = DisplayObject.extend({
    initialize: function (text, size, x, y, color, align, family, width, height) {
      TextField.superclass.initialize.call(this);

      this.$x = x || 0;
      this.$y = y || 0;
      this.$width = width || 0;
      this.$height = height || 0;
      this.$text = text || "";
      this.$textArr = [];
      this.$size = size || 16;
      this.$textAlign = align || "start";
      this.$textBaseline = "top";
      this.$textColor = color || "#000";
      this.$fontFamily = family || "Arial";
      this.$strokeColor = color || "#000";
      this.$textStyle = "normal";
      this.$textWeight = "normal";
      this.$lineSpacing = 2;
      this.$stroke = false;
      this.$strokeOnly = false;
      this.$multiline = false;
      this.$renderType = "TextField";

      var determineTextSetter = function () {
        if (this.multiline) {
          this.$textArr = calcTextArr(this, this.$text).split(/\n/);
        }
        else {
          this.$textArr = this.$text.split(/\n/);
          if (!this.$hasDefineWidth) {
            this.$width = getTextWidth(this, getMaxLenText(this.$textArr));
          }
        }
        if (!this.$hasDefineHeight) {
          this.$height = (getTextHeight(this) + this.lineSpacing) * this.numLines - this.lineSpacing;
        }
      };

      this.defineProperty('text', {
        get: function () {
          return this.$text;
        },
        set: function (newVal) {
          this.$text = String(newVal);
          determineTextSetter.call(this);
          this.updateRender();
        },
        enumerable: true
      });

      this.defineProperty('size', {
        get: function () {
          return this.$size;
        },
        set: function (newVal) {
          this.$size = newVal;
          if (this.$text) {
            determineTextSetter.call(this);
            this.updateRender();
          }
        },
        enumerable: true
      });

      this.defineProperty('numLines', {
        get: function () {
          return this.$textArr.length;
        },
        enumerable: true
      });

      this.defineProperty('bold', {
        set: function (newVal) {
          if (newVal === true) {
            this.textWeight = 'bold';
          } else {
            this.textWeight = 'normal';
          }
        },
        get: function () {
          return this.textWeight === 'bold';
        },
        enumerable: true
      });

      this.defineProperty('italic', {
        set: function (newVal) {
          if (newVal === true) {
            this.textStyle = 'italic';
          } else {
            this.textStyle = 'normal';
          }
        },
        get: function () {
          return this.textStyle === 'italic';
        },
        enumerable: true
      });

      [
        'textAlign',
        'textBaseline',
        'textColor',
        'fontFamily',
        'strokeColor',
        'textStyle',
        'textWeight',
        'lineSpacing',
        'stroke',
        'strokeOnly',
        'multiline'
      ].forEach(function (prop) {
        this.defineProperty(prop, {
          get: function () {
            return this['$' + prop];
          },
          set: function (newVal) {
            this['$' + prop] = newVal;
            this.updateRender();
          },
          enumerable: true
        });
      }.bind(this));

      if (this.$text) {
        this.text = this.$text;
      }

    }
  });

  /**
   * Bitmap 位图类
   * **/
  var Bitmap = DisplayObject.extend({
    initialize: function (key, x, y, width, height, sx, sy, swidth, sheight) {
      Bitmap.superclass.initialize.call(this);

      this.$x = x || 0;
      this.$y = y || 0;
      this.$renderType = "Bitmap";
      this.$texture = null;

      if (EC.isDefined(sx)) {
        this.$sx = sx;
      }

      if (EC.isDefined(sy)) {
        this.$sy = sy;
      }

      if (EC.isDefined(swidth)) {
        this.$swidth = swidth || 0.1;
      }

      if (EC.isDefined(sheight)) {
        this.$sheight = sheight || 0.1;
      }

      if (EC.isDefined(key)) {
        this.setTexture(key);
      }

      if (EC.isDefined(width)) {
        this.$width = width;
      }

      if (EC.isDefined(height)) {
        this.$height = height;
      }

      this.defineProperty('texture', {
        set: function (data) {
          this.setTexture(data);
        },
        get: function () {
          return this.$texture;
        },
        enumerable: true
      });

      [
        'sx',
        'sy',
        'swidth',
        'sheight'
      ].forEach(function (prop) {
        this.defineProperty(prop, {
          get: function () {
            return this['$' + prop];
          },
          set: function (newVal) {
            this['$' + prop] = newVal;
            this.updateRender();
          },
          enumerable: true
        });
      }.bind(this));

    },
    setTexture: function (data) {
      if (EC.isString(data)) {
        this.setTexture(RES.getRes(data));
      }
      else if (EC.isObject(data)) {
        if (data.nodeName === "IMG") {
          this.setParams({
            $texture: data,
            $width: data.width,
            $height: data.height
          });
        }
        else {
          this.setParams({
            $texture: data.texture,
            $width: data.width,
            $height: data.height
          });
        }
        this.updateRender();
      }
      else {
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

      this.$x = x || 0;
      this.$y = y || 0;
      this.$width = w || 0;
      this.$height = h || 0;
      this.$fillStyle = null;
      this.$strokeStyle = null;
      this.$lineWidth = 0;
      this.$shadowColor = null;
      this.$shadowBlur = 0;
      this.$shadowOffsetX = 0;
      this.$shadowOffsetY = 0;
      this.$radius = 0;
      this.$dashLength = 0;
      this.$dashGap = 0;
      this.$lineCap = null;
      this.$lineJoin = null;
      this.$miterLimit = null;
      this.$closePath = false;
      this.$counterclockwise = false;
      this.$startX = 0;
      this.$startY = 0;
      this.$endX = 0;
      this.$endY = 0;
      this.$startAngle = 0;
      this.$endAngle = 0;
      this.$coords = [];
      this.$drawType = 'rect';

      this.$renderType = "Shape";
      this.$needFill = false;
      this.$needStroke = false;

      [
        'fillStyle',
        'strokeStyle',
        'lineWidth',
        'shadowColor',
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'lineCap',
        'lineJoin',
        'miterLimit',
        'radius',
        'dashLength',
        'dashGap',
        'closePath',
        'startX',
        'startY',
        'endX',
        'endY',
        'startAngle',
        'endAngle',
        'counterclockwise',
        'coords',
        'drawType'
      ].forEach(function (prop) {
        this.defineProperty(prop, {
          get: function () {
            return this['$' + prop];
          },
          set: function (newVal) {
            this['$' + prop] = newVal;
            this.updateRender();
          },
          enumerable: true
        });
      }.bind(this));
    },
    setStyle: function (type, color, alpha) {
      if (typeof alpha === 'number' && alpha < 1) {
        this[type] = EC.Util.color.toRgb(color, alpha);
      } else {
        this[type] = color || "#000";
      }
    },
    fill: function () {
      var args = slice.call(arguments);
      args.unshift("fillStyle");
      this.$needFill = true;
      this.setStyle.apply(this, args);
    },
    stroke: function () {
      var args = slice.call(arguments);
      args.unshift("strokeStyle");
      this.$needStroke = true;
      this.setStyle.apply(this, args);
    },
    draw: function (ctx) {
      drawShapeMethods[this.drawType](ctx, this);
      this.$closePath && ctx.closePath();
      this.$needFill && ctx.fill();
      this.$needStroke && ctx.stroke();
      this.$isMasker && ctx.clip();
    },
    close: function () {
      this.$closePath = true;
    }
  });

  EC.extend(Shape.prototype, {
    drawRect: function (x, y, width, height) {
      this.offsetX = x;
      this.offsetY = y;
      this.width = width;
      this.height = height;
      this.drawType = 'rect';
      return this;
    },
    drawArc: function (x, y, radius, startAngle, endAngle, counterclockwise) {
      this.offsetX = x;
      this.offsetY = y;
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
      this.offsetX = x;
      this.offsetY = y;
      this.width = width;
      this.height = height;
      this.radius = radius;
      this.drawType = 'roundRect';
      return this;
    },
    moveTo: function (x, y) {
      this.offsetX = x;
      this.offsetY = y;
      return this;
    },
    lineTo: function (x, y) {
      if (Array.isArray(x)) {
        [].push.apply(this.coords, x);
      } else {
        this.coords.push([x, y]);
      }
      var lineSize = getLineSize(this.coords, this.offsetX, this.offsetY);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'lineTo';
      return this;
    },
    drawLine: function (x, y, endX, endY) {
      this.offsetX = x;
      this.offsetY = y;
      this.endX = endX;
      this.endY = endY;
      this.width = endX - x;
      this.height = this.lineWidth;
      this.drawType = 'line';
      return this;
    },
    drawDashedLine: function (x, y, endX, endY, dashLength, dashGap) {
      this.offsetX = x;
      this.offsetY = y;
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
      this.offsetX = x;
      this.offsetY = y;
      this.width = width;
      this.height = height;
      this.drawType = 'ellipse';
      return this;
    },
    drawCurve: function (coords) {
      this.coords = coords || [];
      var lineSize = getBezierCurveLineSize(this.coords);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'curve';
      return this;
    },
    quadraticCurveTo: function () {
      this.coords = slice.call(arguments);
      var lineSize = getQuadraticLineSize(this.coords, this.offsetX, this.offsetY);
      this.width = lineSize.width;
      this.height = lineSize.height;
      this.drawType = 'quadraticCurveTo';
      return this;
    },
    bezierCurveTo: function () {
      this.coords = slice.call(arguments);
      var lineSize = getQuadraticLineSize(this.coords, this.offsetX, this.offsetY);
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
    },
    curve: function (points) {
      var i = 0, len = points.length, ctrlP;
      for (; i < len; i++) {
        if (i === 0) {
          this.moveTo(points[0][0], points[0][1]);
        } else {
          ctrlP = EC.Util.getCtrlPoint(points, i - 1);
          this.bezierCurveTo(ctrlP.a.x, ctrlP.a.y, ctrlP.b.x, ctrlP.b.y, points[i][0], points[i][1]);
        }
      }
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
   * Sprite 雪碧图类
   * **/
  var Sprite = DisplayObjectContainer.extend({
    initialize: function (x, y, w, h) {
      Sprite.superclass.initialize.call(this);

      this.$x = x || 0;
      this.$y = y || 0;
      this.$width = w || 0;
      this.$height = h || 0;

      this.$texture = null;
      this.$cacheRenderer = null;
      this.$cacheAsBitmap = false;
      this.$throttle = null;

      this.defineProperty('texture', {
        set: function (texture) {
          this.$texture = texture;
          this.updateRender();
        },
        get: function () {
          return this.$texture;
        }
      });

      this.defineProperty('cacheAsBitmap', {
        set: function (cacheFlag) {
          this.$cacheAsBitmap = cacheFlag;
          if (cacheFlag && this.$hasAddToStage) {
            this.$texture = document.createElement('canvas');
            this.$cacheRenderer = new Stage(this.$texture, {
              width: Math.max(this.width, this.stage.width),
              height: Math.max(this.height, this.stage.height),
              scaleMode: 'noScale',
              autoRender: false,
              needEvents: false
            });
          } else {
            this.$texture = null;
            this.$cacheRenderer = null;
          }
        },
        get: function () {
          return this.$cacheAsBitmap;
        },
        enumerable: true
      });

      this.once('addToStage', function () {
        if (this.$cacheAsBitmap) {
          var enterFrame = function (obj, time) {
            if (obj.$mask && obj.$renderType === 'Sprite') {
              obj.$mask.dispatch('enterframe', time);
            }
            obj.children.forEach(function (item) {
              item.dispatch('enterframe', time);
              if (!item.$cacheAsBitmap) {
                enterFrame(item, time);
              }
            });
          };
          this.cacheAsBitmap = this.$cacheAsBitmap;
          this.updateRender(true);
          this.on('enterframe', function(time) {
            enterFrame(this, time);
          }, this);
        }
      }, this);
    },
    addChild: function () {
      Sprite.superclass.addChild.apply(this, arguments);
      this.resize();
      if (this.cacheAsBitmap) {
        this.updateRender(true);
      }

      return this;
    },
    removeChild: function () {
      Sprite.superclass.removeChild.apply(this, arguments);
      this.resize();
      if (this.cacheAsBitmap) {
        this.updateRender(true);
      }

      return this;
    },
    removeChildAt: function () {
      Sprite.superclass.removeChildAt.apply(this, arguments);
      this.resize();
      if (this.cacheAsBitmap) {
        this.updateRender(true);
      }

      return this;
    },
    removeAllChildren: function () {
      Sprite.superclass.removeAllChildren.apply(this, arguments);
      this.resize();
      if (this.cacheAsBitmap) {
        this.updateRender(true);
      }

      return this;
    },
    setChildIndex: function () {
      Sprite.superclass.setChildIndex.apply(this, arguments);
      if (this.cacheAsBitmap) {
        this.updateRender(true);
      }

      return this;
    },
    resize: function () {
      var widths = [];
      var heights = [];
      var size;

      this.each(function (obj) {
        size = obj.getSize();
        widths.push(size.width);
        heights.push(size.height);
      }, this);

      if (!this.$hasDefineWidth) {
        this.$width = getMax(widths);
      }
      if (!this.$hasDefineHeight) {
        this.$height = getMax(heights);
      }

      return this;
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
      this.placeholderColor = "#777";
      this.placeholder = "";
      this.fontFamily = "";
      this.lineSpacing = 2;
      this.inputType = "text";
      this.$cacheAsBitmap = true;

      this.once("addToStage", function () {
        this.$create();
        this.$events();
      }, this);

      this.once("remove", function () {
        this.inputText.parentNode.removeChild(this.inputText);
        window.removeEventListener(EC.EVENTS.RESIZE, this.resizeListener, false);
      }, this);
    },
    $create: function () {
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
      this.textField.multiline = true;
      this.textField.lineSpacing = this.inputType !== "textarea" ? this.height : this.lineSpacing;
      this.textField.size = this.fontSize;
      this.textField.fontFamily = this.fontFamily || this.textField.fontFamily;
      this.textField.x = this.borderWidth + this.padding[3];
      this.textField.y = this.inputType === "textarea" ? this.padding[0] : (this.height - this.textField.height) / 2;

      this.mask = new Rectangle(0, 0, this.width + this.borderWidth, this.height + this.borderWidth);

      this.addChild(this.input);
      this.addChild(this.textField);

      this.$setInputStyle();

      if (!textInputDiv) {
        textInputDiv = document.createElement("div");
        textInputDiv.id = 'StageTextInputDiv';
        textInputDiv.style.cssText = 'position:absolute;margin:0;padding:0;border:none;';
        document.body.appendChild(textInputDiv);
      }

      textInputDiv.appendChild(this.inputText);
    },
    $setInputStyle: function () {
      var self = this;
      var ratio = 1 / this.stage.scaleRatio;
      var marginTop = this.inputType === "textarea" ? -this.lineSpacing / 2 : 0;
      var totalOffset = getTotalOffset(this);
      this.inputText.style.cssText = "display:none;position:absolute;border:none;background:none;outline:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;appearance:none;-webkit-text-size-adjust:none;text-size-adjust:none;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:auto;resize:none;" +
        "left:" + (totalOffset.x + self.borderWidth / 2) * ratio + "px;top:" + totalOffset.y * ratio + "px;width:" + this.width * ratio + "px;height:" + this.height * ratio + "px;line-height:" + (this.fontSize + this.lineSpacing) * ratio + "px;font-size:" + this.fontSize * ratio + "px;font-family:" + (this.fontFamily || this.textField.fontFamily) + ";color:" + this.color + ";margin-top:" + marginTop + "px;padding:" +
        this.padding.map(function (pad) {
          return (pad + self.borderWidth / 2) * ratio + "px"
        }).join(" ");
    },
    $events: function () {
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
        this.$setInputStyle();
      }.bind(this), false);
    }
  });

  /**
   * BitmapText
   * */

  var BitmapText = Sprite.extend({
    initialize: function () {
      BitmapText.superclass.initialize.apply(this, arguments);
      this.$text = "";
      this.$font = "";
      this.$textAlign = 'left';
      this.$letterSpacing = 0;
      this.$cacheAsBitmap = true;

      this.$textRenderer = new Sprite();
      this.$textRenderer.$renderType = 'BitmapText';

      this.$textRenderer.$textwrap = new Sprite();

      ['text', 'textAlign', 'letterSpacing'].forEach(function (prop) {
        this.defineProperty(prop, {
          set: function (newVal) {
            this.$textRenderer['$' + prop] = newVal;
            if (prop === 'text') {
              this.$textRenderer.$textArr = newVal.split("");
            }
            this.updateRender(true);
          },
          get: function () {
            return this.$textRenderer['$' + prop];
          },
          enumerable: true
        });
      }.bind(this));

      this.defineProperty('font', {
        set: function (newVal) {
          this.$font = newVal;
          this.$createData();
        },
        get: function () {
          return this.$font;
        }
      });

      this.once("addToStage", function () {
        this.$textRenderer.addChild(this.$textRenderer.$textwrap);
        this.addChild(this.$textRenderer);
      }, this);
    },
    $createData: function () {
      this.$textRenderer.$fontData = (EC.isString(this.$font) ? RES.getRes(this.$font + "_fnt") : this.$font).data;
      this.$textRenderer.$fontTexture = RES.getRes(this.$textRenderer.$fontData.file.replace(/\.(\w+)$/, "_$1")).texture;
    }
  });

  /**
   * Button
   * */

  var Button = Sprite.extend({
    initialize: function (statusArgs) {
      Button.superclass.initialize.call(this);
      this.$cacheAsBitmap = true;

      var _DEFAULTS = {
        x: 0,
        y: 0,
        size: 16,
        textColor: "#000",
        alpha: 1
      };

      var NORMAL = EC.extend({}, _DEFAULTS, this.$getConfig(statusArgs.normal) || {});
      var HOVER = EC.extend({}, _DEFAULTS, this.$getConfig(statusArgs.hover) || {});
      var ACTIVE = EC.extend({}, _DEFAULTS, this.$getConfig(statusArgs.active) || {});
      var DISABLED = EC.extend({}, _DEFAULTS, this.$getConfig(statusArgs.disabled) || {});

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

      this.bitmap = new Bitmap();
      this.shape = new Shape();
      this.textField = new TextField();

      this.once("addToStage", function () {
        this.$create();
        this.$events();
      }, this);
    },
    $create: function () {
      this.setButton("normal");
      this.addChild(this.bitmap);
      this.addChild(this.shape);
      this.addChild(this.textField);
    },
    $getConfig: function (status) {
      return EC.isString(status) ? RES.getRes(status) : status;
    },
    setButton: function (status) {
      this.touchEnabled = status === 'disabled' ? false : true;

      var _config = EC.isString(status) ? this.statusCfg[status] : status;
      _config = EC.extend({}, this.statusCfg.normal, _config);

      var offsetX = _config.offsetX || 0;
      var offsetY = _config.offsetY || 0;

      EC.extend(this, {width: _config.width, height: _config.height});

      if (_config.texture) {
        EC.extend(this.bitmap, {
          x: _config.x,
          y: _config.y,
          alpha: _config.alpha,
          texture: _config.texture,
          width: _config.width,
          height: _config.height
        });
        this.bitmap.visible = true;
      } else {
        this.bitmap.visible = false;
      }

      if (_config.fillStyle || _config.strokeStyle) {
        EC.extend(this.shape, _config);
        if (_config.radius && _config.radius > 0) {
          this.shape.drawRoundRect(offsetX, offsetY, _config.width, _config.height, _config.radius);
        } else {
          this.shape.drawRect(offsetX, offsetY, _config.width, _config.height);
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
          x: offsetX,
          y: _config.y + offsetY + (this.height - this.textField.height) / 2,
          height: this.textField.height
        };
        EC.extend(this.textField, EC.extend({}, _config, injectCfg));
        this.textField.visible = true;
      } else {
        this.textField.visible = false;
      }

      return _config;
    },
    $events: function () {
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
    toString: function () {
      return "[object EC.Point(" + this.x + "," + this.y + ")]";
    },
    set: function (x, y) {
      this.x = x;
      this.y = y;

      return this;
    },
    clone: function () {
      return new Point(this.x, this.y);
    },
    add: function (e) {
      return new Point(this.x + e.x, this.y + e.y);
    },
    distance: function () {
      return Point.calcDistance(this.x, this.y, 0, 0);
    },
    copyFrom: function (t) {
      this.set(t.x, t.y);

      return this;
    },
    equals: function (t) {
      return this.x === t.x && this.y === t.y;
    },
    offset: function (t, e) {
      this.x += t;
      this.y += e;

      return this;
    },
    subtract: function (e) {
      return new Point(this.x - e.x, this.y - e.y);
    },
    getAngle: function () {
      return Point.getAngle(0, 0, this.x, this.y);
    }
  });

  EC.extend(Point, {
    calcDistance: function (x1, y1, x2, y2) {
      var n = Math.abs(x2 - x1),
        s = Math.abs(y2 - y1);
      return Math.sqrt(n * n + s * s);
    },
    distance: function (e, o) {
      return this.calcDistance(e.x, e.y, o.x, o.y);
    },
    fromValues: function (x, y) {
      var out = new Array(2);
      out[0] = x;
      out[1] = y;
      return out;
    },
    getAngle: function (px, py, mx, my) {
      var x = Math.abs(px - mx);
      var y = Math.abs(py - my);
      var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      var cos = y / z;
      var radina = Math.acos(cos);//用反三角函数求弧度
      var angle = 180 / (Math.PI / radina);//将弧度转换成角度

      //目标点在第四象限
      if (mx > px && my > py) {
        angle = 180 - angle;
      }

      //目标点在y轴负方向上
      if (mx === px && my > py) {
        angle = 180;
      }

      //目标点在x轴正方向上
      if (mx > px && my === py) {
        angle = 90;
      }

      //目标点在第三象限
      if (mx < px && my > py) {
        angle = 180 + angle;
      }

      //目标点在x轴负方向
      if (mx < px && my === py) {
        angle = 270;
      }

      //目标点在第二象限
      if (mx < px && my < py) {
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
        autoRender: true,
        autoPauseRender: true,
        needEvents: true,
        onPause: EC.noop,
        onResume: EC.noop
      }, options || {});

      this.$width = parseFloat(this.canvas.getAttribute("width")) || opts.width;
      this.$height = parseFloat(this.canvas.getAttribute("height")) || opts.height;
      this.clearX = 0;
      this.clearY = 0;
      this.clearWidth = this.$width;
      this.clearHeight = this.$height;
      this.scaleRatio = 1;
      this.cursor = "";
      this.$isRendering = false;
      this.$ticker = new EC.Ticker({
        useInterval: opts.forceUpdate,
        frameRate: opts.frameRate
      });

      this.canvas.width = this.$width;
      this.canvas.height = this.$height;

      this.defineProperty('blendMode', {
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

      this.$initEvents();

      if (opts.autoRender) {
        this.startRender();
      }
    },
    addChild: function (childObj) {
      Stage.superclass.addChild.apply(this, arguments);
      this.$triggerAddToStage(childObj, this);

      return this;
    },
    render: function (time) {
      var self = this;
      var ctx = this.renderContext;

      var _render = function (obj) {
        if (obj.visible) {
          obj.dispatch('enterframe', time);
          if (obj.$renderType === 'Sprite' && !obj.cacheAsBitmap) {
            ctx.save();
            drawContext(ctx, obj);
            getChildren(obj).forEach(function (item) {
              _render(item);
            });
            ctx.restore();
          } else {
            self.renderItem(ctx, obj);
          }
        }
      };

      _render(this);

      return this;
    },
    renderCache: function (container) {
      var self = this;
      var ctx = this.renderContext;

      var _render = function (obj) {
        if (obj.visible) {
          if (obj.$renderType === 'Sprite' && !obj.cacheAsBitmap) {
            ctx.save();
            drawContext(ctx, obj);
            getChildren(obj).forEach(function (item) {
              _render(item);
            });
            ctx.restore();
          } else {
            self.renderItem(ctx, obj);
          }
        }
      };

      var renderSprite = function (obj) {
        obj.$mask && ctx.save();
        getChildren(obj).forEach(function (item) {
          _render(item);
        });
        obj.$mask && ctx.restore();
      };

      renderSprite(container);

      return this;
    },
    renderItem: function (ctx, obj) {
      obj.$isMasker || ctx.save();
      drawContext(ctx, obj);
      switch (obj.$renderType) {
        case 'Sprite':
          drawImg(ctx, obj);
          break;
        case 'Bitmap':
          drawImg(ctx, obj);
          break;
        case 'BitmapText':
          drawBitmapText(ctx, obj);
          break;
        case 'TextField':
          drawText(ctx, obj);
          break;
        case 'Shape':
          drawShape(ctx, obj);
          break;
      }
      obj.$isMasker || ctx.restore();
    },
    clear: function () {
      this.renderContext.clearRect(this.clearX, this.clearY, this.clearWidth, this.clearHeight);
      return this;
    },
    startRender: function () {
      if (this.$isRendering) return;
      this.$isRendering = true;
      this.$ticker.start();
      this.options.onResume();

      return this;
    },
    stopRender: function () {
      this.$ticker.stop();
      this.$isRendering = false;
      this.options.onPause();
      return this;
    },
    setAdapter: function () {
      var parent = this.canvas.parentNode;
      var parentW = parent.nodeName === 'BODY' ? window.innerWidth : parent.offsetWidth - parseFloat(EC.getStyle(parent, 'padding-left')) - parseFloat(EC.getStyle(parent, 'padding-right'));
      var parentH = parent.nodeName === 'BODY' ? window.innerHeight : parent.offsetHeight - parseFloat(EC.getStyle(parent, 'padding-top')) - parseFloat(EC.getStyle(parent, 'padding-bottom'));
      var width = parentW;
      var height = this.height / this.width * width;
      var marginTop = 0;

      switch (this.options.scaleMode) {
        case 'showAll':
          if (height > parentH) {
            height = parentH;
            width = this.width / this.height * height;
          }
          break;
        case 'noBorder':
          marginTop = (parentH - height) / 2;
          break;
        case 'fixedWidth':
          break;
      }

      this.canvas.style.width = width + "px";
      this.canvas.style.height = height + "px";
      this.canvas.style.marginTop = marginTop + "px";
      this.scaleRatio = this.width / width;

      return this;
    },
    $initEvents: function () {

      var self = this;
      var opts = this.options;
      var isShowFPS = opts.showFps;
      var timeId = null;

      this.$ticker.on("ticker", function (time) {
        isShowFPS && this.FPS.begin();
        this.clear();
        this.render(time);
        EC.groupManager.update(time);
        isShowFPS && this.FPS.end();
      }, this);

      if (opts.scaleMode !== 'noScale') {
        window.addEventListener(EC.EVENTS.RESIZE, function () {
          if (timeId) clearTimeout(timeId);
          timeId = setTimeout(self.setAdapter.bind(self), 100);
        }, false);
      }

      if (opts.autoPauseRender && opts.autoRender) {
        document.addEventListener(EC.EVENTS.VISIBILITYCHANGE, function () {
          if (document[EC.EVENTS.HIDDEN]) {
            self.stopRender();
          } else {
            self.startRender();
          }
        }, false);

        window.addEventListener("focus", function () {
          self.startRender();
        }, false);

        window.addEventListener("blur", function () {
          self.stopRender();
        }, false);
      }

      if (opts.needEvents) {
        new EC.TouchEvent().attach(this);
      }

    },
    createFps: function () {
      this.FPS = new Stats();
    },
    showFps: function (position) {
      if (!this.options.showFps) return;
      if (EC.isObject(position)) {
        this.FPS.dom.style.left = EC.isDefined(position.left) ? (EC.isNumber(position.left) ? position.left + "px" : position.left) : "";
        this.FPS.dom.style.right = EC.isDefined(position.right) ? (EC.isNumber(position.right) ? position.right + "px" : position.right) : "";
        this.FPS.dom.style.top = EC.isDefined(position.top) ? (EC.isNumber(position.top) ? position.top + "px" : position.top) : "";
        this.FPS.dom.style.bottom = EC.isDefined(position.bottom) ? (EC.isNumber(position.bottom) ? position.bottom + "px" : position.bottom) : "";
      }

      if (!this.$fpsDom) {
        document.body.appendChild(this.$fpsDom = this.FPS.dom);
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
    Bitmap: Bitmap,
    BitmapText: BitmapText,
    Shape: Shape,
    Rectangle: Rectangle,
    TextInput: TextInput,
    DisplayObject: DisplayObject,
    DisplayObjectContainer: DisplayObjectContainer,
    Sprite: Sprite,
    Button: Button,
    Point: Point,
    Stage: Stage,
    isPointInPath: isPointInPath
  });

})(window.EC);