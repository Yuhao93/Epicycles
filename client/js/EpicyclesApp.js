goog.provide('org.haodev.epicycle.EpicyclesApp');

goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.asserts');
goog.require('goog.crypt.base64');
goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('org.haodev.epicycle.BaseApp');
goog.require('org.haodev.epicycle.Circle');
goog.require('org.haodev.epicycle.ComplexNumber');
goog.require('org.haodev.epicycle.DataPoint');
goog.require('org.haodev.epicycle.DiscreteFourierTransform');


/**
 * @param {*} data The base64 encoded array of floats that represents the
 *    circles.
 * @extends org.haodev.epicycle.BaseApp
 * @constructor
 */
org.haodev.epicycle.EpicyclesApp = function(data) {
  goog.base(this);

  /** @private {!goog.Uri.QueryData} */
  this.queryData_ = goog.Uri.parse(window.location.href).getQueryData();


  /** @private {boolean} */
  this.isEmbed_ = this.queryData_.get('embed') == '1';


  /** @private {boolean} */
  this.playStart_ = this.queryData_.get('playstart') == '1';


  /** @private {number} */
  this.penRadius_ = this.queryData_.get('bigpen') == '1' ? 5 : 2;


  if (this.isEmbed_) {
    var canvasElement = goog.dom.getElement('canvas');
    goog.dom.classlist.add(canvasElement, 'clickable');
    goog.events.listen(canvasElement, goog.events.EventType.CLICK,
        goog.bind(this.togglePlay_, this));
    goog.events.listen(canvasElement, goog.events.EventType.MOUSEOUT,
        goog.bind(this.onExitCanvas_, this));
    goog.events.listen(canvasElement, goog.events.EventType.MOUSEOVER,
        goog.bind(this.onEnterCanvas_, this));
  }


  /** @private {boolean} */
  this.inCanvas_ = false;


  /** @private {!Array.<!org.haodev.epicycle.Circle>} */
  this.discreteCircles_ = [];

  if (goog.isString(data)) {
    this.discreteCircles_ = this.decodeData_(data);
  } else if (goog.isObject(data)) {
    this.discreteCircles_ = this.parseData_(data);
  } else {
    throw 'Invalid input data';
  }


  /** @private {number }*/
  this.timeScale_ = 4;
  if (this.queryData_.containsKey('scale') &&
      !isNaN(parseFloat(this.queryData_.get('scale')))) {
    this.timeScale_ = parseFloat(this.queryData_.get('scale'));
  }


  /** @private {number} */
  this.time_ = Date.now();


  /** @private {number} */
  this.prevDTime_ = 0;


  /** @private {boolean} */
  this.playing_ = !this.isEmbed_ || this.playStart_;


  /** @private {!Array.<!goog.math.Coordinate>} */
  this.arr_ = this.simulatePoints_(this.discreteCircles_);
};
goog.inherits(org.haodev.epicycle.EpicyclesApp, org.haodev.epicycle.BaseApp);


/** @private */
org.haodev.epicycle.EpicyclesApp.prototype.onExitCanvas_ = function() {
  this.inCanvas_ = false;
};


/** @private */
org.haodev.epicycle.EpicyclesApp.prototype.onEnterCanvas_ = function() {
  this.inCanvas_ = true;
};


/** @private */
org.haodev.epicycle.EpicyclesApp.prototype.togglePlay_ = function() {
  this.playing_ = !this.playing_;
  if (this.playing_) {
    this.time_ = Date.now() - this.prevDTime_;
  }
};


/**
 * @param {!Array.<!org.haodev.epicycle.Circle>} circles
 * @return {!Array.<!goog.math.Coordinate>}
 * @private
 */
org.haodev.epicycle.EpicyclesApp.prototype.simulatePoints_ = function(circles) {
  var arr = [];
  var t = 0;
  for (var t = 0; t < circles.length / this.timeScale_ * 1000; t += 16) {
    var center = new goog.math.Coordinate(0, 0);
    for (var j = 0; j < circles.length; j++) {
      var circle = circles[j];
      center = circle.rotatedPoint(t, center, this.timeScale_);
    }
    arr.push(center);
  }
  // Connect Loop
  arr.push(arr[0]);
  return arr;
};



/**
 * @param {string} data
 * @return {!Array.<!org.haodev.epicycle.Circle>}
 * @private
 */
