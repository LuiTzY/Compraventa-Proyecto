// Importar express y el controlador de categorías
var express = require('express');
const CategoryController = require('../controllers/categoria');
var router = express.Router();

// Definir rutas para las operaciones de categorías
router.get('/home', CategoryController.home);  // Ruta de inicio
router.post('/crear-categoria', CategoryController.createCategory);  // Ruta para crear una nueva categoría
router.get('/obtener-categoria', CategoryController.getCategorys);  // Ruta para obtener todas las categorías
router.put('/actualizar-categoria/:nombre', CategoryController.updateCategory);  // Ruta para actualizar una categoría
router.delete('/eliminar-categoria/:nombre', CategoryController.deleteCategory);  // Ruta para eliminar una categoría

// Exportar el router con las rutas definidas
module.exports = router;
