// Requiriendo modulos a utilizar
var app = require('./app')
var sequelize = require('./database')
const PORT = 8080

// Lanzar servidor con la conexion a la base de datos
app.listen(PORT, ()=>{
    try{
        //Verificando si la conexion ha sido realizada
        sequelize.authenticate();
        sequelize.sync({ force: true })
    }
    catch(err){
        console.log(`Ha ocurrido un error con la conexion a la base de datos ${err}`)
    }
    console.log(`El servidor se ha iniciado correctamente en el puerto ${PORT}`)
})


