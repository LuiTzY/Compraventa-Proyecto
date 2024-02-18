const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema =  new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})
