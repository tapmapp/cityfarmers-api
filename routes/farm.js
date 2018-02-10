var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');

// SOCKET INITIALIZATION MODULE
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

    var farm = Farm.schema.methods.save(req.body.farmerId, req.body.farmName, req.body.farmCity, req.body.farmCountry);
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

// GET FARM CONFIG
router.post('/farm-config', checkAuth, (req, res, next) => {

    var farmConfig = Farm.schema.methods.getFarmConfig(req.body.farmId);
    farmConfig.then(farmConfig => {

        // FARM CONFIG
        res.status(200).json(farmConfig);

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

// SET FAM
router.post('/set-lighting', checkAuth, (req, res, next) => {

    var newLighting = Farm.schema.methods.setLighting(req.body.farmId, req.body.lightingOn, req.body.lightingOff);
    newLighting.then(() => {

        res.status(201).json({
            message: 'New lighting configuration saved'
        })

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });

});

// SET FARM TEMPERATURE
router.post('/set-temperature', checkAuth, (req, res, next) => {

    var newTemperature = Farm.schema.methods.setTemperature(req.body.farmId, req.body.temperature);
    newTemperature.then(() => {

        // FARMER FARMS
        res.status(201).json({
            message: 'Temperature set at ' + req.body.temperature + ' ºC'
        });

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });

});

// SET FARM WATERING
router.post('/set-watering', checkAuth, (req, res, next) => {

    var newWatering = Farm.schema.methods.setWatering(req.body.farmId, req.body.watering);
    newWatering.then(() => {

        // FARMER FARMS
        res.status(201).json({
            message: 'Watering set at ' + req.body.watering + ' mins'
        });

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });

});

module.exports = router;