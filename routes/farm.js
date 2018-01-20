var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');

// SOCKET INITIALIZATION MODULE
var io = express().get('socketio');
var socket = require('../socket/socket');
var jwt = require('jsonwebtoken');

// MODELS
var Farm = require('../models/farm');
var Farmer = require('../models/farmer');

// FARMER SIGN UP
router.post('/login', (req, res, next) => {

    var farmer = Farmer.schema.methods.find(req.body.email);
    farmer.then(farmer => {

        if(farmer == null) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        var passwordMatch = Farmer.schema.methods.validPassword(req.body.password, farmer.password);
        passwordMatch.then(hash => {

            // TOKEN GENERATION
            var token = jwt.sign({
                email: farmer.email,
                farmerId: farmer._id
            }, 
                process.env.SECRET,
            {
                expiresIn: '24h'
            });
            
            var io = req.app.get('socketio');
            socket.initializeFarm(io, farmer._id, req.body.farm);

            // PASSWORD MATCH
            res.status(200).json({
                message: 'Auth successful',
                farmerId: farmer._id,
                token: token
            });

        }).catch(err => {

            // RETURN ERROR
            res.status(401).json({
                message: 'Auth failed'
            });

        });

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            message: 'Auth failed'
        });

    });
    
});

// CREATE FARM
router.post('/create-farm', checkAuth, (req, res, next) => {

    var farm = Farm.schema.methods.save(req.body.farmerId, req.body.farmName);
    farm.then(farm => {

        var updateFarmer = Farmer.schema.methods.addFarm(farm.farmer, farm._id);
        updateFarmer.then(farmer => {

            // FARMER CREATED
            res.status(200).json({
                message: 'Farm was created'
            });

        }).catch(err => {

            // RETURN ERROR
            res.status(500).json({
                error: err
            });

        });
        
    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });

});

// GET FARMERS FARMS
router.post('/farms', checkAuth, (req, res, next) => {

    var farmerFarms = Farm.schema.methods.getFarms(req.body.farmerId);
    farmerFarms.then(farms => {

        // FARMER FARMS
        res.status(200).json(farms);

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });

});

module.exports = router;