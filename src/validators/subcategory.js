import {check} from 'express-validator';
import validateResult from '../helpers/ValidatorHelper.js'
// Esto sera un middleware para la validacion de los datos, por lo que primero se checkean los datos a validar y luego se pasa las funciones correspondiendentes
//Del middleware
const SubCategoryValidate = [
    // en cada indice se guarda el resultado de la validacion
    check('subCategory_name').exists().not().isEmpty(),
    check('subCategory_name').exists().not().isEmpty(),
    (req, res,next)=>{
        //Se pasa la req, res, next para que obtenga los valores de cada una en la peticion actual a la ruta
        validateResult(req, res, next);
    }
]
//Se exportan los middlewares de configuracion
export default SubCategoryValidate;

