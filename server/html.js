var fs = require('fs');
var db = require('./db');
var mapping = eval('(' + fs.readFileSync('server/config/htmlbindings.json').toString() + ')');

var header = fs.readFileSync('client/html/header.html').toString();
var footer = fs.readFileSync('client/html/footer.html').toString();

function serve(key, dataMap, resp) {
  if (!dataMap['header']) {
    dataMap['header'] = header;
  }

  if (!dataMap['footer']) {
    dataMap['footer'] = footer;
  }

  if (mapping[key]) {
    fs.readFile('client/html/' + mapping[key], function(err, data) {
      if (err) {
        return resp.sendStatus(404);
      }
      var content = data.toString();
      for (var dataKey in dataMap) {
        var dataValue = dataMap[dataKey];
        content = content.replace(new RegExp('\\{\\{' + dataKey + '\\}\\}', 'g'), dataValue);
        content = content.replace(new RegExp('\\{\\{addslashes\\(' + dataKey + '\\)\\}\\}', 'g'), addslashes(dataValue));
      }
      resp.status(200).type('html').send(content);
    });
  } else {
    resp.sendStatus(404);
  }
}

function serveLoadedEpicycles(req, resp) {
  var parts = req.path.split('/');
  var path = '/' + parts[1];
  db.getEpicycle(parts[2], function(err, docs) {
    if (err || !docs || docs.length == 0) {
      return resp.sendStatus(404);
    }
    serve(path, { 'data': JSON.stringify(docs[0]) }, resp);
  });
}

function serveEpicycles(req, resp) {
  var parts = req.path.split('/');
  var path = '/' + parts[1];
  serve(path, { 'data': '\'' + parts[2] + '\'' }, resp);
}

function serveStandard(req, resp) {
  serve(req.path, {}, resp);
}

function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}

exports.serveLoadedEpicycles = serveLoadedEpicycles;
exports.serveEpicycles = serveEpicycles;
exports.serveStandard = serveStandard;
