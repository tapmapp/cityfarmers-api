var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');

// SOCKET INITIALIZATION MODULE
var socket = require('../socket/socket');
var jwt = require('jsonwebtoken');

// MODELS
var Farmer = require('../models/farmer');
var Farm = require('../models/farm');

// FARMER SIGN UP
router.post('/signup', (req, res, next) => {

    var farmer = Farmer.schema.methods.find(req.body.email);
    farmer.then(farmer => {

        if(farmer != null) {

            // FARMER EXISTS
            return res.status(409).json({
                message: 'Farmer exists'
            });

        }

        var encryptedPassword = Farmer.schema.methods.encryptPassword(req.body.password);
        encryptedPassword.then(hash => {

            var newFarmer = Farmer.schema.methods.save(req.body.name, req.body.email, hash);
            newFarmer.then(farmer => {

                // FARMER CREATED
                res.status(201).json({
                    message: 'A farmer was created!',
                    createdFarmer: {
                        id: farmer._id,
                        name: farmer.name,
                        emai: farmer.email
                    }
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

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });
    
});

// FARMER LOGIN
router.post('/login', (req, res, next) => {

    var farmer = Farmer.schema.methods.find(req.body.email);
    farmer.then(farmer => {

        if(farmer == null) {
            return res.status(200).send({
                status: '401',
                message: 'Auth failed!'
            });
        }

        var passwordMatch = Farmer.schema.methods.validPassword(req.body.password, farmer.password);
        passwordMatch.then(hash => {

            var farmersFarm = Farm.schema.methods.getFarms(farmer._id);
            farmersFarm.then(farms => {

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
                socket.initialize(io, farmer._id, farms);

                // PASSWORD MATCH
                res.status(200).json({
                    status: '200',
                    message: 'Auth successful',
                    farmerId: farmer._id,
                    farmerName: farmer.name,
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
            res.status(401).json({
                message: 'Auth failed'
            });

        });

    }).catch(err => {

        // RETURN ERROR
        res.status(401).json({
            message: 'Auth failed'
        });

    });

});

router.get('/:farmerId', checkAuth, (req, res, next) => {
    
    var farmer = Farmer.schema.methods.findById(req.params.farmerId);
    farmer.then(farmer => {

        if(farmer == null) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        // PASSWORD MATCH
        res.status(200).json(farmer);

    }).catch(err => {

        // RETURN ERROR
        res.status(500).json({
            message: 'Auth failed'
        });

    });

});

// DELETE FARMER BY ID
router.delete('/:farmerId', (req, res, next) => {

    var farmer = Farmer.schema.methods.delete(req.body.farmerId);
    farmer.then(farmer => {
 
        // FARMER DELETED
        res.status(200).json({
            message: 'Farmer deleted'
        });

    }).cacth(err => {

        // RETURN ERROR
        res.status(500).json({
            error: err
        });

    });
});

module.exports = router;