org.haodev.epicycle.EpicyclesApp.prototype.decodeData_ = function(data) {
  var decodedData = /** @type {!Array.<number>} */ (goog.crypt.base64.decodeStringToByteArray(data, true));
  var uint8Array = new Uint8Array(decodedData);
  var floatArray = new Float64Array(uint8Array.buffer);
  var scale = Math.floor(floatArray[0]);
  var circles = [];
  for (var i = 1; i < floatArray.length; i++) {
    circles.push(floatArray[i]);
  }
  return this.parseData_({ 'scale': scale, 'circles': circles });
};


/**
 * @param {!Object} data
 * @return {!Array.<!org.haodev.epicycle.Circle>}
 * @private
 */
org.haodev.epicycle.EpicyclesApp.prototype.parseData_ = function(data) {
  var scale = goog.asserts.assertNumber(data.scale);
  var arr = goog.asserts.assertArray(data.circles);
  var circles = [];
  var numberOfCircles = arr.length / 2;
  for (var i = 0; i < arr.length; i += 2) {
    var real = arr[i];
    var imaginary = arr[i + 1];
    var ind = i / 2;
    circles[ind] = new org.haodev.epicycle.Circle(
        new org.haodev.epicycle.ComplexNumber(real, imaginary),
        ind / numberOfCircles - .5, scale);
  }
  circles.sort(function(a, b) {
    return Math.abs(a.frequency()) - Math.abs(b.frequency());
  });
  return circles;
};


/** @override */
org.haodev.epicycle.EpicyclesApp.prototype.draw = function(context) {
  var newTime = Date.now();
  var dTime = newTime - this.time_;

  if (!this.playing_) {
    dTime = this.prevDTime_;
  } else {
    this.prevDTime_ = dTime;
  }

  var maxArrInd = Math.min(this.arr_.length, Math.floor(dTime / 16));

  var screenCenter = new goog.math.Coordinate(this.size.width / 2, this.size.height / 2);
  var center = new goog.math.Coordinate(0, 0);
  var translatedCenter = goog.math.Coordinate.sum(center, screenCenter);
  context.strokeStyle = '#0000FF';
  for (var i = 0; i < this.discreteCircles_.length; i++) {
    // Don't draw the first circle, it doesn't do anything, it's just the offset.
    if (i > 0) {
      this.discreteCircles_[i].draw(context, translatedCenter);
    }
    center = this.discreteCircles_[i].rotatedPoint(dTime, center, this.timeScale_);
    translatedCenter = goog.math.Coordinate.sum(center, screenCenter);
  }

  context.beginPath();
  context.strokeStyle = '#000000';
  context.fillStyle = '#000000';
  context.arc(translatedCenter.x, translatedCenter.y, this.penRadius_, 0, 2 * Math.PI);
  context.stroke();
  context.fill();

  context.lineWidth = 2;
  context.beginPath();
  for (var i = 0; i < maxArrInd; i++) {
    translatedCenter = goog.math.Coordinate.sum(this.arr_[i], screenCenter);
    if (i == 0) {
      context.moveTo(translatedCenter.x, translatedCenter.y);
    } else {
      context.lineTo(translatedCenter.x, translatedCenter.y);
    }
  }
  context.stroke();

  if (!this.playing_ && this.isEmbed_) {
    context.fillStyle = 'rgba(0, 0, 0, .3)';
    context.fillRect(0, 0, this.size.width, this.size.height);
    context.save();
    if (!this.inCanvas_) {
      context.strokeStyle = '#AADC64';
      context.fillStyle = '#AADC64';
    } else {
      context.strokeStyle = '#BBF26F';
      context.fillStyle = '#BBF26F';
    }

    var minDim = Math.min(this.size.height, this.size.width) / 2 - 75;
    context.lineJoin = 'round';
    context.lineWidth = 20;
    context.beginPath();
    context.moveTo(this.size.width / 2 - minDim, this.size.height / 2 - minDim);
    context.lineTo(this.size.width / 2 - minDim, this.size.height / 2 + minDim);
    context.lineTo(this.size.width / 2 + minDim, this.size.height / 2);
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
  }
};


/** @override */
org.haodev.epicycle.EpicyclesApp.prototype.onMouseDown = function() { };


/** @override */
org.haodev.epicycle.EpicyclesApp.prototype.onMouseUp = function() { };


/** @override */
org.haodev.epicycle.EpicyclesApp.prototype.onMouseMove = function(points) { };
