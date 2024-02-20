//Definir el modelo de el usuario
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdByIP:{
    type:String,
    default:null
  }
});
module.exports = mongoose.model("User", UserSchema);  