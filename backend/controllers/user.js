const userModel = require('../models/user')

//Controlador de acciones para el usuario
var userController = {
    home: async (req,res)=>{
        return res.status(200).send({response:"!!API WORKS!!"})
    },
    // se define como una funcion asyncrona ya que hay operaciones que deben ser hechas y que no afecten el flujo de la peticion
    createUser: async (req, res) => {
        // de la request que nos estan haciendo, tomamos lo que nos estan enviando por el body de la pagina
        const { nombre, email, password } = req.body;

        try{
            /* Se hace una solicitud asincrona para determinar si el usuario ya existe, se utiliza await para saber la espera de este resultado,
            y para verificar la existencia de un usuario se utiliza el correo, ya que para cada usuario este va a ser unico 
            */
            
            const usuarioExistente = await userModel.findOne({where:{email:email}})
            //Si este existe no se creara uno nuevo
            if (usuarioExistente){
               return res.status(404).send({error:"Este correo ya esta siendo utilizado"})
            }
            //en el caso de que no exista el correo en la base de datos, se va a crear un usuario y almacenar en la BD
            const user = await userModel.create({
                nombre: nombre,
                email: email,
                password: password
            })
            // se envian los datos almacenados en la BD al servidor como respuesta
            return res.status(200).send({user:user})
        }
        // se capturan posibles errores 
        catch(err){
            res.status(500).send({message:`Ha ocurrido un error con la solicitud ${err}`})  
        }
       
    },
    updateUser:(req,res)=>{
        // se toman los parametros necesarios de la request para actualizar el usuario, en este caso el id del usuario
        const id = req.params.id;
        // se almacena en una constante los datos que van a ser actualizados
        const userNewData = req.body;
        userModel.update(userNewData, { where:{id_user: id} })
        .then((updatedUser)=>{
            
            return res.status(200).send({updatedUser:updatedUser})
        })
        .catch((err)=>{
            return res.status(500).send({error:`Ha ocurrido un error con su solicitud ${err}`})
        })
    
    },
    changePassword:  (req, res)=>{
        var email = req.params.email;
        var newPass =  req.body.password;
        userModel.update({password:newPass},{where:{email:email}})
        .then((passwordStored) =>{
            res.status(200).send({passwordStored:passwordStored})
        })
    }
}

// se exporta la configuracion del controlador como un modulo para utilizar sus funciones en otros archivos requeridos
module.exports = userController;