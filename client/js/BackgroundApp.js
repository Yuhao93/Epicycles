goog.provide('org.haodev.epicycle.BackgroundApp');

goog.require('org.haodev.epicycle.BaseApp');


/**
 * @extends org.haodev.epicycle.BaseApp
 * @constructor
 */
org.haodev.epicycle.BackgroundApp = function() {
  goog.base(this);
};
goog.inherits(org.haodev.epicycle.BackgroundApp, org.haodev.epicycle.BaseApp);



/** @override */
org.haodev.epicycle.BackgroundApp.prototype.draw = function(context) { };


/** @override */
org.haodev.epicycle.BackgroundApp.prototype.onMouseDown = function() { };


/** @override */
org.haodev.epicycle.BackgroundApp.prototype.onMouseUp = function() { };


/** @override */
org.haodev.epicycle.BackgroundApp.prototype.onMouseMove = function(points) { };
