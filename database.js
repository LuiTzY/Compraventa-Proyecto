const { Sequelize } = require('sequelize');

//Creando la conexion a la bd
const sequelize = new Sequelize('compraventa_san_pedro','root','admin',{
    host:'localhost',
    dialect:'mysql',
    dialectModule: require('mysql2')
})

module.exports = sequelize;