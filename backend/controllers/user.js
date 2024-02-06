const userModel = require('../models/user')

var userController = {
    home: async (req,res)=>{
        return res.status(200).send({response:params})
    },
    createUser: async (req, res) => {
        const { nombre, email, password } = req.body;

        try{
            // Se hace una solicitud asincrona para determinar si el usuario ya existe
            const usuarioExistente = await userModel.findOne({where:{email:email}})
            //Si este existe no se creara uno nuevo
            if (usuarioExistente){
               return res.status(404).send({error:"Este correo ya esta siendo utilizado"})
            }

            const user = await userModel.create({
                nombre: nombre,
                email: email,
                password: password
            })

            return res.status(200).send({user:user})
        }
        catch(err){
            res.status(500).send({message:`Ha ocurrido un error con la soliciutd ${err}`})  
        }
       
    },
    updateUser:(req,res)=>{
        const id = req.params.id;
        const userNewData = req.body;
        userModel.update(userNewData, { where:{id_user: id} })
        .then((updatedUser)=>{
            return res.status(200).send({updatedUser:updatedUser})
        })
    
    }
}

module.exports = userController;