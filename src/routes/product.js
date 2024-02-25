import ProductController from '../controllers/product.js';
import { Router } from 'express';
const router = Router();

router.get('/home', ProductController.home);
router.get('/obtener-producto/:id', ProductController.getProductById);
router.get('/obtener-productos', ProductController.getProducts);
router.post("/crear-productos", ProductController.createMultipleProducts);
router.post('/crear-producto', ProductController.createProduct);
router.put('/actualizar-producto/:id', ProductController.updateProductById);
router.delete('/eliminar-producto/:id', ProductController.deleteProductById);


export default router;
