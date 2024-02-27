import {model,Schema} from "mongoose";
//Modelo de subcategorias de los productos
const SubCategorySchema = new Schema({
    subCategory_name:{
        type:String,
        required:true,
        unique:true
    },
    category_name:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Categoria"
    }
},{
    timestamps:true,
    versionKey:false
  });
export default model("subCategory", SubCategorySchema);  