//Middleware para verificar el inicio de sesion
import {ROLES} from '../models/role.js';
import user from '../models/user.js';

export const checkDuplicateEmail = async (req,res)=>{
    const emailUser = await user.findOne({email:req.body.email});
    if(emailUser){
        return res.status(409).send({
            message:"User already exists"
        });
    }
}
export const checkRolesExists = async (req, res, next)=>{
    if(req.body.roles){
        for(let i = 0; i < req.body.roles.length; i++){
            
            if(!ROLES.includes(req.body.roles[i])){
                return res.status(404).send({
                    message: `Roles ${req.body.roles[i]} doesnt exist`
                });
            }
        }
    }
    next();
}