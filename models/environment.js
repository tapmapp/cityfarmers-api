var mongoose = require('mongoose');

var Farmer = require('./farmer');

var environmentSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    date: { type: Date, required: true }
});

var Environment = mongoose.model('Environment', environmentSchema);

// REMOVE CAMPAIGN
environmentSchema.methods.save = function (farmerId, temperature, humidity) {

  var environment = new Environment({
    farmer: farmerId,
    temperature: temperature,
    humidity: humidity,
    date: new Date()
  });

  return environment.save();

}

module.exports = Environment;