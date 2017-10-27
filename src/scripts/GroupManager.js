(function (EC) {
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

    removeAll: function () {
      this._items = {};
    },

    add: function (item) {
      this._items[item.getId()] = item;
    },

    remove: function (item) {
      delete this._items[item.getId()];
    },

    get: function(id){
      return this._items[id];
    },

    update: function (keeping) {
      var item;
      var _items = this._items;
      var itemIds = Object.keys(this._items);

      if (itemIds.length === 0) {
        return false;
      }

      while (itemIds.length > 0) {
        itemIds.forEach(function (itemId) {
          item = _items[itemId];
          if (item && item.update() === false) {
            item._isPlaying = false;
            if (!keeping) {
              delete _items[itemId];
            }
          }
        });

        itemIds = [];
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