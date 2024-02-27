import {model,Schema} from "mongoose";

//modelo de categoria para los productos
const CategorySchema =  new Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps:true,
    versionKey:false
  });

// Exportar el modelo de categoría con el esquema definido
export default model("Categoria", CategorySchema);