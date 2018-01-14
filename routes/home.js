var express = require('express');
var router = express.Router();

// GET ALL BRANDS
router.get('/', function(req, res, next) {
    res.render(path.join(__dirname, 'views') + '/index.hbs');
});

module.exports = router;
