var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Farm = require('./farm');

var farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    farms: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Farm", required: true },
    password: { type: String, required: true},
    state: { type: Boolean, required: true }
});

var Farmer = mongoose.model('Farmer', farmerSchema);

// CREATE ENCRYPTED PASSWORD
farmerSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

// CHECK IS PASSWORD MATCH
farmerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// CREATE FARMER
farmerSchema.methods.save = function (farmerName, farmerEmail) {

    var farmer = new Farm({
        name: farmerName,
        email: farmerEmail,
        state: true
    });

    return farmer.save();

}

// GET FARMER
farmerSchema.methods.get = function (farmerId) {

    return Farm.findById(farmerId);

}

// CONNECT FARMER
farmerSchema.methods.connectFarmer = function (farmerEmail, farmerPassword) {



}

module.exports = Farmer;