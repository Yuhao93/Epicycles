goog.provide('org.haodev.epicycle.BaseApp');

goog.require('goog.dom');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('haodev.tex');
goog.require('org.haodev.epicycle.Mouse');


/**
 * @constructor
 */
org.haodev.epicycle.BaseApp = function() {
  haodev.tex.convertEquations();

  /** @private {!goog.dom.ViewportSizeMonitor} */
  this.vsm_ = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(this.vsm_, goog.events.EventType.RESIZE, goog.bind(this.onResize_, this));


  /** @private {HTMLCanvasElement} */
  this.canvas_ = /** @type {HTMLCanvasElement} */(document.createElement('canvas'));
  this.canvas_.id = 'canvas';
  goog.dom.appendChild(goog.dom.getElement('canvas-container'), this.canvas_);

  /** @protected {goog.math.Size} */
  this.size = this.vsm_.getSize();
  this.resize_();


  /** @protected {CanvasRenderingContext2D} */
  this.context_ = /** @type {CanvasRenderingContext2D} */(this.canvas_.getContext('2d'));


  /** @private {!org.haodev.epicycle.Mouse}  */
  this.mouse_ = new org.haodev.epicycle.Mouse('canvas',
      goog.bind(this.onMouseDown, this),
      goog.bind(this.onMouseUp, this),
      goog.bind(this.onMouseMove, this));
  this.mouse_.setEnabled(true);

  requestAnimationFrame(goog.bind(this.run_, this));
};


/** @private */
org.haodev.epicycle.BaseApp.prototype.resize_ = function() {
  if (this.size == null) {
    return;
  }
  this.canvas_.width = this.size.width;
  this.canvas_.height = this.size.height;
};


/**
 * @param {!goog.events.Event} e
 * @private
 */
org.haodev.epicycle.BaseApp.prototype.onResize_ = function(e) {
  this.size = this.vsm_.getSize();
  this.resize_();
};


/**
 * @param {!CanvasRenderingContext2D} context
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @protected
 */
org.haodev.epicycle.BaseApp.prototype.line = function(context, x1, y1, x2, y2) {
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
};


/**
 * @param {!CanvasRenderingContext2D} context
 * @protected
 */
org.haodev.epicycle.BaseApp.prototype.drawBackground_ = function(context) {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
  context.strokeStyle = '#D1EBE8';
  context.lineWidth = 1;
  context.beginPath();
  if (context.setLineDash) {
    context.setLineDash([5]);
  }
  var spacing = 50;
  this.line(context, 0, this.size.height / 2, this.size.width, this.size.height / 2);
  for (var i = 1; i < this.size.height / (2 * spacing) ; i++) {
    var y = i * spacing;
    this.line(context, 0, this.size.height / 2 + y, this.size.width, this.size.height / 2 + y);
    this.line(context, 0, this.size.height / 2 - y, this.size.width, this.size.height / 2 - y);
  }
  this.line(context, this.size.width / 2, 0, this.size.width / 2, this.size.height);
  for (var i = 1; i < this.size.width / (2 * spacing) ; i++) {
    var x = i * spacing;
    this.line(context, this.size.width / 2 + x, 0, this.size.width / 2 + x, this.size.height);
    this.line(context, this.size.width / 2 - x, 0, this.size.width / 2 - x, this.size.height);
  }
  context.stroke();
  if (context.setLineDash) {
    context.setLineDash([]);
  }
};


/** @private */
org.haodev.epicycle.BaseApp.prototype.run_ = function() {
  if (!this.context_) {
    requestAnimationFrame(goog.bind(this.run_, this));
    return;
  }

  this.drawBackground_(this.context_);
  this.draw(this.context_);
  requestAnimationFrame(goog.bind(this.run_, this));
};


/** @protected */
org.haodev.epicycle.BaseApp.prototype.onMouseDown = goog.abstractMethod;


/** @protected */
org.haodev.epicycle.BaseApp.prototype.onMouseUp = goog.abstractMethod;


/**
 * @param {!Array.<!org.haodev.epicycle.DataPoint>} points
 * @protected
 */
org.haodev.epicycle.BaseApp.prototype.onMouseMove = goog.abstractMethod;


/**
 * @param {!CanvasRenderingContext2D} context
 * @protected
 */
org.haodev.epicycle.BaseApp.prototype.draw = goog.abstractMethod;
