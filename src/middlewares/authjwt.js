import  Jwt from "jsonwebtoken";
import userModel from '../models/user.js';
import role from "../models/role.js";
import { config } from "dotenv";
config();
/*Este middleware sera utilizado en las rutas que requiera un usuario autenticado en nuestra base de datos
 y asi no permitimos que externos puedan hacer solictudes sin estar autenticados como por ejemplo, eliminar y actualizar*/


export const verifyToken = async(req, res,next)=>{
   try {
     //requiero el token que me envian por la cabecera llamada x-access-token, esta puede tener el nombre que yo prefiera
     const token = req.headers["x-access-token"];
     //Se verifica si existe un token en la cabecera llamada x-access-token, si este no esta el token se tomara comom no provided
     if(!token) return res.status(403).send({message:"No token provided"});
 
     /* se verifica el token enviado, aqui se encuentra el numero del token, su expiracion y
      esto devolvera la informacion enviada al momento de firmar el token en el controlador */
     const userTokenDecoded = Jwt.verify(token, process.env.JWT_SECRET_SING);
     /*con los datos obtenidos del token en userTokenDecoded, se hace una busqueda del id del usuario que contiene el 
     token verificado y se espera a que se haga una consulta para saber si este usuario es valido
     */
     console.log(userTokenDecoded)
     //Aqui se crea una nueva propiedad en la req llamada userId que tendra el id del usuario de userTokenDecoded
     req.userId = userTokenDecoded.id;
     const user = await userModel.findById(userTokenDecoded.id,{password:0});
     //El usuario no existe se devuelve la respuesta del que el usuario no es valido
     if(!user) return res.status(404).send({message:"User not found"});
 
     //Se pasa al siguiente middleware en el caso de que el id del usuario enviado por el token sea un usuario valido
     next();
   } 
   catch (error) {
    //Si ocurre un error es porque el token que se proveyo es invalido
    return res.status(500).send({message:"Unauthorized", error  });
   }
}

/*Tener en cuenta:
Estos son una serie de middlewares de express, por lo que tienen un orden al ejecutarse
el verifytoken se ejecuta primero lo que quiere decir que todos los middlewares ejecutados luego de este
tendran acesso al userId de la req, lo que quiere decir que es un usuario validado
*/
export const isAdmin = async (req, res, next) => {
    try {
        // Consultamos al modelo el id del token verificado
        const user = await userModel.findById(req.userId);
        console.log(user)
        // Si no existe el id del usuario verificado, se devuelve un user not found
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).send({ message: "User not found" });
        }
        // El id del usuario es válido, se consultan los roles que tiene este usuario
        const roles = await role.find({ _id: { $in: user.roles } });
        // Se itera en el arreglo de roles que devuelve roles, para ver los roles que tiene el usuario
        for (let i = 0; i < roles.length; i++) {
            // Si el rol actual es admin, sigue con los siguientes middlewares
            if (roles[i].name === "admin") {
                console.log("Usuario es administrador");
                // Se termina el bucle
                next();
                return;
            }
        }
        
        // El usuario no tiene roles de admin, lo que quiere decir que es un user
        console.log("Usuario no es administrador");
        return res.status(403).send({ message: "User role dont have this permisions" });
    } catch (error) {
        // Si ocurre un error, se maneja adecuadamente y se envía una respuesta de error
        console.error("Error en la función isAdmin:", error);
        return res.status(500).send({ error: `Ha ocurrido un error con su solicitud: ${error.message}` });
    }
}


export const isUser = async (req, res, next) => {
    try {
        // Consultamos al modelo el id del token verificado
        const user = await userModel.findById(req.userId);
        // Si no existe el id del usuario verificado, se devuelve un user not found
        if (!user) return res.status(404).send({ message: "User not found" });
        
        // El id del usuario es valido, se consultan los roles que tiene este usuario
        const roles = await role.find({ _id: { $in: user.roles } });
        console.log("Roles del usuario:", roles);
        
        // Se itera en el arreglo de roles que devuelve roles, para ver los roles que tiene el usuario
        for (let i = 0; i < roles.length; i++) {
            // Si el rol actual es user, continúa con los siguientes middlewares
            if (roles[i].name === "user") {
                console.log("El usuario tiene el rol 'User'");
                next();
                return;
                // Se termina el bucle
            }

        }
        
        // El usuario no tiene roles de user
        console.log("El usuario no tiene el rol 'User'");
        return res.status(403).send({ message: "User role required" });
    } catch (error) {
        // Si ocurre un error, se maneja adecuadamente y se envía una respuesta de error
        console.error("Error en la función isUser:", error);
        return res.status(500).send({ error: `Ha ocurrido un error con su solicitud: ${error.message}` });
    }
}