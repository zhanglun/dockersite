(function () {
  var Painter = function (elem) {
    this.init(elem);
  };
  Painter.prototype.init = function (elem) {
    if (elem) {
      console.log('init');
      this.setCanvas(elem);
    }

  };

  Painter.prototype.setCanvas = function (elem, w, h) {


    (!w || w < 400) ? w = 400 : '';
    (!h || h < 400) ? h = 400 : '';
    if (elem.tagName.toLowerCase() === 'canvas') {
      this.canvas = elem;
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx = this.canvas.getContext('2d');
  };

  Painter.prototype.loadImage = function (url, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    var _this = this;
    console.log('image');
    // TODO: 暂时 url
    if (!url) {
      console.error('no image url');
      return false;
    }
    var _img = new Image();
    var _args = Array.prototype.slice.call(arguments, 1);
    _img.onload = function () {
      Array.prototype.unshift.call(_args, _img);
      console.log(_args);
      _this.ctx.drawImage.apply(_this.ctx, _args);
    };
    _img.src = url;

  };


  Painter.prototype.loadImageList = function (imglist) {
    var _this = this;
    var W = _this.canvas.width;
    var H = _this.canvas.height;

    var _size = W / 3;

    //if (W % _size !== 0) {
    //  _size = W / (W / _size + 1);
    //}
    //
    //console.log('size');
    //console.log(_size);
    // 列数
    var _col = _this.canvas.width / _size;

    if (imglist.length == 1) {
      _this.loadImage(imglist[0], 0, 0, 400, 400);
    }
    var _degrees = 360 / imglist.length;
    console.log(_degrees);
    imglist.forEach(function (img, i) {

      var _baseX = i % _col;
      var _baseY = Math.floor(i / _col);
      console.log(_baseX + ', ' + _baseY);

      _this.loadImage(img, _baseX * _size, _baseY * _size, _size, _size);

      //console.log(_degrees * i);
      //var _offsetX = Math.cos(_degrees * (i + 1) / 180 * Math.PI) * _size;
      //var _offsetY = Math.sin(_degrees * (i + 1) / 180 * Math.PI) * _size;
      //
      //var _posX = W / 2 - _size / 2 + _offsetX;
      //var _posY = H / 2 - _size / 2 + _offsetY;
      //console.log(_offsetX + ': ' + _offsetY);
      //_this.loadImage(img, _posX, _posY, _size, _size);

    });
  };

  Painter.prototype.drawCricle = function () {
    var _this = this;
    var path = new Path2D();
    path.arc(_this.canvas.width / 2, _this.canvas.height / 2, _this.canvas.height / 2, 0, Math.PI * 2);
    path.moveTo(_this.canvas.width / 2 + 1, _this.canvas.height / 2);
    path.arc(_this.canvas.width / 2, _this.canvas.height / 2, 1, 0, Math.PI * 2);
    _this.ctx.stroke(path);
  };

  window.Painter = Painter;
})();


window.addEventListener('load', function () {

  var canvas = document.getElementById('canvas');
  var painter = new Painter(canvas);
  console.log(painter);
  var list = ['../img/1.jpg', '../img/2.jpg', '../img/3.jpg', '../img/4.jpg', '../img/5.jpg', '../img/6.jpg', '../img/7.jpg', '../img/8.jpg', '../img/9.jpg'];
  list.length = 9;
  painter.loadImageList(list);
  //painter.drawCricle();
}, false);
