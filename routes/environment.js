var express = require('express');
var router = express.Router();

var Environment = require('../models/environment');

// GET ALL BRANDS
router.get('/save', function(req, res, next) {

    // SAVE ENVIRONMENT
    var environment = Environment.schema.methods.save('cityFarmerId', req.body.temperature, req.body.humidity);
    environment.then(function() {

        // EMIT TO CLIENT
        io.emit('newEnvironment', { temperature: req.body.temperature, humidity: req.body.humidity });
        res.end();

    }, function(err) {

    // RETURN FALSE IF ERROR
    var json = JSON.stringify(false);
    res.json(json);

    });

});

module.exports = router;
