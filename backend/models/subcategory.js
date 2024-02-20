const moongose = require('mongoose');
const Schema = moongose.Schema;

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
module.exports = mongoose.model("subCategory", SubCategorySchema);  