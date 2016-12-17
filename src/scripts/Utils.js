/**
 * Created by semdy on 2016/9/6.
 */

(function(EC){
    "use strict";

    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var colorTransfer = {};

    /*RGB颜色转换为16进制*/
    colorTransfer.toHex = function(rgb){
        if(/^(rgb|RGB)/.test(rgb)){
            var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
            var strHex = "#";
            for(var i=0; i<aColor.length; i++){
                var hex = Number(aColor[i]).toString(16);
                if(hex === "0"){
                    hex += hex;
                }
                strHex += hex;
            }
            if(strHex.length !== 7){
                strHex = rgb;
            }
            return strHex;
        } else if(reg.test(rgb)){
            var aNum = rgb.replace(/#/,"").split("");
            if(aNum.length === 6){
                return rgb;
            } else if(aNum.length === 3){
                var numHex = "#";
                for(var i=0; i<aNum.length; i+=1){
                    numHex += (aNum[i]+aNum[i]);
                }
                return numHex;
            }
        } else {
            return rgb;
        }
    };

    /*16进制颜色转为RGB格式*/
    colorTransfer.toRgb = function(hex, alpha){
        var sColor = hex.toLowerCase();
        if(sColor && reg.test(sColor)){
            var sPrefix = "rgb";
            if(sColor.length === 4){
                var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for(var i=1; i<7; i+=2){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
            }
            if( typeof alpha == 'number' ){
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
        if (r != null) return r[2]; return null;
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