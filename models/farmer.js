var mongoose = require('mongoose');
var bcrypt = require('bcrypt-as-promised');

var Farm = require('./farm');

var farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    farm: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Farm" },
    password: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    img: { type: String },
    state: { type: Boolean, required: true, default: false },
    created: { type: Date, required: true, default: Date.now }
});

var Farmer = mongoose.model('Farmer', farmerSchema);

// CREATE ENCRYPTED PASSWORD
farmerSchema.methods.encryptPassword = function(password) {
    return bcrypt.hash(password, 10);
}

// CHECK IF PASSWORD MATCH
farmerSchema.methods.validPassword = function(password, farmerPassword) {
    return bcrypt.compare(password, farmerPassword);
}

// FIND FARMER BY EMAIL
farmerSchema.methods.find = function(email) {
    return Farmer.findOne({ email: email }).exec();
}

// FIND FARMER BY ID
farmerSchema.methods.findById = function(id) {
    return Farmer.findOne({ _id: id }).populate({
        path:'farm',
        model: 'Farm'
    }).exec();
}

// CREATE FARMER
farmerSchema.methods.save = function (farmerName, farmerEmail, password) {

    var farmer = new Farmer({
        name: farmerName,
        email: farmerEmail,
        farm: [],
        city: '',
        country: '',
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