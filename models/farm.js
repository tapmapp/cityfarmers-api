var mongoose = require('mongoose');

var Farmer = require('./farmer');

var farmSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    name: { type: String, required: true },
    system: { type: String, required: true, default: 'Aeroponics' },
    city: { type: String },
    country: { type: String },
    temperatureVent: { type: Number, required: true, default: 24 },
    watering: {type: Number, required: true, default: 5 },
    lightingOn: { type: String, required: true, default: '08:00' },
    lightingOff: { type: String, required: true, default: '22:00' },
    created: { type: Date, required: true, default: Date.now }
});

var Farm = mongoose.model('Farm', farmSchema);

// CREATE FARM
farmSchema.methods.save = function (farmerId, farmName, farmCity, farmCountry) {

    var id = mongoose.Types.ObjectId();

    var farm = new Farm({
        _id: id,
        farmer: farmerId,
        name: farmName,
        system: 'Aeroponic',
        city: farmCity,
        country: farmCountry,
        temperatureVent: 24,
        watering: 5,
        lightingOn: '08:00',
        lightingOff: '22:00'
    });

    return farm.save();

}

// GET FARMS
farmSchema.methods.getFarms = function (farmerId) {
    return Farm.find({ farmer: farmerId }).exec();
}

// SET FARM LIGHTING
farmSchema.methods.setLighting = function (farmId, lightingOn, lightingOff) {
    return Farm.update({ _id: farmId }, { $set: { lightingOn: lightingOn, lightingOff: lightingOff } });
}

// SET FARM TEMPERATURE
farmSchema.methods.setTemperature = function (farmId, temperature) {
    return Farm.update({ _id: farmId }, { $set: { temperatureVent: temperature } });
}

// SET FARM WATERING
farmSchema.methods.setWatering = function (farmId, watering) {
    return Farm.update({ _id: farmId }, { $set: { watering: watering } });
}


module.exports = Farm;