import Jwt  from "jsonwebtoken";
import { config } from "dotenv";

config();
export const checkRefreshTokenExpiration = async (req,res,next)=>{
    //Se toma el refresh token enviado
    const refreshToken = req.headers["x-access-refresh-token"];
    //si no hay un token refresh, la solicitud no sigue
    if(!refreshToken){
        return res.status(401).send({
            message:"No refreshToken provided"
        });
    }

    try {
        //se verifica el token refresh enviado
        const decodedRefreshToken = await Jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY);
        
        //Si es invalido el token quiere decir que se firmo con otra secret key lo que dice que no es un token refresh si no otro tipo
    
        if(!decodedRefreshToken){
            return res.status(401).send({
                message:"Invalid RefreshToken"
            }); // se termina la solicitud con un 401
        }

        //Se genera el nuevo token de refresco y de acceso para el usuario lo que permitira renovar su sesion
        const newAccessToken = Jwt.sign({user:req.userId},process.env.JWT_SECRET_SING,{expiresIn:"1d"});
        const newRefreshToken = Jwt.sign({user:req.userId}, process.env.JWT_REFRESH_TOKEN_KEY,{expiresIn:"7d"});
        return res.status(201).send({
            token:newAccessToken,
            refreshToken:newRefreshToken
        });
        
    } catch (error) {
        //El token proporcionado ha expirado entonces, no es valido
        if(error.name === "TokenExpiredError"){
            return  res.status(403).send({
                message:"Token expired"
            });
        }
    }
};
// //Esta funcion es para los usuarios que inicien sesion y no tengan su token de refresco
// export const generateRefreshToken = async(req,res,next) =>{
//     const refreshToken = req.headers["x-access-refresh-token"];
//     if(!refreshToken){
//         try {
//             const newRefreshToken = Jwt.sign({user:req.userId}, process.env.JWT_REFRESH_TOKEN_KEY,{expiresIn:"7d"});
//             return res.status(201).send({
//                     token:req.headers["x-access-token"],
//                     refreshToken:newRefreshToken
//             });
//         } catch (error) {
//             return res.status(500).send({
//                 message:"Un error interno ha ocurrido"
//             });
//         }
//     }
    
   
// }
export const generateChangePasswordToken = async (req,res,next)=>{
    try {

        const passwordToken =  Jwt.sign({id:req.userId}, process.env.JWT_CHANGE_PASSWORD_KEY, {expiresIn:"10m"});
        return res.status(201).send({passwordToken: passwordToken});
        

    } catch (error) {
        return res.status(500).send({
            message:`Ha ocurrido un error con la solicitud ${error}`
        });
    }

}
export const checkPasswordToken = async(req,res,next)=>{
    const passwordToken = req.headers["x-password-access-token"];
    if(!passwordToken){
        return res.status(401).send({
            message:"No password token provided"
        });
    }
    try {
        const userPasswordToken = await Jwt.verify(passwordToken, process.env.JWT_CHANGE_PASSWORD_KEY);
        if(!userPasswordToken){
            return res.status(401).send({
                message:"Invalid password token"
            });
        }
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return  res.status(403).send({
                message:"Token expired"
            });
        }
    }
  

}