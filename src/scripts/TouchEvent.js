/**
 * Created by semdy on 2016/9/6.
 */

(function(EC){
    "use strict";

    var doc = document,
        dob = doc.body,
        doe = doc.documentElement;

    var EVENTS = EC.EVENTS,
        isTouch = EC.isTouch;

    var TouchEvent = function(){
        this.enableStack = [];
        this._touchX = 0;
        this._touchY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._bound = null;
        this._lastStack = [];
        this._lastObject  = null;
        this._touchTimer = null;
    };

    TouchEvent.prototype = {
        attach: function(stage){
            this.stage = stage;
            this.element = stage.canvas;
            this._startTime = 0;
            this._bindEvents();
        },
        _bindEvents: function(){
            this.element.addEventListener(EVENTS.START, this._onTouchStart.bind(this), false);
            this.element.addEventListener(EVENTS.MOVE, this._onTouchMove.bind(this), false);
            this.element.addEventListener(EVENTS.END, this._onTouchEnd.bind(this), false);
            this.element.addEventListener("mouseout", this._onMouseOut.bind(this), false);
        },
        _onTouchStart: function(event){
            //event.preventDefault();
            event = isTouch ? event.targetTouches[0] : event;

            this._startTime = Date.now();
            this._offsetX = window.pageXOffset || doe.scrollLeft || dob.scrollLeft || 0;
            this._offsetY = window.pageYOffset || doe.scrollTop || dob.scrollTop || 0;
            this._bound = this.element.getBoundingClientRect();

            this._clearTouchTimer();
            this._setTouchXY(event);
            this.enableStack = this._getTouchEnables();

            this._triggerEvent("touchstart", event);

            this._touchTimer = setTimeout(function(){
                this._triggerEvent("longtouch", event);
            }.bind(this), 600);
        },
        _onTouchMove: function(event){
            event.preventDefault();
            event = isTouch ? event.changedTouches[0] : event;

            this._clearTouchTimer();

            if( !EC.isTouch ) {
                this._offsetX = this._offsetX || window.pageXOffset || doe.scrollLeft || dob.scrollLeft || 0;
                this._offsetY = this._offsetY || window.pageYOffset || doe.scrollTop || dob.scrollTop || 0;
                this._bound = this._bound || this.element.getBoundingClientRect();
                this.enableStack = this._getTouchEnables();
            }

            this._setTouchXY(event);
            this._triggerEvent("touchmove", event);
        },
        _onTouchEnd: function(event){
            event = isTouch ? event.changedTouches[0] : event;

            this._clearTouchTimer();
            this._setTouchXY(event);
            this._triggerEvent("touchend", event);

            var diffTime = Date.now() - this._startTime;

            if( diffTime < 200 ){
                this._triggerEvent("touch", event);
            }

            this._resetTouch();
        },
        _onMouseOut: function () {
            this._clearTouchTimer();
            this._resetTouch();
            this._triggerLastStack();
        },
        _clearTouchTimer: function(){
            if( this._touchTimer ) {
                clearTimeout(this._touchTimer);
            }
        },
        _resetTouch: function () {
            this._offsetX = 0;
            this._offsetY = 0;
            this._bound = null;
            this._lastStack = [];
            this._lastObject = null;
        },
        _triggerEvent: function(type, event){
            var self = this;
            var ratio = this.stage.scaleRatio;
            var isMouseMove = !EC.isTouch && type === "touchmove";
            var enableStack = this.enableStack.filter(function(obj){
                return EC.isPointInPath({x: self._touchX * ratio, y: self._touchY * ratio}, obj);
            });

            if( enableStack.length ) {
                var eventObj = EC.extend({
                    type: type,
                    stageX: this._touchX * ratio,
                    stageY: this._touchY * ratio
                }, this._getOriginalEventProps(event));

                event = new Event(event, eventObj);

                var parent, obj;
                for(var i = 0; i < enableStack.length; i++) {
                    obj = enableStack[i];

                    if( event.isPropagationStopped() ) break;

                    if( !parent || obj === parent ) {
                        if( obj.$type === "Sprite" || obj.$type === "Stage" ){
                            obj.dispatch(type, EC.extend(event, {target: this._getTouchedTarget(obj) || obj}));
                        } else {
                            obj.dispatch(type, EC.extend(event, {target: obj}));
                        }
                        parent = obj.parent;
                    }

                    if( isMouseMove && this._lastObject !== obj ) {
                        this.stage.canvas.style.cursor = obj.cursor;
                        obj.dispatch("touchenter", EC.extend(event, {type: "touchenter", target: obj}));
                    }

                    this._lastObject = obj;
                }

                this._lastStack = enableStack;

            } else {

                this._lastObject = null;
                if( isMouseMove ) {
                    this._triggerLastStack();
                }
            }
        },
        _triggerLastStack: function () {
            if( this._lastStack.length ) {
                this._lastStack.forEach(function (obj) {
                    obj.dispatch("touchout", {type: "touchout", target: obj});
                });
            } else {
                this.stage.canvas.style.cursor = "";
            }

            this._lastStack = [];
        },
        _getTouchedTarget: function( target ){
            var elStack = [];
            var self = this;
            var ratio = this.stage.scaleRatio;

            function getItems( obj ) {
                var childs = obj.getChilds();
                var i = childs.length;
                while (i--) {
                    if( !childs[i].visible ) continue;
                    if( childs[i].$type === "Sprite" ){
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
        _getTouchEnables: function(){
            var enableStack = [];

            function getItems( obj ) {
                var childs = obj.getChilds();
                var i = childs.length;
                while (i--) {
                    if( !childs[i].visible ) continue;
                    if( childs[i].$type === "Sprite" ){
                        getItems(childs[i]);
                    }
                    if (childs[i].touchEnabled) {
                        enableStack.push(childs[i]);
                    }
                }
            }

            getItems(this.stage);

            if( this.stage.touchEnabled ){
                enableStack.push(this.stage);
            }

            return enableStack;
        },
        _getOriginalEventProps: function(event){
            var props = {};
            ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY", "radiusX", "radiusY", "rotationAngle"].forEach(function(prop){
                props[prop] = event[prop];
            });

            return props;
        },
        _setTouchXY: function(event){
            this._touchX = event.pageX - this._bound.left - this._offsetX;
            this._touchY = event.pageY - this._bound.top - this._offsetY;
        }
    };

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    var Event = function( src, props ) {

        if ( src && src.type ) {
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

        if ( props ) {
            EC.extend( this, props );
        }

        this.timeStamp = src && src.timeStamp || Date.now();

    };

    Event.prototype = {
        constructor: Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if ( e ) {
                e.preventDefault();
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if ( e ) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if ( e ) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    };

    EC.provide({
        TouchEvent: TouchEvent
    });

})(window.EC);