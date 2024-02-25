import mongoose from "mongoose";
import { config } from "dotenv";
config();
mongoose.connect(process.env.DATABASE_URL)
.then(db =>{
    console.log("Conexion exitosa a la base de datos");
})
.catch(err =>{
    console.log(`Ha ocurrido un error en la base de datos ${err}`);
})