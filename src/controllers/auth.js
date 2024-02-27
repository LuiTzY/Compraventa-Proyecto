import userModel from '../models/user.js';
import Jwt from 'jsonwebtoken';
import roleModel  from '../models/role.js';
import { config } from "dotenv";
config();

const authController = {
    test: async (req,res)=>{
        
        return res.status(200).send({response:"Auth funciona correctamente"})
    },
    // se define como una funcion asyncrona ya que hay operaciones que deben ser hechas y que no afecten el flujo de la peticion
    signIn: async (req, res) => {
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
            if(!roles || roles.length === 0 || roles.includes("admin") ){ //El usuario solo puede asignarse un rol de admin, pero si sucede se le cambia al de un user
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

            const token = await Jwt.sign({id:newUser._id},process.env.JWT_SECRET_SING,{expiresIn:84600});
            const refreshToken = await Jwt.sign({id:newUser._id}, process.env.JWT_REFRESH_TOKEN_KEY, {expiresIn:"7d"});
            
            const savedUser = await newUser.save();         
            
            // Al el usuario ser creado se envia un token firmado con el id de este para solicitudes posteriores
            return res.status(201).send({
                token:token,
                refreshToken:refreshToken
            });
        }
        // se capturan posibles errores 
        catch(err){
            res.status(500).send({message:`Ha ocurrido un error para la creacion de un usuario: ${err}`})  
        }
       
    },
    signUp:async(req,res)=>{

        // Se requieren los datos necesarios para validar el incio de sesion
        const {email} = req.params;
        const {password} = req.body;

        /*Se hace una solicitud a la bd para obtener los datos del email introducido
        Se hace un populate para llenar los campos de roles con sus propiedades, es decir antes
        solo devolvia el id del rol, ahora devuelve el nombre del rol y el id, esto para poder 
        */
        const userFound = await userModel.findOne({email:email}).populate("roles");
        
        //Si el usuario no se encuentra se enviara esta respuesta
        if(!userFound){
            return res.status(400).send({message:"El usuario no existe"})
        }
       
        //Devolvera true si son iguales, false sino
        const matchPassword = await userModel.comparePasswords(password, userFound.password);

        if(!matchPassword) return res.status(401).send({token:null, message:"Contraseña incorrecta"})

        //Se firma un token para el usuario cada vez que inicie sesion
        const token = Jwt.sign({id:userFound._id},process.env.JWT_SECRET_SING,{expiresIn:86400});
        const refreshToken = await Jwt.sign({id:userFound._id}, process.env.JWT_REFRESH_TOKEN_KEY, {expiresIn:"7d"});

        //Se envia el token al servidor 
        return res.status(200).send({token:token, refreshToken:refreshToken});
    },
    changeRoleById: async (req,res)=>{
        const {id} = req.params;
        const {roles} = req.body;
        try {
            const user = await userModel.findById(id);
            if(!user){
                return res.status(404).send({
                    message:"User ID not found"
                });
            }
            for(let rol of roles){
                if(rol === "admin"){
                    console.log(`este es el rol ${rol}`)
                    await user.updateOne({name:rol});
                    return res.status(201).send({
                        message:`Updated to role ${rol}`
                    });
                }
                else{
                    await userModel.updateOne({name:rol});
                    return res.status(201).send({
                        message:`Updated to role ${rol}`
                    });
                };

            }
        } catch (error) {
            return res.status(500).send({
                message:`Cannot change role ${error}`
            });
        }
        
    }
}
export default authController;