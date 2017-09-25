/**
 * Created by semdy on 2016/9/6.
 */
(function(EC){
    "use strict";

    var slice = Array.prototype.slice;

    var Event = function() {
        this.initialize.apply(this, arguments);
    };

    EC.extend(Event.prototype, {

        initialize: function(){
            this._eventPool = {};
            return this;
        },

        on: function(name, callback, ctx){
            var e = this._eventPool;

            (e[name] || (e[name] = [])).push({
                fn: callback,
                ctx: ctx || this
            });

            return this;
        },

        once: function(name, callback, ctx){
            var self = this;

            function listener () {
                self.off(name, listener);
                callback.apply(this, arguments);
            }

            listener._ = callback;

            return this.on(name, listener, ctx);
        },

        off: function(name, callback){
            var e = this._eventPool;
            var evts = e[name];
            var liveEvents = [];

            if (evts && callback) {
              liveEvents = evts.filter(function(evt){
                  return evt.fn !== callback && evt.fn._ !== callback;
                });
            }

            (liveEvents.length)
                ? e[name] = liveEvents
                : delete e[name];

          return this;
        },

        dispatch: function( name ){
            var args = slice.call(arguments, 1);
            var evts = (this._eventPool[name] || []).slice();

            if( evts.length ) {
              evts.forEach(function (evt) {
                evt.fn.apply(evt.ctx, args);
              });
            }

            return this;
        },

        success: function(cb){
            return this.on('success', cb);
        },

        complete: function(cb){
            return this.on('complete', cb);
        },

        error: function(cb){
            return this.on('error', cb);
        },

        progress: function(cb){
            return this.on('progress', cb);
        },

        clear: function(){
            this._eventPool = {};
            return this;
        }
    });

    Event.extend = EC.classExtend;

    EC.provide({
        Event: Event
    });

})(window.EC);