var express =  require('express');
var bodyParser = require('body-parser');
var app = express();

var userRoutes = require('./backend/router/user');

//Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);


module.exports = app;