var mongoose = require('mongoose');

var Farmer = require('./farm');
var Farmer = require('./farmer');

var environmentSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true }
});

var Environment = mongoose.model('Environment', environmentSchema);

// REMOVE CAMPAIGN
environmentSchema.methods.save = function (farmerId, farmId, temperature, humidity) {

  var environment = new Environment({
    farmer: farmerId,
    farm: farmId,
    temperature: temperature,
    humidity: humidity,
    date: new Date()
  });

  return environment.save();

}

// GET DATE PERIOD
environmentSchema.methods.getPeriod = function(farmId, fromDate, toDate) {

  return Environment.find({ farm: farmId }).where({ 
    date: {
      $gte: new Date(fromDate),
      $lt: new Date(toDate)
    }
  }).sort({date:-1});

}

module.exports = Environment;