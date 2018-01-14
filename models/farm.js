var mongoose = require('mongoose');

var Farmer = require('./farmer');

var farmSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    name: { type: String, required: true }
});

var Farm = mongoose.model('Farm', farmSchema);

// CREATE FARM
farmSchema.methods.save = function (farmerId, name) {

    var farm = new Farm({
        farmer: farmerId,
        name
    });

    return farm.save();

}

// GET FARM
farmSchema.methods.get = function (farmerId) {

    return Farm.findById(farmerId);

}

module.exports = Farm;