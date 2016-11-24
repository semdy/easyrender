var EC={version:"1.0.3"};!function(t){"use strict";var e=Array.prototype.slice,i=Object.prototype.toString,n=Object.prototype.hasOwnProperty,s=Array.prototype,r=Object.prototype,a=Function.prototype;Date.now||(Date.now=function(){return+new Date}),Object.create=function(){function t(){}return function(e){if("object"!=typeof e)throw TypeError("Object prototype may only be an Object or null");t.prototype=e;var i=new t;if(t.prototype=null,arguments.length>1){var s=Object(arguments[1]);for(var r in s)n.call(s,r)&&(i[r]=s[r])}return i}}(),a.bind||(a.bind=function(){var t=this,e=[].shift.call(arguments),i=[].slice.call(arguments);return function(){return t.apply(e,[].concat.call(i,[].slice.call(arguments)))}}),s.find||(s.find=function(t){for(var e=0,i=this.length;e<i;e++)if(t&&t(this[e],e,this)===!0)return this[e]}),Array.isArray||(Array.isArray=function(t){return"[object Array]"===r.toString.call(t)}),s.contains=s.includes||function(t){return this.indexOf(t)>-1};var o="ontouchstart"in document,h=navigator.userAgent,c=window.navigator.msPointerEnabled,u=c&&/IEMobile/i.test(h);o=o||u;var l=u?{START:"MSPointerDown",MOVE:"MSPointerMove",END:"MSPointerCancel"}:{START:o?"touchstart":"mousedown",MOVE:o?"touchmove":"mousemove",END:o?"touchend":"mouseup"},p=t.extend=function(t){for(var i,n,s=e.call(arguments,1),r=0;r<s.length;r++)for(n in i=s[r])i.hasOwnProperty(n)&&(t[n]=i[n]);return t};t.provide=function(e){"object"==typeof e&&p(t,e)},t.provide({isDefined:function(t){return"undefined"!=typeof t},isNumber:function(t){return"number"==typeof t},isString:function(t){return"string"==typeof t},isFunction:function(t){return"function"==typeof t},isObject:function(t){return"object"==typeof t},isArray:Array.isArray||function(t){return"[object Array]"===i.call(t)},upperKey:function(t){return t.replace(/\-(\w)/g,function(t,e){return e.toUpperCase()})},getStyle:function(e,i){return window.getComputedStyle(e,null)[t.upperKey(i)]}});var f=function(t,e){var i,s=this;return i=t&&n.call(t,"constructor")?t.constructor:function(){return s.apply(this,arguments)},p(i,s,e),i.prototype=Object.create(s.prototype,t),i.prototype.constructor=i,i.superclass=s.prototype,i};t.provide({classExtend:f,ua:h,isTouch:o,EVENTS:l})}(EC),function(t){"use strict";var e=/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,i={};i.toHex=function(t){if(/^(rgb|RGB)/.test(t)){for(var i=t.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(","),n="#",s=0;s<i.length;s++){var r=Number(i[s]).toString(16);"0"===r&&(r+=r),n+=r}return 7!==n.length&&(n=t),n}if(!e.test(t))return t;var a=t.replace(/#/,"").split("");if(6===a.length)return t;if(3===a.length){for(var o="#",s=0;s<a.length;s+=1)o+=a[s]+a[s];return o}},i.toRgb=function(t,i){var n=t.toLowerCase();if(n&&e.test(n)){var s="rgb";if(4===n.length){for(var r="#",a=1;a<4;a+=1)r+=n.slice(a,a+1).concat(n.slice(a,a+1));n=r}for(var o=[],a=1;a<7;a+=2)o.push(parseInt("0x"+n.slice(a,a+2)));return"number"==typeof i&&(o.push(i),s="rgba"),s+"("+o.join(",")+")"}return n};var n=function(t,e){return t.x>e.x&&t.x<e.x+e.width&&t.y>e.y&&t.y<e.y+e.height};t.util=t.util||{},t.extend(t.util,{color:i,isPointInPath:n})}(window.EC),function(t){"use strict";var e=Array.prototype.slice,i=function(){this.initialize.apply(this,arguments)};t.extend(i.prototype,{initialize:function(){this._eventPool={}},on:function(t,e,i){var n=this._eventPool;return(n[t]||(n[t]=[])).push({fn:e,ctx:i||this}),this},once:function(t,e,i){function n(){s.off(t,n),e.apply(this,arguments)}var s=this;return n._=e,this.on(t,n,i)},off:function(t,e){var i=this._eventPool,n=i[t],s=[];return n&&e&&(s=n.filter(function(t){return t.fn!==e&&t.fn._!==e})),s.length?i[t]=s:delete i[t],this},dispatch:function(t){var i=e.call(arguments,1),n=this._eventPool[t]||[];return n.length&&n.forEach(function(t){t.fn.apply(t.ctx,i)}),this},emit:function(){return this.dispatch.apply(this,arguments)},success:function(t){return this.on("success",t)},complete:function(t){return this.on("complete",t)},error:function(t){return this.on("error",t)},progress:function(t){return this.on("progress",t)},clear:function(){return this._eventPool={},this}}),i.extend=t.classExtend,t.provide({Event:i})}(window.EC),function(t){"use strict";var e=/^https?:\/\//,i={},n=function(i,n,s){var r=new Image;r.addEventListener("load",function t(){n&&n(r),this.removeEventListener("load",t,!1)},!1),r.addEventListener("error",function t(){s&&s(),console.error("fail load:"+i),this.removeEventListener("error",t,!1)},!1),i=e.test(i)?i:t.baseUrl+i,r.src=i},s=EC.Event.extend({initialize:function(t){var e=this;s.superclass.initialize.call(this),n(t,function(t){e.dispatch("success",t)},function(t){e.dispatch("error",t)})}}),r=function(t,e){n(t.url,function(n){i[t.name]={width:n.width,height:n.height,bitMapData:n},EC.extend(i[t.name],t),EC.isFunction(e)&&e(t)})},a=function(i,n,s){var r=function(){if(window.XMLHttpRequest)return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHttp")}catch(t){return null}}();if(r)return i=e.test(i)?i:t.baseUrl+i,r.open("GET",i,!0),r.onreadystatechange=function(){if(r.onreadystatechange=new Function,4==r.readyState)if(200==r.status)try{n&&n(JSON.parse(r.responseText))}catch(t){}else s&&s(r),console.error("fail load:"+i)},r.send(null),r},o=EC.Event.extend({initialize:function(t){var e=this;o.superclass.initialize.call(this),a(t,function(t){e.dispatch("success",t)},function(t){e.dispatch("error",t)})}}),h=function(t,e){"object"==typeof t&&("image"==t.type?r(t,function(){e&&e(t)}):"json"==t.type||"sheet"==t.type?a(t.url,function(n){var s=EC.extend({},t,{data:n});if(i[t.name]=s,"sheet"==t.type){var a=t.url.replace(/\.json$/,".png"),o=t.name.replace(/_json$/,"_png"),h=EC.extend({},t,{url:a,name:o,type:"image"});r(h,function(){e&&e(s)})}else e&&e(s)}):(i[t.name]=t,e&&e(t)))},c=function(){return i},u=function(t,e){var n=/\[(\d+\-\d+)\]/,s=n.exec(t);if(s){for(var r=[],a=RegExp.$1.split("-"),o=t.replace(n,"").split("_"),h=Number(a[0]);h<Number(a[1])+1;h++){var c=o[0]+h+"_"+o[1];r.push(i[c])}return r}var u=i[t];return void 0===u?console.error(t+" does not exist!"):"json"==u.type||"sheet"==u.type?e?u.data.frames[e]:u.data:u},l=function(t,e){if("string"!=typeof t)return t;if(!/^(#|\.)/.test(t))return null;var i=t.charAt(0);if(e=e||document,"#"==i)return document.getElementById(t.substr(1,t.length));if(document.querySelectorAll)return e.querySelectorAll(t);try{return e.getElementsByClassName(t)}catch(i){var n=[],s=e.getElementsByTagName("*");return s.forEach(function(e){(" "+e.className+" ").indexOf(" "+t+" ")>-1&&n.push(e)}),n}},p=function(t,e){var i=e.groups.find(function(e){return e.name==t});if(void 0===i)return console.error('group "'+t+'" dose not exsit!');var n=i.keys.split(",").map(function(t){return t.trim()});return n},f=function(t,e){var i=[];return t.forEach(function(t){e.indexOf(t.name)>-1&&i.push(t)}),i},d=EC.Event.extend({initialize:function(t,e){var i=p(t,e);if(void 0!==i){var n=f(e.resources,i),s=this,r=0,a=n.length;d.superclass.initialize.call(this),n.forEach(function(t){h(t,function(){s.dispatch("progress",++r,a,t),r>a-1&&s.dispatch("complete")})})}}});EC.extend(t,{loadImage:function(t){return new s(t)},loadJson:function(t){return new o(t)},loadGroup:function(t,e){return new d(t,e)},getAsset:c,getRes:u,el:l,baseUrl:"images/"})}(window.RES||(window.RES={}));var requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){return setTimeout(t,1e3/60)},cancelAnimationFrame=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||function(t){return clearTimeout(t)};!function(t){"use strict";var e=t.Event.extend({initialize:function(){e.superclass.initialize.call(this),this.ticker=null},start:function(){var t=this;return+function e(){t.ticker=requestAnimationFrame(e),t.dispatch("ticker")}(),this},stop:function(){return this.ticker&&(cancelAnimationFrame(this.ticker),delete this.ticker),this}});t.provide({Ticker:e})}(window.EC),function(t){"use strict";var e=t.Event.extend({initialize:function(i,n){e.superclass.initialize.call(this),this._currentCount=0,this._lastTime=0,this._repeatCount=n,this._waitTime=0,this._ticker=new t.Ticker,this.delay=i,this._initEvents()},start:function(){return this._lastTime=Date.now(),this._ticker.start(),this},stop:function(){if(this._ticker)if(this._ticker.stop(),this._waitTime>0){var t=this;setTimeout(function(){t.dispatch("complete"),t.reset()},this._waitTime)}else this.dispatch("complete"),this.reset();return this},wait:function(t){return this._waitTime=t,this},pause:function(t){if(this._ticker&&(this._ticker.stop(),this.dispatch("pause")),"number"==typeof t&&t>0){var e=this;setTimeout(function(){e._ticker.start()},t)}return this},setRepeatCount:function(t){return this._repeatCount=t,this},_timerHandle:function(){var t=Date.now();if(t-this._lastTime>=this.delay){if(this._repeatCount&&++this._currentCount==this._repeatCount)return void this.stop();this._lastTime=t,this.dispatch("timer",t)}},_initEvents:function(){this._ticker.on("ticker",this._timerHandle,this)},reset:function(){return this._currentCount=0,this._ticker=null,this}});t.provide({Timer:e})}(window.EC),function(t){"use strict";var e={Linear:{None:function(t){return t}},Quadratic:{In:function(t){return t*t},Out:function(t){return t*(2-t)},InOut:function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}},Cubic:{In:function(t){return t*t*t},Out:function(t){return--t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}},Quartic:{In:function(t){return t*t*t*t},Out:function(t){return 1- --t*t*t*t},InOut:function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}},Quintic:{In:function(t){return t*t*t*t*t},Out:function(t){return--t*t*t*t*t+1},InOut:function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}},Sinusoidal:{In:function(t){return 1-Math.cos(t*Math.PI/2)},Out:function(t){return Math.sin(t*Math.PI/2)},InOut:function(t){return.5*(1-Math.cos(Math.PI*t))}},Exponential:{In:function(t){return 0===t?0:Math.pow(1024,t-1)},Out:function(t){return 1===t?1:1-Math.pow(2,-10*t)},InOut:function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(-Math.pow(2,-10*(t-1))+2)}},Circular:{In:function(t){return 1-Math.sqrt(1-t*t)},Out:function(t){return Math.sqrt(1- --t*t)},InOut:function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)}},Elastic:{In:function(t){return 0===t?0:1===t?1:-Math.pow(2,10*(t-1))*Math.sin(5*(t-1.1)*Math.PI)},Out:function(t){return 0===t?0:1===t?1:Math.pow(2,-10*t)*Math.sin(5*(t-.1)*Math.PI)+1},InOut:function(t){return 0===t?0:1===t?1:(t*=2,t<1?-.5*Math.pow(2,10*(t-1))*Math.sin(5*(t-1.1)*Math.PI):.5*Math.pow(2,-10*(t-1))*Math.sin(5*(t-1.1)*Math.PI)+1)}},Back:{In:function(t){var e=1.70158;return t*t*((e+1)*t-e)},Out:function(t){var e=1.70158;return--t*t*((e+1)*t+e)+1},InOut:function(t){var e=2.5949095;return(t*=2)<1?.5*(t*t*((e+1)*t-e)):.5*((t-=2)*t*((e+1)*t+e)+2)}},Bounce:{In:function(t){return 1-e.Bounce.Out(1-t)},Out:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},InOut:function(t){return t<.5?.5*e.Bounce.In(2*t):.5*e.Bounce.Out(2*t-1)+.5}}};t.provide({Easing:e})}(window.EC),function(t){"use strict";var e=function(e,i){this.tweenObj=e,this._updateCb=[],this._completeCb=[],this.cfg=i||{},this._repeatIndex=0,this._repeatCount=0,this.cfg.reverse&&(this._repeatCount=2),this.cfg.loop&&(t.isNumber(this.cfg.loop)?this._repeatCount=this.cfg.loop:this._repeatCount=-1)};e.cache={},e.timerCache={},e.uuid=0,e.expando="@Tween-"+ +new Date,e.get=function(t,i){return new e(t,i)},e.removeTweens=function(t){return t&&t[e.expando]&&e.timerCache[t[e.expando]]&&e.get(t).stop(),this},e.removeAllTweens=function(t){return t.getChilds().forEach(function(t){e.removeTweens(t)}),this},e.prototype={to:function(){var t=this,e=arguments;return this.queue(function(){t.anim.apply(t,e)}),this},wait:function(e){return t.isNumber(e)&&this.queue(e),this},anim:function(i,n,s){var r,a=this,o=+new Date,h=e.timerCache[a.tweenObj[e.expando]];if(this.duration=n||600,this.easing=s||t.Easing.Linear.None,this.startAttrs=t.extend({},this.tweenObj),this.endAttrs=i,h)return this;var c=function(){r=(+new Date-o)/a.duration,r=r>=1?1:r,a.percent=r,h=requestAnimationFrame(c),e.timerCache[a.tweenObj[e.expando]]=h,a.update(a.tweenObj),1==r&&(a.stop(),a.dequeue())};return c(),this},update:function(t){for(var e in this.endAttrs)this.endAttrs[e]!=this.startAttrs[e]&&(t[e]=this.startAttrs[e]+(this.endAttrs[e]-this.startAttrs[e])*this.easing(this.percent));this._triggerUpdate(this.tweenObj)},stop:function(){return cancelAnimationFrame(e.timerCache[this.tweenObj[e.expando]]),delete e.timerCache[this.tweenObj[e.expando]],this},onUpdate:function(e,i){var n=this;return this._updateCb.push(function(){t.isFunction(e)&&e.apply(i||n,arguments)}),this},call:function(e,i){var n=this;return this._completeCb.push(function(){t.isFunction(e)&&e.apply(i||n,arguments)}),this},_triggerUpdate:function(t){this._updateCb.forEach(function(e){e(t)})},_triggerComplete:function(t){this._completeCb.forEach(function(e){e(t)})},queue:function(t){this.tweenObj[e.expando]||(this.tweenObj[e.expando]=++e.uuid);var i=e.cache[e.uuid];return void 0===i&&(i=e.cache[e.uuid]=[]),t&&i.push(t),"running"!==i[0]&&this.dequeue(),this},dequeue:function(){var i,n=this,s=e.cache[this.tweenObj[e.expando]]||[],r=s.shift();return"running"===r&&(r=s.shift()),r&&(s.unshift("running"),t.isNumber(r)?i=window.setTimeout(function(){window.clearTimeout(i),i=null,n.dequeue()},r):t.isFunction(r)&&r.call(n.tweenObj,function(){n.dequeue()})),s.length||(this._repeatCount==-1||++this._repeatIndex<this._repeatCount?this.to(this.startAttrs,this.duration,this.easing):delete e.cache[this.tweenObj[e.expando]],this._triggerComplete(this.tweenObj)),this},clearQueue:function(){return delete e.cache[this.tweenObj[e.expando]],this}},t.provide({Tween:e})}(window.EC),+function(t){"use strict";function e(t,e){var i=e.anchorX+e.parent.anchorX,n=e.anchorY+e.parent.anchorY;if("sx"in e){var s=t.canvas.width,r=t.canvas.height,a=e.swidth,o=e.sheight;a>=s&&(a=s-1),o>=r&&(o=r-1),t.drawImage(e.bitMapData,e.sx,e.sy,a,o,-1*i*e.width,-1*n*e.height,e.width,e.height)}else t.drawImage(e.bitMapData,-1*i*e.width,-1*n*e.height,e.width,e.height)}function i(t,e){t.font=e.size+"px "+e.textFamily,t.textAlign=e.textAlign,t.textBaseline=e.textBaseline||"top";var i=e.anchorX+e.parent.anchorX,n=e.anchorY+e.parent.anchorY;e.stroke?(t.strokeStyle=e.textColor,t.strokeText(e.text,-1*i*e.width,-1*n*e.height)):(t.fillStyle=e.textColor,t.fillText(e.text,-1*i*e.width,-1*n*e.height))}function n(t,e){t.font=e.size+"px "+e.textFamily,e.width=t.measureText(e.text).width,e.height=e.size+2}function s(t,e){t.beginPath(),a(t,e),e.draw(t,e)}function r(t,e){e=e||{},t.globalAlpha=e.parent.alpha<1?e.parent.alpha:e.alpha,t.transform(e.scaleX*e.parent.scaleX,e.skewX*e.parent.skewX,e.skewY*e.parent.skewY,e.scaleY*e.parent.scaleY,e.parent.x+e.x+(e.anchorX+e.parent.anchorX)*e.width-("Masker"===e.$type?0:e.parent.mask?e.parent.mask.x:0),e.parent.y+e.y+(e.anchorY+e.parent.anchorY)*e.height-("Masker"===e.$type?0:e.parent.mask?e.parent.mask.y:0)),t.rotate((e.rotation+e.parent.rotation)*Math.PI/180)}function a(t,e){t.fillStyle=e.fillStyle,t.strokeStyle=e.strokeStyle,t.shadowColor=e.shadowColor,t.shadowBlur=e.shadowBlur||0,t.shadowOffsetX=e.shadowOffsetX||0,t.shadowOffsetY=e.shadowOffsetY||0,t.lineCap=e.lineCap,t.lineJoin=e.lineJoin,t.lineWidth=e.lineWidth||0,t.miterLimit=e.miterLimit}var o=Array.prototype.slice,h="onorientationchange"in window?"orientationchange":"resize",c=["rect","arc","arcTo","moveTo","lineTo","clip","quadraticCurveTo","bezierCurveTo"],u=t.Event.extend({initialize:function(){u.superclass.initialize.call(this),this.x=0,this.y=0,this.visible=!0,this.alpha=1,this.scaleX=1,this.scaleY=1,this.rotation=0,this.skewX=0,this.skewY=0,this.anchorX=0,this.anchorY=0,this.$type="ObjectContainer",this._children=[],this.numChildren=0},addChild:function(e,i){if(!t.isObject(e))throw new Error(String(e)+"is not a instance of EC");return e.parent=this,e.visible=t.isDefined(e.visible)?e.visible:this.visible,e.alpha=t.isDefined(e.alpha)?e.alpha:this.alpha,e.rotation=t.isDefined(e.rotation)?e.rotation:this.rotation,e.scaleX=t.isDefined(e.scaleX)?e.scaleX:this.scaleX,e.scaleY=t.isDefined(e.scaleY)?e.scaleY:this.scaleY,t.isNumber(i)?this._children.splice(i,0,e):this._children.push(e),"TextField"==e.$type&&n(e.renderContext,e),this.numChildren=this._children.length,this},addChildAt:function(t,e){return this.addChild(t,e)},removeChild:function(t){this._stopTweens(t);for(var e=0;e<this._children.length;e++)if(this._children[e]===t){this._children.splice(e,1);break}return this.numChildren=this._children.length,this},removeAllChildren:function(){return this._stopAllTweens(),this._children=[],this.numChildren=0,this},getChilds:function(){return this._children},getChildIndex:function(t){for(var e=0;e<this._children.length;e++)if(this._children[e]==t)return e;return-1},setChildIndex:function(t,e){return this.removeChild(t),this._children.splice(e,0,t),this},transform:function(t,e,i,n,s,r){return this.x=s,this.y=r,this.scaleX=t,this.scaleY=n,this.skewX=e,this.skewY=i,this},setTransform:function(t,e,i,n,s,r){return this.x=s,this.y=r,this.rotation=t,this.scaleY=n,this.skewX=e,this.skewY=i,this},_stopTweens:function(e){return t.Tween.removeTweens(e),this},_stopAllTweens:function(){return t.Tween.removeAllTweens(this),this}}),l=u.extend({initialize:function(t,e,i,n,s,r,a,o,h){l.superclass.initialize.call(this),this.text=t||"",this.size=e||16,this.textAlign=r||"start",this.textBaseline="",this.textFamily=a||"Microsoft yahei,Arial,sans-serif",this.textColor=s||"#000",this.stroke=!1,this.x=i||0,this.y=n||0,this.width=o||0,this.height=h||0,this.$type="TextField"}}),p=u.extend({initialize:function(e,i,n,s,r,a,o,h,c){p.superclass.initialize.call(this),this.x=i||0,this.y=n||0,t.isDefined(a)&&(this.sx=a),t.isDefined(o)&&(this.sy=o),t.isDefined(h)&&(this.swidth=h||.1),t.isDefined(c)&&(this.sheight=c||.1),this.$type="BitMap",t.isDefined(e)&&t.extend(this,t.isObject(e)?"IMG"===e.nodeName?{bitMapData:e,width:e.width,height:e.height}:e:RES.getRes(e)),t.isDefined(s)&&(this.width=s),t.isDefined(r)&&(this.height=r)},setBitMap:function(e){if(!t.isObject(e))throw new Error(String(e)+"is a invalid bitMapObject");"nodeType"in e?this.bitMapData=e:t.extend(this,e)}}),f=u.extend({initialize:function(t,e,i,n){f.superclass.initialize.call(this),this.x=t||0,this.y=e||0,this.width=i||0,this.height=n||0,this._drawFuns=[],this._drawTypes=[],this._closePathTypes=[],this.$type="Shape"},_setStyle:function(e,i,n,s,r,a,o){this._drawTypes.push(e.replace("Style","")),"number"==typeof n&&n<1?this[e]=t.util.color.toRgb(i,n):this[e]=i,this.shadowColor=s||0,this.shadowBlur=r||0,this.shadowOffsetX=a||0,this.shadowOffsetY=o||0},fill:function(){var t=o.call(arguments);t.unshift("fillStyle"),this._setStyle.apply(this,t)},stroke:function(){var t=o.call(arguments);t.unshift("strokeStyle"),this._setStyle.apply(this,t)},draw:function(t){this._drawFuns.forEach(function(e){e(t)}),this._closePathTypes.forEach(function(e){t[e]()}),this._drawTypes.forEach(function(e){t[e]()})},close:function(){this._closePathTypes.push("closePath")}});c.forEach(function(t){f.prototype[t]=function(){var e=this,i=o.call(arguments);"rect"!=t&&"arc"!=t||(e.x=e.x+i.shift(),e.y=e.y+i.shift(),"arc"==t?(e.width=2*i[0],e.height=2*i[0],i=[-1*e.anchorX*e.width+e.width/2,-1*e.anchorY*e.height+e.height/2].concat(i)):(e.width=i[0],e.height=i[1],i=[-1*e.anchorX*e.width,-1*e.anchorY*e.height].concat(i))),this._drawFuns.push(function(e){e[t].apply(e,i)})}});var d=u.extend({initialize:function(t,e,i,n){d.superclass.initialize.call(this),this.x=t||0,this.y=e||0,this.width=i||0,this.height=n||0,this.$type="Sprite"},addChild:function(t){t.renderContext=this.renderContext,t.stage=this.stage,this._addMask(),d.superclass.addChild.apply(this,arguments),1==this.getChilds().length?(this.width=t.x+t.width,this.height=t.y+t.height):(t.x+t.width>this.width&&(this.width=t.x+t.width),t.y+t.height>this.height&&(this.height=t.y+t.height))},_addMask:function(){this.mask&&!this._isMaskAdded&&(this.mask instanceof t.Masker?(d.superclass.addChild.call(this,this.mask,0),this._isMaskAdded=!0):console.error("mask must be a instance of EC.Masker"))}}),m=f.extend({initialize:function(){m.superclass.initialize.apply(this,arguments),this.$type="Masker"},draw:function(t){m.superclass.draw.call(this,t),t.clip()}}),g=u.extend({initialize:function(e,i){g.superclass.initialize.call(this),this.canvas=e,this.renderContext=this.canvas.getContext("2d"),this.compositeOperation="source-over",this.$type="Stage",this.options=t.extend({},{showFps:!1,scaleMode:"showAll",width:window.innerWidth,height:window.innerHeight},i||{}),this.width=parseFloat(this.canvas.getAttribute("width"))||this.options.width,this.height=parseFloat(this.canvas.getAttribute("height"))||this.options.height,this.scaleRatio=1,this._isRendering=!1,this._ticker=new t.Ticker,this.canvas.width=this.width,this.canvas.height=this.height,"noScale"!==this.options.scaleMode&&this.setAdapter(),this.options.showFps&&(this.createFps(),this.showFps()),this._initEvents(),this.start()},addChild:function(e){if(!t.isObject(e))throw new Error(String(e)+"is not a instance of EC");e.renderContext=this.renderContext,e.stage=this,g.superclass.addChild.apply(this,arguments),this._triggerAddToStage(e)},render:function(){var t=this,e=this.renderContext,i=function(n){"Sprite"==n.$type?(n.mask&&e.save(),n.getChilds().forEach(function(t){i(t)}),n.mask&&e.restore()):t._renderItem(n,e)};return e.globalCompositeOperation=this.compositeOperation,this._children.forEach(i),this},_renderItem:function(t,n){if(t.visible!==!1)switch(t.$type){case"BitMap":n.save(),r(n,t),e(n,t),n.restore();break;case"TextField":n.save(),r(n,t),i(n,t),n.restore();break;case"Shape":n.save(),r(n,t),s(n,t),n.restore();break;case"Masker":r(n,t),s(n,t)}},clear:function(){return this.renderContext.clearRect(0,0,this.width,this.height),this},clearChildren:function(){this.removeAllChildren()},start:function(){if(!this._isRendering)return this._isRendering=!0,this._ticker.start(),this},stop:function(){return this._ticker.stop(),this.dispatch("stop"),this._isRendering=!1,this},_triggerAddToStage:function(t){var e=function(t){t.dispatch("addToStage"),"Sprite"==t.$type&&t.getChilds().forEach(e)};t.dispatch("addToStage",t),t.getChilds().forEach(e)},_triggerEnterFrame:function(){var t=function(e){e.dispatch("enterframe"),"Sprite"==e.$type&&e.getChilds().forEach(t)};this.getChilds().forEach(t)},setAdapter:function(){var e=this.canvas.parentNode,i="BODY"==e.nodeName?window.innerWidth:e.offsetWidth-parseFloat(t.getStyle(e,"padding-left"))-parseFloat(t.getStyle(e,"padding-right")),n="BODY"==e.nodeName?window.innerHeight:e.offsetHeight-parseFloat(t.getStyle(e,"padding-top"))-parseFloat(t.getStyle(e,"padding-bottom")),s=i,r=this.height/this.width*s;switch(this.options.scaleMode){case"showAll":r>n&&(r=n,s=this.width/this.height*r);break;case"fixedWidth":}return this.canvas.style.width=s+"px",this.canvas.style.height=r+"px",this.scaleRatio=this.width/s,this},_initEvents:function(){var e=this.options.showFps;this._ticker.on("ticker",function(){e&&this.FPS.begin(),this.clear(),this.render(),this.dispatch("enterframe"),e&&this.FPS.end()},this),this.on("enterframe",this._triggerEnterFrame,this),"noScale"!==this.options.scaleMode&&window.addEventListener(h,function(){this.setAdapter()}.bind(this),!1),(new t.TouchEvent).attach(this)},createFps:function(){this.FPS=new Stats},showFps:function(e){t.isObject(e)&&(this.FPS.dom.style.left=t.isDefined(e.left)?t.isNumber(e.left)?e.left+"px":e.left:"",this.FPS.dom.style.right=t.isDefined(e.right)?t.isNumber(e.right)?e.right+"px":e.right:"",this.FPS.dom.style.top=t.isDefined(e.top)?t.isNumber(e.top)?e.top+"px":e.top:"",this.FPS.dom.style.bottom=t.isDefined(e.bottom)?t.isNumber(e.bottom)?e.bottom+"px":e.bottom:""),this._fpsDom||document.body.appendChild(this._fpsDom=this.FPS.dom)}});c.concat(["createLinearGradient","createPattern","createRadialGradient","addColorStop","createImageData","putImageData","getImageData","isPointInPath"]).forEach(function(t){g.prototype[t]=function(){return this.renderContext[t].apply(this.renderContext,arguments)}}),t.provide({TextField:l,BitMap:p,Shape:f,Masker:m,Sprite:d,Stage:g})}(window.EC),function(t,e){"use strict";var i=t.Sprite.extend({initialize:function(e,n,s){i.superclass.initialize.call(this),this._startFrame=0,this._startTime=0,this._playTimes=-1,this._resKey=s,this.currentFrame=0,this.isPlaying=!1,this.setRES(e,n),this._clip=new t.BitMap(this.RESUrl),this.addChild(this._clip),Array.isArray(this.RESUrl)?(this.totalFrames=this.RESUrl.length,this.setFrame=this.setFrameByPath):this.setFrame=this.setFrameBySprite,this._timer=new t.Timer(this.frameRate,this._repeatCount),this._initEvents()},setRES:function(e,i,r){this.RESUrl=n(e),this.RES=s(i,this._resKey),this.currentFrame=0,this.frame=this.getMovieClipData(this._resKey),this.frameRate=Math.round(1e3/(this.frame.frameRate||24)),this.totalFrames=this.frame.frames.length,Array.isArray(this.RESUrl)?this.bitMapData=this.RESUrl[this.currentFrame].bitMapData:(t.isObject(this.RESUrl)&&"nodeType"in this.RESUrl&&(this.RESUrl={bitMapData:this.RESUrl,width:this.RESUrl.width,height:this.RESUrl.height}),this.bitMapData=this.RESUrl.bitMapData),r&&this.setFrameRate(r)},getMovieClipData:function(t){return this.RES.mc[t]||[]},gotoAndPlay:function(t,e,i){return t=Math.max(0,t-1),this._startFrame=t,this._playTimes=e,this.currentFrame=t,this._playTimes>0&&(this._repeatCount=this._playTimes*this.totalFrames,this._timer.setRepeatCount(this._repeatCount)),i&&this.setFrameRate(Math.round(1e3/i)),this.setFrame(this.currentFrame),this.play(),this},gotoAndStop:function(t){return this.setFrame(t)},prevFrame:function(){return this.setFrame(--this.currentFrame)},nextFrame:function(){return this.setFrame(++this.currentFrame)},play:function(){return this.isPlaying?this:(this._startTime=Date.now(),this._timer.start(),this.isPlaying=!0,this)},stop:function(){return this._timer.stop(),this.isPlaying=!1,this},pause:function(t){return this._timer.pause(t),this._startTime+=t,this.isPlaying=!1,this},wait:function(t){return this._timer.wait(t),this},setFrameRate:function(t){this.frameRate=t},setFrameBySprite:function(t){var i=this.frame.frames[t]||{},n=this.RES.res[i.res];if(n!==e)return this._timer.delay=(i.duration||0)*this.frameRate,this._clip.x=i.x||0,this._clip.y=i.y||0,this._clip.sx=n.x||0,this._clip.sy=n.y||0,this._clip.swidth=n.w||this.width||0,this._clip.sheight=n.h||this.height||0,this._clip.width=this._clip.swidth,this._clip.height=this._clip.sheight,this.width=this._clip.width,this.height=this._clip.height,this},setFrameByPath:function(t){var e=this.frame.frames[t]||{},i=this.RESUrl[t];return this._timer.delay=(e.duration||0)*this.frameRate,this._clip.bitMapData=i.bitMapData,this._clip.x=e.x||0,this._clip.y=e.y||0,this._clip.width=i.width||this.width||0,this._clip.height=i.height||this.height||0,this},_initEvents:function(){this._timer.on("timer",function(){++this.currentFrame>this.totalFrames-1&&(this.currentFrame=this._startFrame,this.dispatch("loopcomplete")),this.setFrame(this.currentFrame)},this),this._timer.on("complete",function(){this.off("enterframe"),this.dispatch("complete")},this)}}),n=function(t){return/_(png|jpg|jpeg|gif|bmp|)$/.test(t)?RES.getRes(t):t},s=function(t,i){if("string"==typeof t)return RES.getRes(t);if(Array.isArray(t)){var n=[],s={},a={mc:{},res:{}};return t.forEach(function(t){var e=t.split(" "),i=r();n.push({res:i,x:0,y:0,duration:1}),s[i]={x:-1*e[0],y:-1*e[1]}}),a.mc[i]={frames:n,frameRate:24},a.res=s,a}if("object"==typeof t&&!t.mc){var n=[],s={},a={mc:{},res:{}};for(var o in t){var h=t[o],c=r();n.push({res:c,key:o,x:h.offX,y:h.offY,duration:h.duration===e?1:h.duration}),s[c]={x:h.x,y:h.y,w:h.w,h:h.h}}return n=n.sort(function(t,e){return parseInt(t.key.replace(/^[^\d]+/,""))-parseInt(e.key.replace(/^[^\d]+/,""))}),a.mc[i]={frames:n,frameRate:24},a.res=s,a}return t},r=function(t){var e="",i=0;for(t=t||8;i++<t;)e+=Math.floor(16*Math.random()).toString(16);return e.toUpperCase()};t.provide({MovieClip:i})}(window.EC),function(t){"use strict";function e(){return!0}function i(){return!1}var n=document,s=n.body,r=n.documentElement,a=t.EVENTS,o=t.isTouch,h=function(){this.enableStack=[],this._touchX=0,this._touchY=0,this._offsetX=0,this._offsetY=0,this._bound={},this._touchTimer=null};h.prototype={attach:function(t){this.stage=t,this.element=t.canvas,this._startTime=0,this._bindEvents()},_bindEvents:function(){this.element.addEventListener(a.START,this._onTouchStart.bind(this),!1),this.element.addEventListener(a.MOVE,this._onTouchMove.bind(this),!1),this.element.addEventListener(a.END,this._onTouchEnd.bind(this),!1)},_onTouchStart:function(t){t.preventDefault(),t=o?t.targetTouches[0]:t,this._startTime=Date.now(),this._offsetX=window.pageXOffset||r.scrollLeft||s.scrollLeft||0,this._offsetY=window.pageYOffset||r.scrollTop||s.scrollTop||0,this._bound=this.element.getBoundingClientRect(),this._clearTouchTimer(),this._setTouchXY(t),this.enableStack=this._getTouchEnables(),this._triggerEvent("touchstart",t),this._touchTimer=setTimeout(function(){this._triggerEvent("longtouch",t)}.bind(this),600)},_onTouchMove:function(t){t.preventDefault(),t=o?t.changedTouches[0]:t,this._clearTouchTimer(),this._setTouchXY(t),this._triggerEvent("touchmove",t)},_onTouchEnd:function(t){t=o?t.changedTouches[0]:t,this._clearTouchTimer(),this._setTouchXY(t),this._triggerEvent("touchend",t);var e=Date.now()-this._startTime;e<200&&this._triggerEvent("touch",t)},_clearTouchTimer:function(){this._touchTimer&&clearTimeout(this._touchTimer)},_triggerEvent:function(e,i){var n=this,s=this.stage.scaleRatio,r=this.enableStack.filter(function(e){return t.util.isPointInPath({x:n._touchX*s,y:n._touchY*s},e)});if(r.length){var a=t.extend({type:e,stageX:this._touchX,stageY:this._touchY},this._getOriginalEventProps(i));i=new c(i,a);for(var o,h,u=0;u<r.length&&(h=r[u],!i.isPropagationStopped());u++)o&&h!==o||("Sprite"===h.$type||"Stage"===h.$type?h.dispatch(e,t.extend(i,{target:this._getTouchedTarget(h)||h})):h.dispatch(e,t.extend(i,{target:h})),o=h.parent)}},_getTouchedTarget:function(e){function i(t){for(var e=t.getChilds(),s=e.length;s--;)e[s].visible&&("Sprite"===e[s].$type?i(e[s]):n.push(e[s]))}var n=[],s=this,r=this.stage.scaleRatio;return i(e),n.find(function(e){return t.util.isPointInPath({x:s._touchX*r,y:s._touchY*r},e)})},_getTouchEnables:function(){function t(i){for(var n=i.getChilds(),s=n.length;s--;)n[s].visible&&("Sprite"===n[s].$type&&t(n[s]),n[s].touchEnabled&&e.push(n[s]))}var e=[];return t(this.stage),this.stage.touchEnabled&&e.push(this.stage),e},_getOriginalEventProps:function(t){var e={};return["pageX","pageY","clientX","clientY","screenX","screenY","radiusX","radiusY","rotationAngle"].forEach(function(i){e[i]=t[i]}),e},_setTouchXY:function(t){this._touchX=t.pageX-this._bound.left-this._offsetX,this._touchY=t.pageY-this._bound.top-this._offsetY}};var c=function(n,s){n&&n.type?(this.originalEvent=n,this.type=n.type,this.isDefaultPrevented=n.defaultPrevented||void 0===n.defaultPrevented&&n.returnValue===!1?e:i,this.target=n.target,this.currentTarget=n.currentTarget,this.relatedTarget=n.relatedTarget):this.type=n,s&&t.extend(this,s),this.timeStamp=n&&n.timeStamp||Date.now()};c.prototype={constructor:c,isDefaultPrevented:i,isPropagationStopped:i,isImmediatePropagationStopped:i,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=e,t&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=e,t&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=e,t&&t.stopImmediatePropagation(),this.stopPropagation()}},t.provide({TouchEvent:h})}(window.EC);var Stats=function(){function t(){
return window.performance&&performance.now?performance.now():Date.now()}function e(t){return s.appendChild(t.dom),t}function i(t){for(var e=0;e<s.children.length;e++)s.children[e].style.display=e===t?"block":"none";n=t}var n=0,s=document.createElement("div");s.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",s.addEventListener("click",function(t){t.preventDefault(),i(++n%s.children.length)},!1);var r=t(),a=r,o=0,h=e(new Stats.Panel("FPS","#0ff","#002")),c=e(new Stats.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var u=e(new Stats.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:s,addPanel:e,showPanel:i,begin:function(){r=t()},end:function(){o++;var e=t();if(c.update(e-r,200),e>a+1e3&&(h.update(1e3*o/(e-a),100),a=e,o=0,u)){var i=performance.memory;u.update(i.usedJSHeapSize/1048576,i.jsHeapSizeLimit/1048576)}return e},update:function(){r=this.end()},domElement:s,setMode:i}};Stats.Panel=function(t,e,i){var n=1/0,s=0,r=Math.round,a=r(window.devicePixelRatio||1),o=80*a,h=48*a,c=3*a,u=2*a,l=3*a,p=15*a,f=74*a,d=30*a,m=document.createElement("canvas");m.width=o,m.height=h,m.style.cssText="width:80px;height:48px";var g=m.getContext("2d");return g.font="bold "+9*a+"px Helvetica,Arial,sans-serif",g.textBaseline="top",g.fillStyle=i,g.fillRect(0,0,o,h),g.fillStyle=e,g.fillText(t,c,u),g.fillRect(l,p,f,d),g.fillStyle=i,g.globalAlpha=.9,g.fillRect(l,p,f,d),{dom:m,update:function(h,w){n=Math.min(n,h),s=Math.max(s,h),g.fillStyle=i,g.globalAlpha=1,g.fillRect(0,0,o,p),g.fillStyle=e,g.fillText(r(h)+" "+t+" ("+r(n)+"-"+r(s)+")",c,u),g.drawImage(m,l+a,p,f-a,d,l,p,f-a,d),g.fillRect(l+f-a,p,a,d),g.fillStyle=i,g.globalAlpha=.9,g.fillRect(l+f-a,p,a,r((1-h/w)*d))}}},"object"==typeof module&&(module.exports=Stats);