var express = require('express');
var passport = require('passport');
var session = require('express-session');

var path = require('path');
var PORT = process.env.PORT || 5000;

// DATA BASE CONNECTION
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/cityfarmersdb');

require('./config/passport');

var app = express();
var server = require('http').createServer(app).listen(8810);
var io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:  'mysupersecret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public' )));

var socketFarmer = io.of('/myFarmerId');
socketFarmer.on('connection', function(socket){

    console.log('Client connected!');
    
    socket.on('environment', function(msg) {
        console.log(msg);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnect!');
    });

});

// DEFINE ROUTES
var home = require('./routes/home');
var environment = require('./routes/environment');
var farmer = require('./routes/farmer');

// ROUTES
app.use('/', home);
app.use('/environment', environment);
app.use('/farmer', farmer);

// APP LISTENING
app.listen(PORT);
