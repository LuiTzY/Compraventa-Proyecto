import Jwt from 'jsonwebtoken';
import { config } from "dotenv";
import userModel from '../models/user.js';
import closedSession from '../models/closedSessions.js';
config();

// Lista negra para almacenar tokens invalidados
export const verifySingOut = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).send({ message: "No token provided" });

        // Verificar si el token es válido
        const userTokenDecoded = Jwt.verify(token, process.env.JWT_SECRET_SING);

        // Verificar si el usuario existe en la base de datos
        const userSignOut = await userModel.findById(userTokenDecoded.id,{password:0});
        if (!userSignOut) return res.status(404).send({message:"User not found"});

        const sessionToClose = new closedSession({session_removed:token})
        const session = await closedSession.findOne({session_removed:token})
        ;
        if(session){
            return res.status(409).send({ message: "Session already revoked" });
        }
        await sessionToClose.save();

       
        //Se invalida el token del usuario

        // Enviar respuesta con estado 204
        return res.status(204).send();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).send({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(403).send({ message: "Invalid token" });
        }

        return res.status(500).send({ message: `An error occurred: ${error.message}` });
        
    }
};

