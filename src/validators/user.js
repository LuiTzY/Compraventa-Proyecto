import {check} from 'express-validator';
import validateResult from '../helpers/ValidatorHelper.js'
// Esto sera un middleware para la validacion de los datos, por lo que primero se checkean los datos a validar y luego se pasa las funciones correspondiendentes
//Del middleware
const UserValidate = [
    // en cada indice se guarda el resultado de la validacion
    check('name').exists().not().isEmpty(),
    check('last_name').exists().not().isEmpty(),
    check('email').exists().isEmail(),
    check('password').exists().not().isEmpty(),
    check('roles').optional().isArray(),
    
    (req, res,next)=>{
        //Se pasa la req, res, next para que obtenga los valores de cada una en la peticion actual a la ruta
        validateResult(req, res, next);
    }
];
//Se exportan los middlewares de configuracion
export default UserValidate;

