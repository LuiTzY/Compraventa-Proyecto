import ProductController from '../controllers/product.js';
import { Router } from 'express';
import { uploadProductImage } from '../middlewares/imageHandler.js';
import ProductValidate from '../validators/product.js'
import * as authJwt from '../middlewares/authjwt.js';
const router = Router();


router.get('/', [authJwt.verifyToken], ProductController.getProducts);
router.get('/test', ProductController.home);
router.get('/get-product/:id',[authJwt.verifyToken], ProductController.getProductById);
router.post("/create-products",[authJwt.verifyToken, authJwt.isAdmin], ProductValidate, ProductController.createMultipleProducts);
router.post('/create-product', [authJwt.verifyToken, authJwt.isAdmin],uploadProductImage, ProductValidate, ProductController.createProduct);
router.put('/update-product/:id', [authJwt.verifyToken, authJwt.isAdmin], ProductController.updateProductById);
router.delete('/delete-product/:id',[authJwt.verifyToken, authJwt.isAdmin], ProductController.deleteProductById);


export default router;
