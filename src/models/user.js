//Definir el modelo de el usuario
import {model,Schema} from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  last_name:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength:[4," La contraseña debe incluir minimo de 4 caracteres"]
  },
  createdByIP:{
    type:String,
    default:null
  },
  //Es un json de roles xq el usuario puede tener varios roles
  roles:[{
    ref:'Role',
    type:Schema.Types.ObjectId
  }]
},{
  timestamps:true,
  versionKey:false
});
userSchema.statics.encryptPassword = async (password)=>{
  try{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)

  }
  catch(err){
    return err
  }
}
userSchema.statics.comparePasswords =  (password, receivedPassword)=>{
  return  bcrypt.compareSync(password, receivedPassword);   
}

export default model("User", userSchema);  