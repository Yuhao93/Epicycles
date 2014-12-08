var client = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var fs = require('fs');

var url = fs.readFileSync('server/config/mongologin.txt').toString().trim();

var db = null;
client.connect(url, function(err, database) {
  logOnErr(err);
  db = database;
});

function logOnErr(err) {
  if (err) {
    console.log(err);
  }
}

function find(collection, query, callback) {
  collection.find(query).toArray(callback);
}

function collection(collectionName, callback) {
  var collection = db.collection(collectionName);
  if (collection) {
    callback(null, collection);
  } else {
    callback(collectionName + ' collection not found');
  }
}

function addEpicycle(circles, scale, callback) {
  var obj = {
    'circles': circles,
    'scale': scale
  };
  collection('epicycles', function(err, collection) {
    if (err) {
      logOnErr(err);
      return callback(err);
    }
    collection.insert(obj, callback);
  });
}

function getEpicycle(id, callback) {
  collection('epicycles', function(err, collection) {
    if (err) {
      logOnErr(err);
      return callback(err);
    }
    find(collection, { '_id': objectId(id) }, callback);
  });
}

exports.addEpicycle = addEpicycle;
exports.getEpicycle = getEpicycle;
