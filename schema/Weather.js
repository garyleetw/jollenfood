'use strict';

exports = module.exports = function(app, mongoose) {
  var weatherSchema = new mongoose.Schema({
    coord: {
      lon: { type: Number },
      lat: { type: Number }
    },

    main: {
      temp: { type: Number },
      humidity: { type: Number }
    },

    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  app.db.model('Weather', weatherSchema);
};
