const { check } = require('express-validator');
const userValidatorHelpers = require('../helpers/userValidatorHelper');

// Esto sera un middleware para la validacion de los datos, por lo que primero se checkean los datos a validar y luego se pasa las funciones correspondiendentes
//Del middleware
const validateCreate = [
    // en cada indice se guarda el resultado de la validacion
    check('name').exists().not().isEmpty(),
    check('last_name').exists().not().isEmpty(),
    check('email').exists().isEmail(),
    //s
    (req, res,next)=>{
        //Se pasa la req, res, next para que obtenga los valores de cada una en la peticion actual a la ruta
        userValidatorHelpers(req, res, next);
    }
]
//Se exportan los middlewares de configuracion
module.exports = {validateCreate};

