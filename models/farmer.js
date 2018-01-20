var mongoose = require('mongoose');
var bcrypt = require('bcrypt-as-promised');

var Farm = require('./farm');

var farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    farm: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Farm" },
    password: { type: String, required: true },
    state: { type: Boolean, required: true }
});

var Farmer = mongoose.model('Farmer', farmerSchema);

// CREATE ENCRYPTED PASSWORD
farmerSchema.methods.encryptPassword = function(password) {
    return bcrypt.hash(password, 10);
}

// CHECK IS PASSWORD MATCH
farmerSchema.methods.validPassword = function(password, farmerPassword) {
    return bcrypt.compare(password, farmerPassword);
}

// FIND FARMER BY EMAIL
farmerSchema.methods.find = function(email) {
    return Farmer.findOne({ email: email }).exec();
}

// CREATE FARMER
farmerSchema.methods.save = function (farmerName, farmerEmail, password) {

    var farmer = new Farmer({
        name: farmerName,
        email: farmerEmail,
        farm: [],
        password: password,
        state: false
    });

    return farmer.save();

}

// ADD FARM TO FARMER
farmerSchema.methods.addFarm = function (farmerId, farmId) {
    return Farmer.update({ _id: farmerId }, { $push: { farm: farmId } });
}

// DELETE FARMER
farmerSchema.methods.delete = function(farmerId) {
    return Farmer.remove({ _id: farmerId}).exec();
}

module.exports = Farmer;