import userModel from '../models/user.js';
import Jwt from 'jsonwebtoken';
import roleModel  from '../models/role.js';
import 'dotenv/config'
//Controlador de acciones para el usuario
var userController = {
    test: (req,res)=>{
        return res.status(200).send({message:"User funciona correctamente"});
    },
    createUser: async (req,res)=>{
          // de la request que nos estan haciendo, tomamos lo que nos estan enviando por el body de la pagina
          const { name,last_name, email, password, roles } = req.body;

          try{
              /* Se hace una solicitud asincrona para determinar si el usuario ya existe, se utiliza await para saber la espera de este resultado,
              y para verificar la existencia de un usuario se utiliza el correo, ya que para cada usuario este va a ser unico 
              */
              
              const usuarioExistente = await userModel.findOne({email:email})
              //Si este existe no se creara uno nuevo
              if (usuarioExistente){
                  //Se envia un estado 409 que indica que ha habido un conflicto
                 return res.status(409).send({error:"Este correo ya esta siendo utilizado"})
              }       
              const encryptedPassword = await userModel.encryptPassword(password);
  
              const newUser = new userModel({
                  name: name,
                  last_name:last_name,
                  email: email,
                  password: encryptedPassword,
                  createdByIP:req.ip
              });
                // Se buscan los roles que se estan enviando 
              // esto me devolvera un arreglo con los ids de los roles encontrados en la peticion, si no encuentra devolvera un arr vacio [] 
              const foundRoles = await roleModel.find({name: {$in:roles}});
  
              //Verificar si el usuario no proporciona roles o proporciona un arreglo de roles vacios []
              if(!roles || roles.length === 0){
                  const role = await roleModel.findOne({name:"user"});
                  //Se guarda como un arr xq los roles su tipo de dato es un arreglo
                  //el error ocurre aqui, ya que no se pudo crear el usuario por lo que no puede leer un id invalido
                  newUser.roles = [role._id];
              }
              //Caso contrario
              else{
                  // se va recorrer el array que devuelva de los roles encontrados
                  newUser.roles = foundRoles.map(role => role._id);
              }
           
             
              const savedUser = await newUser.save();
              //en el caso de que no exista el correo en la base de datos, se va a crear un usuario y almacenar en la BD
           
              const token = await Jwt.sign({id:newUser._id},'compraventa',{expiresIn:84600});
              // Al el usuario ser creado se envia un token firmado con el id de este para solicitudes posteriores
              return res.status(201).send({user:token});
          }
          // se capturan posibles errores 
          catch(err){
              res.status(500).send({message:`Ha ocurrido un error para la creacion de un usuario: ${err}`})  
          }
    },
    getUsers: (req, res) => {
        // Se consulta a la base de datos para sacar todos los usuarios de la colección users
        userModel.find()
            .then(users => {
                // Si el largo de users es igual a 0, significa que no hay usuarios
                if (users.length === 0) {
                    return res.status(404).send({ message: "No se pueden obtener los usuarios" });
                }
                // Se envían los usuarios encontrados
                return res.status(200).send({ users });
            })
            .catch(err => {
                // Se capturan posibles errores
                return res.status(500).send({ message: `Ha ocurrido un error no se pueden obtener los usuarios ${err}` });
            });
    },
    getUserByid: (req, res) => {
        // Se obtiene el id del usuario a buscar de la req
        const { id } = req.params;
        // Se consulta el id del usuario a la bd
        userModel.findById(id)
            .then(user => {
                // Si el largo de user es 0 quiere decir que no encontró ningún usuario con el id proporcionado
                if (!user) {
                    return res.status(404).send({ message: "No se encontró ningún usuario con el ID proporcionado" });
                }
                // Se envía el usuario
                return res.status(200).send({ user });
            })
            // Se capturan posibles errores
            .catch(err => {
                return res.status(500).send({ message: `Ha ocurrido un error al obtener el usuario ${err}` });
            });
    },
    
    updateUserById: (req, res) => {
        // Se obtiene el ID del usuario de los parámetros de la solicitud
        const id = req.params.id;
        // Se obtienen los datos actualizados del usuario del cuerpo de la solicitud
        const userNewData = req.body;
    
        // Se actualiza el usuario en la base de datos
        userModel.findByIdAndUpdate(id, userNewData, { new: true })
            .then(updatedUser => {
                // Si no se encuentra ningún usuario con el ID proporcionado, se devuelve un error 404
                if (!updatedUser) {
                    return res.status(404).send({ message: "No se encontró ningún usuario con el ID proporcionado" });
                }
                // Se devuelve el usuario actualizado
                return res.status(200).send({ updatedUser });
            })
            .catch(err => {
                // Si ocurre un error durante la actualización del usuario, se maneja aquí
                console.error("Error al actualizar usuario por ID:", err);
                // Se devuelve un error 500 junto con el mensaje de error
                return res.status(500).send({ error: `Ha ocurrido un error con su solicitud: ${err.message}` });
            });
    },
    deleteUserById: (req, res) => {
        // Se obtiene el ID del usuario de los parámetros de la solicitud
        const id = req.params.id;
    
        // Se busca y elimina al usuario en la base de datos por su ID
        userModel.findByIdAndDelete(id)
            .then(deletedUser => {
                // Verificar si se encontró y eliminó al usuario correctamente
                if (!deletedUser) {
                    // Si no se encuentra ningún usuario con el ID proporcionado, se devuelve un error 404
                    return res.status(404).send({ message: "No se encontró ningún usuario con el ID proporcionado" });
                }
                // Si se eliminó correctamente el usuario, se devuelve un mensaje de éxito junto con el usuario eliminado
                return res.status(204).send({ message: "Usuario eliminado correctamente", deletedUser });
            })
            // Se capturan posibles errores durante la eliminación del usuario
            .catch(err => {
                // Se registra el error en la consola
                console.error("Error al eliminar usuario por ID:", err);
                // Se devuelve un error 500 junto con el mensaje de error
                return res.status(500).send({ error: `Ha ocurrido un error con su solicitud: ${err.message}` });
            });
    },
    resetPasswordByEmail: (req, res) => {
        // Se obtienen el correo electrónico y la nueva contraseña de los parámetros de la solicitud
        const { email } = req.params;
        const { password } = req.body;
    
        // Buscar al usuario por su correo electrónico en la base de datos
        userModel.findOne({ email })
            .then(async (user) => {
                // Verificar si el usuario existe en la base de datos
                if (!user) {
                    // Si no se encuentra ningún usuario con el correo electrónico proporcionado, se devuelve un error 404
                    return res.status(404).send({ message: "No se encontró ningún usuario con el correo electrónico proporcionado" });
                }
    
                // Actualizar la contraseña del usuario y guardar los cambios en la base de datos
                user.password = await userModel.encryptPassword(password);
                await user.save();
    
                // Se devuelve un mensaje de éxito indicando que la contraseña se actualizó correctamente
                return res.status(204).send({ message: "Contraseña actualizada correctamente" });
            })
            // Se capturan posibles errores durante el restablecimiento de la contraseña
            .catch((err) => {
                // Se registra el error en la consola
                console.error("Error al restablecer la contraseña:", err);
                // Se devuelve un error 500 junto con el mensaje de error
                return res.status(500).send({ error: `Ha ocurrido un error con su solicitud: ${err.message}` });
            });
    }
    
    
}

// se exporta la configuracion del controlador como un modulo para utilizar sus funciones en otros archivos requeridos
export default userController;