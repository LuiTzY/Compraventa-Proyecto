import {check} from 'express-validator';
import validateResult from '../helpers/ValidatorHelper.js'
// Esto sera un middleware para la validacion de los datos, por lo que primero se checkean los datos a validar y luego se pasa las funciones correspondiendentes
//Del middleware
const ProductValidate = [
    // en cada indice se guarda el resultado de la validacion
    check('product_name').exists().not().isEmpty(),
    check('product_stock').exists().not().isEmpty(),
    check('product_description').exists().not().isEmpty(),
    check('product_category').exists().not().isEmpty(),
    check('product_price').exists().not().isEmpty(),
    
    (req, res,next)=>{
        //Se pasa la req, res, next para que obtenga los valores de cada una en la peticion actual a la ruta
        validateResult(req, res, next);
    }
]
//Se exportan los middlewares de configuracion
export default ProductValidate;

