const {validationResult} = require('express-validator');

const validateResult = (req, res, next)=>{
    try{
        //Verifica si hay errores de validaciones y si hay los tira
        validationResult(req).throw();
        //Sigue al proximo middleware
        return next();
    }
    catch(err){
        //se capturan los errores y en se envian en forma de un array
        return res.status(403).send({errors:err.array()})
    }
}
module.exports = validateResult;