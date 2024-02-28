import subCategoryModel from '../models/subcategory.js';
import categoryModel from '../models/categoria.js';
import mongoose from 'mongoose';
const subCategoryController = {
    test:(req,res)=>{
        return res.status(200).send({message:"Subcategory funciona correctamente"});
    },
    createSubCategory:async(req,res)=>{

    try {
            const {subCategory_name, category_name} = req.body;
            const categoria = await categoryModel.findById(category_name);
            if(!categoria){
                return res.status(404).send({message:`Category ID not found`});
            }
            const subCategory = await subCategoryModel.findOne({name:subCategory_name});
            if(subCategory){
                return res.status(403).send({message:` ${subCategoRY_name} already exists`});
            }
            const newSubcategory = new subCategoryModel({
                subCategory_name:subCategory_name,
                category_name:categoria._id
            });

        await newSubcategory.save();
        return res.status(201).send({subCategory:newSubcategory});
    }
    catch (error) {
            return res.status(500).send({message:`No se ha podido crear su subCategoria ${error}`})
        }
        
    },
    updateCategoryById: async(req,res)=>{
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({ message: "El ID de la subcategoria proporcionado no es válido" });
            }   
            // Verificar si la subcategoría a actualizar existe en la base de datos
            const subCategory = await subCategoryModel.findById(id);

            if(!subCategory){
                return res.status(404).send({message:"Category ID not found"})
            }
            const subCategoryToUpdate = req.body
            // Actualizar la categoría
            await subCategoryModel.updateOne({ _id: id }, { $set: subCategoryToUpdate });

            return res.status(201).send({ message: "SubCategoría actualizada exitosamente" });

        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error no se puede actualizar la subCategoria: ${err}` });
        }
    },
    getSubCategorys: async (req, res) => {
        try {
            // Obtener todas las categorías de la base de datos
            const subCategorys = await subCategoryModel.find();

            if (!subCategorys) {
                return res.status(404).send({ message: 'No se pueden obtener las categorías' });
            }

            return res.status(200).send({ subCategorys: subCategorys });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error con el servidor: ${err}` });
        }
    },
     // Método para eliminar una subcategoría
     deleteSubCategoryById: async (req, res) => {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "El ID de la subcategoria proporcionado no es válido" });
        } 
        try {
            // Verificar si la subcategoría a eliminar existe en la base de datos
            const subCategoryExists = await subCategoryModel.findOne({ _id: id });

            if (!subCategoryExists) {
                return res.status(404).send({ error: "No se puede eliminar la categoría ya que no existe" });
            }

            // Eliminar la categoría
            const subCategoryDeleted = await subCategoryModel.deleteOne({ _id: id });

            if (subCategoryDeleted.deletedCount === 0) {
                return res.status(409).send({ message: "No se ha podido eliminar la subcategoría" });
            }

            return res.status(201).send({ message: "Categoría eliminada exitosamente" });
        } catch (err) {
            return res.status(500).send({ message: `Ha ocurrido un error con el servidor: ${err}` });
        }
    },
    getSubCategoryById: async(req, res)=>{
        
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({ message: "El ID de la subcategoria proporcionado no es válido" });
            }   
            const Subcategory = await subCategoryModel.findById(id);
            if(!Subcategory){
                return res.status(404).send({message:"Subcategory ID not found"});
            }
            return res.status(200).send({subCategory:Subcategory});
        } catch (error) {
            return res.status(500).send({message:`Ha ocurrido un error ${error}`});
        }
    }

}

export default subCategoryController;