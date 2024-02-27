//Este archivo se encargara de lanzar la aplicacion de express configurada en el app.js
// Requiriendo modulos a utilizar
import app from './app.js';
import './database.js';
import { config } from 'dotenv';
config();
const PORT = process.env.PORT;
try{
    app.listen(PORT, ()=>{
        console.log(`Se creado la conexion en el servidor correctamente en el puerto ${PORT}`)
    });
}
catch(err){
    console.log(`No se ha podido hacer la conexion al servidor ${err}`)
};