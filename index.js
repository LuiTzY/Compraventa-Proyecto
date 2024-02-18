// Requiriendo modulos a utilizar
var app = require('./app')
var mongoose = require('mongoose')
const PORT = 8080

// Lanzar servidor con la conexion a la base de datos
mongoose.connect("mongodb://localhost:27017/compraventa")
.then(()=>{

    console.log("Se ha realizado correctamente la conexion a la base de datos")
    try{
    app.listen(PORT, ()=>{
        console.log(`Se creado la conexion en el servidor correctamente en el puerto ${PORT}`)
    })
    }
    catch(err){
        console.log(`No se ha podido hacer la conexion al servidor`)
    }
})
.catch((err)=>{
    console.log(`No se ha podido conectar a la base de datos ${err}`)
})






