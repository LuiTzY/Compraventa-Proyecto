const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();

var userRoutes = require('./backend/router/user');
var productoRoutes = require('./backend/router/product');
var categoriaRoutes = require('./backend/router/categoria')

//CORS
app.use(cors({
  origin:'*',
}))
//Middleware
app.use((req, res, next) => {
    console.log(`Request method: ${req.method} Request url: ${req.url}, ip address: ${req.ip}`);
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
app.use('/api/categoria', categoriaRoutes);

module.exports = app;