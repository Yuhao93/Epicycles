goog.provide('org.haodev.epicycle.Mouse');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('org.haodev.epicycle.DataPoint');



/**
 * @param {!string} elementId
 * @param {!function()} beginCallback
 * @param {!function()} endCallback
 * @param {!function(!Array.<!org.haodev.epicycle.DataPoint>)} moveCallback
 * @constructor
 */
org.haodev.epicycle.Mouse = function(elementId, beginCallback, endCallback, moveCallback) {
  /**
   * @type {!Array.<!org.haodev.epicycle.DataPoint>}
   * @private
   */
  this.points_ = [];

  /** @private {number} */
  this.lastDown_ = -1;

  /** @private {number} */
  this.lastUp_ = -1;

  /**
   * @type {!boolean}
   * @private
   */
  this.collecting_ = false;


  /**
   * @type {!boolean}
   * @private
   */
  this.enabled_ = false;


  /**
   * @type {!function()}
   * @private
   */
  this.beginCallback_ = beginCallback;


  /**
   * @type {!function()}
   * @private
   */
  this.endCallback_ = endCallback;


  /**
   * @type {!function(!Array.<!org.haodev.epicycle.DataPoint>)}
   * @private
   */
  this.moveCallback_ = moveCallback;

  var element = goog.dom.getElement(elementId);
  goog.events.listen(element, goog.events.EventType.TOUCHSTART, goog.bind(this.onDown_, this));
  goog.events.listen(element, goog.events.EventType.TOUCHEND, goog.bind(this.onUp_, this));
  goog.events.listen(element, goog.events.EventType.TOUCHMOVE, goog.bind(this.onMove_, this));

  goog.events.listen(element, goog.events.EventType.MOUSEDOWN, goog.bind(this.onDown_, this));
  goog.events.listen(element, goog.events.EventType.MOUSEUP, goog.bind(this.onUp_, this));
  goog.events.listen(element, goog.events.EventType.MOUSEMOVE, goog.bind(this.onMove_, this));
};


/**
 * @param {!boolean} enabled
 */
org.haodev.epicycle.Mouse.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
};


/**
 * @return {number}
 */
org.haodev.epicycle.Mouse.prototype.lastDown = function() {
  return this.lastDown_;
};


 /**
  * @return {number}
  */
org.haodev.epicycle.Mouse.prototype.lastUp = function() {
  return this.lastUp_;
};


/**
 * @return {!Array.<!org.haodev.epicycle.DataPoint>}
 */
org.haodev.epicycle.Mouse.prototype.points = function() {
  return this.points_;
};


/**
 * @private
 */
org.haodev.epicycle.Mouse.prototype.onDown_ = function() {
  if (this.enabled_) {
    this.collecting_ = true;
    this.points_ = [];
    this.beginCallback_();
    this.lastDown_ = -1;
    this.lastUp_ = -1;
  }
};


/**
 * @private
 */
org.haodev.epicycle.Mouse.prototype.onUp_ = function() {
  if (this.enabled_) {
    this.collecting_ = false;
    this.endCallback_();
  }
};


/**
 * @param {!goog.events.BrowserEvent} e
 * @private
 */
org.haodev.epicycle.Mouse.prototype.onMove_ = function(e) {
  if (this.collecting_ && this.enabled_) {
    var time = Date.now();
    if (this.lastDown_ == -1) {
      this.lastDown_ = time;
    }
    this.lastUp_ = time;

    if (e.offsetX && e.offsetY) {
      this.points_.push(new org.haodev.epicycle.DataPoint(
          new goog.math.Coordinate(e.offsetX, e.offsetY), time));
    } else {
      var touchEvent = e.getBrowserEvent();
      this.points_.push(new org.haodev.epicycle.DataPoint(
          new goog.math.Coordinate(touchEvent.targetTouches[0].clientX,
              touchEvent.targetTouches[0].clientY), time));
    }
    this.moveCallback_(this.points_);
  }
};
