goog.provide('org.haodev.epicycle.Circle');

goog.require('org.haodev.epicycle.ComplexNumber');



/**
 * A Circle that is represented by a radius, frequency, and phase.
 *
 * @param {!org.haodev.epicycle.ComplexNumber} ComplexNumber
 * @param {!number} freq
 * @param {!number} n
 * @constructor
 */
org.haodev.epicycle.Circle = function(ComplexNumber, freq, n) {
  /**
   * @type {!org.haodev.epicycle.ComplexNumber}
   * @private
   */
  this.ComplexNumber_ = ComplexNumber;

  /**
   * @type {!number}
   * @private
   */
  this.freq_ = freq;

  /**
   * @type {!number}
   * @private
   */
  this.n_ = n;
};


/**
 * @return {!number}
 */
org.haodev.epicycle.Circle.prototype.radius = function() {
  return this.ComplexNumber_.magnitude() / this.n_;
};


/**
 * @return {!number}
 */
org.haodev.epicycle.Circle.prototype.frequency = function() {
  return this.freq_;
};


/**
 * @return {!number}
 */
org.haodev.epicycle.Circle.prototype.phase = function() {
  return this.ComplexNumber_.phase();
};


/**
 * @param {number} t
 * @param {!goog.math.Coordinate} center
 * @param {number} timeScale
 * @return {!goog.math.Coordinate}
 */
org.haodev.epicycle.Circle.prototype.rotatedPoint = function(t, center, timeScale) {
  // radians
  var r = (timeScale * t * 2 * Math.PI * this.freq_ / 1000) + this.phase();
  var x = this.radius() * Math.cos(r) + center.x;
  var y = this.radius() * Math.sin(r) + center.y;
  return new goog.math.Coordinate(x, y);
}


/**
 * @param {!CanvasRenderingContext2D} context
 * @param {!goog.math.Coordinate} center
 */
org.haodev.epicycle.Circle.prototype.draw = function(context, center) {
  context.beginPath();
  context.arc(center.x, center.y, this.radius(), 0, 2 * Math.PI);
  context.stroke();
  context.beginPath();
  context.arc(center.x, center.y, 1, 0, 2 * Math.PI);
  context.stroke();
};


/**
 * @return {!string}
 */
org.haodev.epicycle.Circle.prototype.str = function() {
  return '{' + this.ComplexNumber_.str() + ',' + this.freq_ + '}';
};
