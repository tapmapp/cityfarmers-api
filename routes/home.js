var express = require('express');
var router = express.Router();

// GET ALL BRANDS
router.get('/', function(req, res, next) {
    res.end();
});

module.exports = router;