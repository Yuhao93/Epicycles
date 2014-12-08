goog.provide('org.haodev.epicycle.Launcher');

goog.require('org.haodev.epicycle.DrawingApp');
goog.require('org.haodev.epicycle.EpicyclesApp');
goog.require('org.haodev.epicycle.State');


/**
 * @param {!org.haodev.epicycle.State} state
 * @param {*} data
 * @constructor
 */
org.haodev.epicycle.Launcher = function(state, data) {
  /** @private {!org.haodev.epicycle.BaseApp} */
  this.app_;
  switch (state) {
    case org.haodev.epicycle.State.DRAWING:
      this.app_ = new org.haodev.epicycle.DrawingApp();
      break;
    case org.haodev.epicycle.State.EPICYCLES:
      this.app_ = new org.haodev.epicycle.EpicyclesApp(data);
      break;
    case org.haodev.epicycle.State.BG:
      this.app_ = new org.haodev.epicycle.BackgroundApp();
      break;
    default:
      throw 'Unknown state ' + state;
  }
};
