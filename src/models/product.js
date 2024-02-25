import {model,Schema} from "mongoose";


//Modelo del producto
const ProductSchema =  new Schema({
    product_name:{
        type:String,
        required:true,
        unique:true
    },
    product_stock:{
        type:Number,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    //Este campo hara referencia a un id de una categoria creada 
    product_category:{
        type:String,
        ref: "Categoria"
    },
    product_price:{
        type:Number,
        default:0,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default model("Product", ProductSchema);
