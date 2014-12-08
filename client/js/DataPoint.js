goog.provide('org.haodev.epicycle.DataPoint');



/**
 * @param {!goog.math.Coordinate} d
 * @param {number} t
 * @constructor
 */
org.haodev.epicycle.DataPoint = function(d, t) {
  /** @private {!goog.math.Coordinate} */
  this.d_ = d;
  /** @private {number} */
  this.t_ = t;
};


/**
 * @return {!goog.math.Coordinate}
 */
org.haodev.epicycle.DataPoint.prototype.data = function() {
  return this.d_;
};


/**
 * @return {number}
 */
org.haodev.epicycle.DataPoint.prototype.time = function() {
  return this.t_;
};
