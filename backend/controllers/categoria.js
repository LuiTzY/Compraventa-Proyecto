const CategoryModel = require('../models/categoria');

// Controlador para las operaciones relacionadas con las categorías
const CategoryController = {
    // Ruta de inicio para verificar si el controlador funciona
    home: (req, res) => {
        return res.status(200).send({ response: "Esta vaina funciona" });
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
            const category = await CategoryModel.create({
                category_name: category_name,
            });

            return res.status(201).send({ category: category });
        } catch (err) {
            return res.status(500).send({ message: `Ha ocurrido un error con la solicitud ${err}` });
        }
    },

    // Método para actualizar una categoría existente
    updateCategory: async (req, res) => {
        const category_name = req.params.name;
        const categoryToUpdate = req.body;

        try {
            // Verificar si la categoría a actualizar existe en la base de datos
            const categoryExists = await CategoryModel.findOne({ _id: category_name });

            if (!categoryExists) {
                return res.status(404).send("La categoría no existe");
            }

            // Actualizar la categoría
            await CategoryModel.updateOne({ _id: category_name }, { $set: categoryToUpdate });

            return res.status(201).send({ message: "Categoría actualizada exitosamente" });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error en el servidor: ${err}` });
        }
    },

    // Método para eliminar una categoría
    deleteCategory: async (req, res) => {
        const category_name = req.params.name;

        try {
            // Verificar si la categoría a eliminar existe en la base de datos
            const categoryExists = await CategoryModel.findOne({ _id: category_name });

            if (!categoryExists) {
                return res.status(404).send({ error: "No se puede eliminar la categoría ya que no existe" });
            }

            // Eliminar la categoría
            const categoryDeleted = await CategoryModel.deleteOne({ _id: category_name });

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
                return res.status(409).send({ conflictError: 'No se pueden obtener las categorías' });
            }

            return res.status(200).send({ categorys: categorys });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error con el servidor: ${err}` });
        }
    },
};

module.exports = CategoryController;
