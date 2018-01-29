var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');

var Environment = require('../models/environment');

// SAVE ENVIRONMENT VALUES
router.post('/save', checkAuth, (req, res, next) => {

    // SAVE ENVIRONMENT
    var environment = Environment.schema.methods.save(req.body.farmerId, req.body.farm, req.body.temperature, req.body.humidity);
    environment.then(() => {

        // SOCKET INSTANCE
        var io = req.app.get('socketio');
        var socketFarmer = io.of('/' + req.body.farmerId);
        
        socketFarmer.in(req.body.farm).emit('platform-environment', { room: req.body.farm, temperature: req.body.temperature, humidity: req.body.humidity });

        // PASSWORD MATCH
        res.status(200).json({
            message: 'Environment saved!'
        });

    }).catch(err => {

        // RETURN ERROR
        res.status(400).json({
            error: err
        });

    });

});

router.get('/test', checkAuth, (req, res, next) => {
    res.send('works!');
});

module.exports = router;
