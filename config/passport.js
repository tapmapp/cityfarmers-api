var passport = require('passport');
var Farmer = require('../models/farmer');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(farmer, done) {
    done(null, farmer.id);
});

passport.deserializeUser(function(farmerId, done) {
    Farmer.findById(farmerId, function(err, farmer) {
       done(err, farmer); 
    });
});

passport.use('local.signup', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    
}, function(req, email, password, done) {
    Farmer.findOne({'email': email}, function(err, farmer){

        if(err) {
            return done(err);
        }

        if(farmer) {
            return done(null, false, { message: 'Email is already in use' });
        }

        var newFarmer = new Farmer();
        newFarmer.email = email;
        newFarmer.password = newFarmer.encryptPassword(password);
        newFarmer.save(function(err, result){
            if(err) {
                return done(err);
            }
            return done(null, newFarmer);
        });

    });
}));