// Importar express y el controlador de categorías
import CategoryController from '../controllers/categoria.js';
import { Router } from 'express';
import * as authJwt from '../middlewares/authjwt.js'
import CategoryValidate from '../validators/category.js';
const router = Router();

// Definir rutas para las operaciones de categorías
router.get('/test', CategoryController.test);  // Ruta de inicio
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], CategoryController.getCategorys);  // Ruta de inicio
router.post('/create-category', [authJwt.verifyToken, authJwt.isAdmin], CategoryValidate,  CategoryController.createCategory);  // Ruta para crear una nueva categoría
router.put('/update-category/:id',[authJwt.verifyToken, authJwt.isAdmin], CategoryValidate, CategoryController.updateCategory);  // Ruta para actualizar una categoría
router.delete('/delete-category/:id',[authJwt.verifyToken, authJwt.isAdmin], CategoryController.deleteCategory);  // Ruta para eliminar una categoría

// Exportar el router con las rutas definidas   
export default router;
