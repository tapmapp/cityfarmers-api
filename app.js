var express = require('express');

var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

var config = require('./config/env');

var PORT = process.env.PORT || config.PORT;
process.env.SECRET = config.SECRET;
process.env.SOCKET_PORT = config.SOCKET_PORT;

// DATA BASE CONNECTION
var mongoose = require('mongoose');
mongoose.connect(config.databaseProd);

// DEFINE ROUTES
var home = require('./routes/home');
var environment = require('./routes/environment');
var farmer = require('./routes/farmer');
var farm = require('./routes/farm');

var app = express();

// APP LISTENING
var server = app.listen(PORT);
console.log('listening: ' + server.address().port);

// SOCKET LIBRARY
var io = require('socket.io').listen(server);
app.set('socketio', io);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();

});

// ROUTES
app.use('/', home);
app.use('/environment', environment);
app.use('/farmer', farmer);
app.use('/farm', farm);

app.get('/favicon.ico', function(req, res) {
    res.status(204);
});

app.use((req, res, next) => {
    var error = new Error('Not found');
    error.status = 404;
    next(error);
});

// ERROR HANDLER
app.use((error, req, res, next) => {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });

});
