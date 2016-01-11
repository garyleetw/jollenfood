'use strict';

exports = module.exports = function(app, mongoose) {
  var postSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  app.db.model('Post', postSchema);
};
