(function ($, window, undefined) {
  var Bullet = EC.Sprite.extend({
    initialize: function () {
      Bullet.superclass.initialize.call(this);

      this.bulletText = '';
      this.bulletColor = '#000';
      this.bulletTextField = null;

      this.once("addToStage", this.start, this);
    },
    start: function () {
      this.x = VideoBullet.mainInstance.stageW;
      this.triggered = false;
      this.setText(this.bulletText);
      this.endX = -this.width;
      this.shootTo();
    },
    shootTo: function () {
      EC.Tween.get(this).to({x: this.endX}, 5000).onUpdate(function (bulletObj) {
        if (!this.triggered) {
          if (bulletObj.x < VideoBullet.mainInstance.stageW - this.width * 1.2) {
            this.dispatch("born");
            this.triggered = true;
          }
        }
      }, this).call(function () {
        this.dispatch("dead");
      }, this);
    },
    setText: function (text) {
      if (text === "" || text === null) return;
      if (this.bulletTextField) {
        this.bulletTextField.text = text;
        this.width = this.bulletTextField.width;
      } else {
        this.bulletTextField = new EC.TextField(text, 18, 0, 0, this.bulletColor);
        this.addChild(this.bulletTextField);
      }
    }
  });

  function random(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  var VideoBullet = function (canvas, options) {

    this.options = EC.extend({
      trajectoryNum: 5,    //弹道数量
      trajectoryHeight: 60, //弹道高度
      initTop: 60
    }, options || {});

    this.canvas = document.getElementById('canvas-bullets');
    this.stage = new EC.Stage(this.canvas, {scaleMode: 'fixedWidth'});
    this.pool = new EC.Pool();

    this.stageW = this.stage.width;
    this.stageH = this.stage.height;

    this.subtitles = [];
    var strs = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 101; i++) {
      this.subtitles[this.subtitles.length] = {
        color: "#fff",
        text: "text" + strs.substr(0, random(1, 30)) + i
      };
    }

    VideoBullet.mainInstance = this;

    this.start();
  };

  EC.extend(VideoBullet.prototype, {
    start: function () {
      for (var i = 0; i < this.options.trajectoryNum; i++) {
        this.shootBullet(this.subtitles.shift(), i);
      }
    },
    shootBullet: function (data, trajectoryIndex) {
      if (!data) return;

      //var bullet = this.pool.getItemByClass('bullet', Bullet);
      var bullet = new Bullet();
      bullet.bulletText = data.text;
      bullet.bulletColor = data.color;
      bullet.y = this.options.initTop + trajectoryIndex * this.options.trajectoryHeight;
      bullet.trajectoryIndex = trajectoryIndex;

      if (bullet.triggered) {
        bullet.start();
      }

      this.stage.addChild(bullet);

      bullet.on('born', function () {
        this.shootBullet(this.subtitles.shift(), trajectoryIndex);
      }, this);

      bullet.on('dead', function () {
        bullet.remove();
      }, this);

      /*bullet.on('remove', function () {
        this.pool.recover('bullet', bullet);
      }, this);*/
    },
    addData: function (data, isPush) {
      if (data === null || data === "" || data === undefined) return;
      if (isPush) {
        this.subtitles.push(data);
      } else {
        this.subtitles.unshift(data);
      }
      if (this.subtitles.length === 1) {
        this.shootBullet(this.subtitles.shift(), random(0, this.options.trajectoryNum));
      }
    },
    clear: function () {
      this.stage.removeAllChildren();
      //this.subtitles = [];
    }
  });

  $(function () {
    window.videoBullet = new VideoBullet();
  });

})(this.jQuery || this.Zepto, this);
