var express = require('express');
var bodyParser = require('body-parser');
var htmlserver = require('./html');
var resourceserver = require('./res');
var db = require('./db');

var port = process.env.PORT || 8000;
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get(/^\/(index)?$/, wrapAssertion(htmlserver.serveStandard));
app.get(/^\/draw$/, wrapAssertion(htmlserver.serveStandard));
app.get(/^\/epicycles\/.+$/, wrapAssertion(htmlserver.serveEpicycles));
app.get(/^\/load\/.+$/, wrapAssertion(htmlserver.serveLoadedEpicycles));
app.get(/^\/(js|css|img|fonts)\/.+$/, wrapAssertion(resourceserver.serveResource));

app.post(/^\/addEpicycle$/, wrapAssertion(addEpicycle));

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

function assertExists(key, pattern, req, resp) {
  var value = req.body[key];
  if (key == undefined || key == null || !pattern.test(value)) {
    throw {'type': 'BAD_REQUEST', 'msg': 'Missing or poorly formatted: {' + key + ',' + value + '}'};
  } else {
    return value;
  }
}

function wrapAssertion(func) {
  return function(req, resp) {
    if (req.path.indexOf('/epicycles/') == 0 || req.path.indexOf('/load/') == 0) {
      resp.header("Access-Control-Allow-Origin", "*");
      resp.header("Access-Control-Allow-Headers", "X-Requested-With");
    }
    try {
      func(req, resp);
    } catch (e) {
      if (e.type == 'BAD_REQUEST') {
        resp.status(400).send(e.msg);
      } else {
        throw e;
      }
    }
  }
}

function addEpicycle(req, resp) {
  // Array of floats
  var circles = assertExists('circles', /^\s*\[(-?[0-9]*(\.[0-9]+)?)(\s*,\s*-?[0-9]*(\.[0-9]+)?)*\]\s*$/, req, resp);
  circles = circles.trim();
  var scale = parseInt(assertExists('scale', /^[0-9]+$/, req, resp));
  var arr = eval(circles);
  db.addEpicycle(arr, scale, function(err, docs) {
    if (err || !docs || docs.length == 0) { return resp.sendStatus(400); }
    resp.status(200).type('application/json').send({'success': true, 'id': docs[0]._id });
  });
}
