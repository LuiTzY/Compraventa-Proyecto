import {model,Schema} from "mongoose";

// Definición del esquema para el modelo de categoría
const CategorySchema =  new Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exportar el modelo de categoría con el esquema definido
export default model("Categoria", CategorySchema);