const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();

var userRoutes = require('./backend/router/user');
var productoRoutes = require('./backend/router/producto');

//CORS
app.use(cors({
  origin:'*',
}))
//Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}, ${req}`);
    next();
  });

app.use((err, req, res, next)=>{
  if (err instanceof SyntaxError && req.status === 400 && 'body' in err){
    return res.status(200).send({format:"Formato de JSON invalido"})
  }
})


//Para descodificar datos que venga por url
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/producto', productoRoutes);


module.exports = app;