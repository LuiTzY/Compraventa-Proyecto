const CategoryModel = require('../models/categoria');

const CategoryController = {
    home: (req, res) => {
        return res.status(200).send({ response: "Esta vaina funciona" });
    },
    createCategory: async (req, res) => {
        const { category_name } = req.body;

        try {
            const categoriaExistente = await CategoryModel.findOne({ category_name: category_name });

            if (categoriaExistente) {
                return res.status(409).send({ error: "Esta categoría ya ha sido creada" });
            }

            const category = await CategoryModel.create({
                category_name: category_name,
            });

            return res.status(201).send({ category: category });
        } catch (err) {
            return res.status(500).send({ message: `Ha ocurrido un error con la solicitud ${err}` });
        }
    },
    updateCategory: async (req, res) => {
        const category_name = req.params.name;
        const categoryToUpdate = req.body;

        try {
            const categoryExists = await CategoryModel.findOne({ _id: category_name });

            if (!categoryExists) {
                return res.status(404).send("La categoría no existe");
            }

            await CategoryModel.updateOne({ _id: category_name }, { $set: categoryToUpdate });

            return res.status(201).send({ message: "Categoría actualizada exitosamente" });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error en el servidor: ${err}` });
        }
    },
    deleteCategory: async (req, res) => {
        const category_name = req.params.name;

        try {
            const categoryExists = await CategoryModel.findOne({ _id: category_name });

            if (!categoryExists) {
                return res.status(404).send({ error: "No se puede eliminar la categoría ya que no existe" });
            }

            const categoryDeleted = await CategoryModel.deleteOne({ _id: category_name });

            if (categoryDeleted.deletedCount === 0) {
                return res.status(409).send({ error: "No se ha podido eliminar la categoría" });
            }

            return res.status(201).send({ message: "Categoría eliminada exitosamente" });
        } catch (err) {
            return res.status(500).send({ serverError: `Ha ocurrido un error con el servidor: ${err}` });
        }
    },
    getCategorys: async (req, res) => {
        try {
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
