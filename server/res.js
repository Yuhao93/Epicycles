var fs = require('fs');

var rawMapping = eval('(' + fs.readFileSync('server/config/rawtypes.json') + ')')

function getResource(filename, resp) {
  var extensionParts = filename.split('.');
  var extension = extensionParts[extensionParts.length - 1].toLowerCase();
  fs.readFile('client' + filename, function(err, data) {
    if (err) {
      return resp.sendStatus(404);
    }
    if (rawMapping.indexOf(extension) >= 0) {
      resp.status(200).type(extension).send(data);
    } else {
      resp.status(200).type(extension).send(data.toString());
    }
  });
}

function serveResource(req, resp) {
  getResource(req.path, resp);
}

exports.serveResource = serveResource;
