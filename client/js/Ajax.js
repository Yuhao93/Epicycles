goog.provide('org.haodev.epicycle.ajax');

goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");


/**
 * @param {string} path
 * @param {!Object} data
 * @param {function(!Object)} callback
 */
org.haodev.epicycle.ajax.post = function(path, data, callback) {
  var request = new goog.net.XhrIo();
  var data = goog.Uri.QueryData.createFromMap(new goog.structs.Map(data));

  goog.events.listen(request, 'complete', function() {
    if (request.isSuccess()) {
      var responseJson = request.getResponseJson()
      goog.asserts.assertObject(responseJson);
      callback(responseJson);
    } else {
      console.log(request);
    }
  });

  request.send(path, 'POST', data.toString());
};
