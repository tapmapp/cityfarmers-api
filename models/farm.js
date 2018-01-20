var mongoose = require('mongoose');

var Farmer = require('./farmer');

var farmSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    name: { type: String, required: true }
});

var Farm = mongoose.model('Farm', farmSchema);

// CREATE FARM
farmSchema.methods.save = function (farmerId, farmName) {

    var id = mongoose.Types.ObjectId();

    var farm = new Farm({
        _id: id,
        farmer: farmerId,
        name: farmName
    });

    return farm.save();

}

// GET FARMS
farmSchema.methods.getFarms = function (farmerId) {
    return Farm.find({ farmer: farmerId }).exec();
}

module.exports = Farm;