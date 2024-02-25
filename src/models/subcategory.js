import {model,Schema} from "mongoose";

const SubCategorySchema = new Schema({
    subCategory_name:{
        type:String,
        required:true,
        unique:true
    },
    category_name:{
        type:String,
        required:true,
        ref:"Categoria"
    }
});
export default model("subCategory", SubCategorySchema);  