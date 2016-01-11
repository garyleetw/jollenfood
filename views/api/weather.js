'use strict';

exports.read = function(req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    workflow.emit('read');
  });   

  workflow.on('read', function() {
    req.app.db.models.Weather.find({}, function(err, data) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.data = data;
      workflow.emit('response');
    });
  });

  return workflow.emit('validate');
};

exports.readByQuery = function(req, res, next) {
  var q = req.params.q;
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    workflow.emit('read');
  });   

  workflow.on('read', function() {
    req.app.db.models.Weather.aggregate([
        { $sort: { "userCreated.time": -1 } },
        { $limit: 1 }
      ], function(err, data) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.coord = data[0].coord;
      workflow.outcome.main = data[0].main;

      workflow.emit('response');
    });
  });

  return workflow.emit('validate');
};