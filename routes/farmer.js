var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

// FARMER MODEL
var Farmer = require('../models/farmer');

// GET ALL BRANDS
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
}));

router.get('/signup', function(req, res, next){
    res.render('farmer/signup', { csrfToken: req.csrfToken() });
});

module.exports = router;
