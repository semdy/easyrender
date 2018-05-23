;(function (EC) {
  'use strict';

  var __ = {
    poolDic: Symbol('poolDic')
  };

  /**
   * 简易的对象池实现
   * 用于对象的存贮和重复使用
   * 可以有效减少对象创建开销和避免频繁的垃圾回收
   * 提高游戏性能
   */
    var Pool = function() {
      this[__.poolDic] = {};
    };

    /**
     * 根据对象标识符
     * 获取对应的对象池
     */
    Pool.prototype.getPoolBySign = function(name) {
      return this[__.poolDic][name] || (this[__.poolDic][name] = []);
    };

    /**
     * 根据传入的对象标识符，查询对象池
     * 对象池为空创建新的类，否则从对象池中取
     */
    Pool.prototype.getItemByClass = function(name, className) {
      var pool = this.getPoolBySign(name);
      var result = pool.length
        ? pool.shift()
        : new className();

      return result;
    };

    /**
     * 将对象回收到对象池
     * 方便后续继续使用
     */
    Pool.prototype.recover = function(name, instance) {
      this.getPoolBySign(name).push(instance);
    };

    EC.provide({
      Pool: Pool
    });

})(window.EC);