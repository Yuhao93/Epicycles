goog.provide('org.haodev.epicycle.ComplexNumber');



/**
 * A complex number that can be seen as either a + ib or x * exp(iy)
 *
 * @param {!number} real
 * @param {!number} imaginary
 * @constructor
 */
org.haodev.epicycle.ComplexNumber = function(real, imaginary) {
  /**
   * @type {!number}
   * @private
   */
  this.real_ = real;

  /**
   * @type {!number}
   * @private
   */
  this.imaginary_ = imaginary;
};


/**
 * @param {!number} m
 * @param {!number} p
 * @return {!org.haodev.epicycle.ComplexNumber}
 */
org.haodev.epicycle.ComplexNumber.from = function(m, p) {
  return new org.haodev.epicycle.ComplexNumber(m * Math.cos(p), m * Math.sin(p));
};


/**
 * @return {!org.haodev.epicycle.ComplexNumber}
 */
org.haodev.epicycle.ComplexNumber.prototype.clone = function() {
  return new org.haodev.epicycle.ComplexNumber(this.real_, this.imaginary_);
};


/**
 * @return {!number}
 */
org.haodev.epicycle.ComplexNumber.prototype.real = function() {
  return this.real_;
};


/**
 * @return {!number}
 */
org.haodev.epicycle.ComplexNumber.prototype.imaginary = function() {
  return this.imaginary_;
};


/**
 * @param {!org.haodev.epicycle.ComplexNumber} n
 */
org.haodev.epicycle.ComplexNumber.prototype.add = function(n) {
  this.real_ += n.real();
  this.imaginary_ += n.imaginary();
};


/**
 * @param {!org.haodev.epicycle.ComplexNumber} n
 */
org.haodev.epicycle.ComplexNumber.prototype.multiply = function(n) {
  var a = this.real_;
  var b = this.imaginary_;
  var c = n.real();
  var d = n.imaginary();

  this.real_ = a * c - b * d;
  this.imaginary_ = a * d + b * c;
};


/**
 */
org.haodev.epicycle.ComplexNumber.prototype.negative = function() {
  this.real_ *= -1;
  this.imaginary_ *= -1;
};


/**
 * @return {!number}
 */
org.haodev.epicycle.ComplexNumber.prototype.magnitude = function() {
  return Math.sqrt((this.real_ * this.real_)
      + (this.imaginary_ * this.imaginary_));
};


/**
 * @return {!number}
 */
org.haodev.epicycle.ComplexNumber.prototype.phase = function() {
  return Math.atan2(this.imaginary_, this.real_);
};


/**
 * @return {!string}
 */
org.haodev.epicycle.ComplexNumber.prototype.str = function() {
  return '{' + this.real_ + ',' + this.imaginary_ + '}';
};
