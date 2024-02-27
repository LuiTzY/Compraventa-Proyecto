// Importar express y el controlador de categorías
import subCategoryController from '../controllers/subCategory.js';
import { Router } from 'express';
import * as authJwt from '../middlewares/authjwt.js'
import SubCategoryValidate from '../validators/subcategory.js';
const router = Router();

// Definir rutas para las operaciones de categorías
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], subCategoryController.getSubCategorys);  // Ruta para obtener todas las subcategorías
router.get('/test', subCategoryController.test);    
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], subCategoryController.getSubCategoryById);
router.post('/create-subCategory', [authJwt.verifyToken, authJwt.isAdmin], SubCategoryValidate,  subCategoryController.createSubCategory);  // Ruta para crear una nueva subcategoría
router.put('/update-subCategory/:id',[authJwt.verifyToken, authJwt.isAdmin], SubCategoryValidate, subCategoryController.updateCategoryById);  // Ruta para actualizar una subcategoría
router.delete('/delete-subCategory/:id',[authJwt.verifyToken, authJwt.isAdmin], subCategoryController.deleteSubCategoryById);  // Ruta para eliminar una subcategoría

// Exportar el router con las rutas definidas
export default router;
