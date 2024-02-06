const userModel = require('../models/user')

var userController = {
    home: (req,res)=>{
        return res.status(200).send({response:params})
    },
    createUser: async (req, res) => {
        const { nombre, email, password } = req.body;
    
        try {
            const user = await userModel.create({
                nombre: nombre,
                email: email,
                password: password
            });
    
            return res.status(200).send({ user: user });
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return res.status(500).send({ message: 'Ha ocurrido un problema con el servidor' });
        }
    },
    updateUser:(req,res)=>{
        const { id, email, password } = req.body;
        try{
            userModel.update()
        }
        catch(err){
            console.log(`Ha ocurrido un error ${err}`)
        }
    }
}

module.exports = userController;