/**
 * Created by semdy on 2017/9/22.
 */

;(function (EC) {
  "use strict";

  var GroupManager = function () {
    this._items = {};
  };

  GroupManager.prototype = {
    getAll: function () {
      return Object.keys(this._items).map(function (itemId) {
        return this._items[itemId];
      }.bind(this));

    },

    add: function (item) {
      this._items[item.getId()] = item;
    },

    get: function(id){
      return this._items[id];
    },

    remove: function (item) {
      delete this._items[item.getId()];
    },

    removeAll: function () {
      this._items = {};
    },

    update: function (keeping) {
      var item;
      var items = this._items;

      for (var itemId in items) {
        item = items[itemId];
        if (item && item.update() === false) {
          item._isPlaying = false;
          if (!keeping) {
            delete items[itemId];
          }
        }
      }

      return true;

    },

    nextId: function () {
      return GroupManager._nextId++;
    }
  };

  GroupManager._nextId = 0;

  EC.provide({
    groupManager: new GroupManager()
  });

})(window.EC);