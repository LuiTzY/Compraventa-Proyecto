const bcrypt = require('bcrypt');

const hashFunctions = {
    hashPassword:(req,res,next)=>{
        const password = req.body.password;
        if(!password || password.length === 0 ){
           return res.status(400).send({passwordRequired:"Contraseña invalida"})
        }
        else{
            //Se encripta la password con un salt de 10
            bcrypt.hash(password, 10)
            .then(passwordHashed=>{
                //Se envia la password encriptada al cuerpo de la solicitud 
                req.body.password = passwordHashed;
                //Se sigue al siguiente middleware para procesar la creacion del usuario
                next();
            })
            //Se controlan posibles errores
            .catch(err =>{
                return res.status(500).send(`No se puede encriptar su contraseña ${err}`);
            })
        };
    }

}
module.exports =  hashFunctions;