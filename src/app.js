//Este archivo es la configuracion del servidor de express
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js';
import productoRoutes from './routes/product.js';
import categoriaRoutes from './routes/categoria.js';
import {createRoles} from './helpers/initialSetup.js';
var app = express();
//Al iniciar el servidor se crean los roles si estos no existen
//Con la finalidad de autenticar rutas y otorgar permisos de los usuarios
createRoles();

//CORS
//Se permiten hacer solicitudes por cualquier origen
app.use(cors({
  origin:'*',
}));
//Middleware

//Se utiliza helmet para colocar las cabeceras del servidor
app.use(helmet());

//Middleware para ver las perticiones que me hacen, su metodo y la ip
app.use((req, res, next) => {
    console.log(`Request method: ${req.method} Request url: ${req.url}, ip address: ${req.ip}`);
    next();
  });


//Para descodificar datos que venga por url
app.use(express.urlencoded({extended:false}));
//Decirle al servidor que convierta la informacion a formato json
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
      return res.status(400).send({ format: "Formato de JSON inválido" });
  }
  next();
});
//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/producto', productoRoutes);
app.use('/api/categoria', categoriaRoutes);



// Ruta no existente
app.use((req, res) => {
  return res.status(404).send({ NotFound: "Ruta no encontrada" });
});

//Se exporta la configuracion del servidor 
export default app;