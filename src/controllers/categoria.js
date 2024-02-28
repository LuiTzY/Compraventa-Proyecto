import CategoryModel from '../models/categoria.js';

// Controlador para las operaciones relacionadas con las categorías
const CategoryController = {
    // Ruta de inicio para verificar si el controlador funciona
    test: (req, res) => {
        return res.status(200).send({ message: "Category funciona correctamente" });
    },

    // Método para crear una nueva categoría
    createCategory: async (req, res) => {
        const { category_name } = req.body;

        try {
            // Verificar si la categoría ya existe en la base de datos
            const categoriaExistente = await CategoryModel.findOne({ category_name: category_name });

            if (categoriaExistente) {
                return res.status(409).send({ error: "Esta categoría ya ha sido creada" });
            }

            // Crear la nueva categoría
            const newCategory =  new CategoryModel({
                category_name: category_name,
            });

            await newCategory.save();
            return res.status(201).send({ category: newCategory });
        } catch (err) {
            return res.status(500).send({ message: `Ha ocurrido un error con la solicitud ${err}` });
        }
    },

    // Método para actualizar una categoría existente
    updateCategory: async (req, res) => {
        const category_id = req.params.id;
        const categoryToUpdate = req.body;

        try {
            // Verificar si la categoría a actualizar existe en la base de datos
            const categoryExists = await CategoryModel.findById({ _id: category_id });

            if (!categoryExists) {
                return res.status(404).send("La categoría no existe");
            }

            // Actualizar la categoría
            await CategoryModel.updateOne({ _id: category_id }, { $set: categoryToUpdate });

            return res.status(201).send({ message: "Categoría actualizada exitosamente" });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error en el servidor: ${err}` });
        }
    },

    // Método para eliminar una categoría
    deleteCategory: async (req, res) => {
        const category_id = req.params.id;
        try {
            // Verificar si la categoría a eliminar existe en la base de datos
            const categoryExists = await CategoryModel.findById({ _id: category_id });
            if (!categoryExists) {
                return res.status(404).send({ error: "No se puede eliminar la categoría ya que no existe" });
            }

            // Eliminar la categoría
            const categoryDeleted = await CategoryModel.deleteOne({ _id: category_id });

            if (categoryDeleted.deletedCount === 0) {
                return res.status(409).send({ error: "No se ha podido eliminar la categoría" });
            }

            return res.status(201).send({ message: "Categoría eliminada exitosamente" });
        } catch (err) {
            
            return res.status(500).send({ serverError: `Ha ocurrido un error con el servidor: ${err}` });
        }
    },

    // Método para obtener todas las categorías
    getCategorys: async (req, res) => {
        try {
            // Obtener todas las categorías de la base de datos
            const categorys = await CategoryModel.find();

            if (!categorys) {
                return res.status(404).send({ message: 'No se pueden obtener las categorías' });
            }

            return res.status(200).send({ categorys: categorys });
        } catch (err) {
            return res.status(500).send({ message: `Ha ocurrido un error con el servidor: ${err}` });
        }
    }
};

export default CategoryController;
