goog.provide('org.haodev.epicycle.DrawingApp');

goog.require('goog.crypt.base64');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.math.Coordinate');
goog.require('org.haodev.epicycle.BaseApp');
goog.require('org.haodev.epicycle.ComplexNumber');
goog.require('org.haodev.epicycle.DataPoint');
goog.require('org.haodev.epicycle.DiscreteFourierTransform');
goog.require('org.haodev.epicycle.ajax');


/**
 * @extends {org.haodev.epicycle.BaseApp}
 * @constructor
 */
org.haodev.epicycle.DrawingApp = function() {
  /** @private {!Array.<!org.haodev.epicycle.DataPoint>} */
  this.points_ = [];
  goog.base(this);
};
goog.inherits(org.haodev.epicycle.DrawingApp, org.haodev.epicycle.BaseApp);


/**
 * @param {!Array.<!org.haodev.epicycle.DataPoint>} arr
 * @return {!Array.<!org.haodev.epicycle.ComplexNumber>}
 * @private
 */
org.haodev.epicycle.DrawingApp.prototype.toComplexNumbers_ = function(arr) {
  var complexArr = [];
  var newArr = [];
  var num = new goog.math.Coordinate(0, 0);
  for (var i = 0; i < arr.length; i++) {
    var d = arr[i];
    num.x += d.data().x / 5;
    num.y += d.data().y / 5;
    if (i > 4) {
      num.x -= arr[i - 5].data().x / 5;
      num.y -= arr[i - 5].data().y / 5;
      newArr.push(new org.haodev.epicycle.DataPoint(
          new goog.math.Coordinate(num.x - this.size.width / 2,
          num.y - this.size.height / 2), d.time()));
    } else {
      newArr.push(new org.haodev.epicycle.DataPoint(
          new goog.math.Coordinate(d.data().x - this.size.width / 2,
          d.data().y - this.size.height / 2), d.time()));
    }
  }
  for (var i = 0; i < arr.length; i++) {
    var d = newArr[i].data();
    complexArr.push(new org.haodev.epicycle.ComplexNumber(d.x, d.y));
  }
  return complexArr;
};


/** @override */
org.haodev.epicycle.DrawingApp.prototype.draw = function(context) {
  context.strokeStyle = '#000000';
  context.lineWidth = 2;
  context.beginPath();
  var points = this.points_;
  for (var i = 0; i < points.length; i++) {
    var point = points[i].data();
    if (i == 0) {
      this.context_.moveTo(point.x, point.y);
    } else {
      this.context_.lineTo(point.x, point.y);
    }
  }
  context.closePath();
  context.stroke();
};


/** @override */
org.haodev.epicycle.DrawingApp.prototype.onMouseDown = function() { };


/** @override */
org.haodev.epicycle.DrawingApp.prototype.onMouseUp = function() {
  var complexNumbers = this.toComplexNumbers_(this.points_);
  var dft = org.haodev.epicycle.DiscreteFourierTransform(complexNumbers);
  this.saveData_(this.points_.length, dft);
};


/**
 * @param {number} scale
 * @param {!Array.<!org.haodev.epicycle.ComplexNumber>} circles
 * @private
 */
org.haodev.epicycle.DrawingApp.prototype.saveData_ = function(scale, circles) {
  var floatValues = [];
  for (var i = 0; i < circles.length; i++) {
    floatValues.push(circles[i].real());
    floatValues.push(circles[i].imaginary());
  }
  var arr = JSON.stringify(floatValues);
  org.haodev.epicycle.ajax.post('/addEpicycle', { 'scale': scale, 'circles': arr }, function(response) {
    if (response.success) {
      window.location.href = '/load/' + response.id;
    }
  });
};


/**
 * @param {number} scale
 * @param {!Array.<!org.haodev.epicycle.ComplexNumber>} circles
 * @private
 */
org.haodev.epicycle.DrawingApp.prototype.toDataUrl_ = function(scale, circles) {
  var floats = [scale];
  for (var i = 0; i < circles.length; i++) {
    floats.push(circles[i].real());
    floats.push(circles[i].imaginary());
  }
  var floatArray = new Float64Array(floats);
  var uint8Array = new Uint8Array(floatArray.buffer);
  var b64 = goog.crypt.base64.encodeByteArray(uint8Array, true);
  window.location.href =  '/epicycles/' + b64;
};


/** @override */
org.haodev.epicycle.DrawingApp.prototype.onMouseMove = function(points) {
  this.points_ = points;
};
