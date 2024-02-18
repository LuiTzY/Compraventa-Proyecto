var express = require('express');
const ProductController = require('../controllers/product');
var router = express.Router();

router.get('/home', ProductController.home);
router.get('/obtener-productos', ProductController.getProducts);
router.post("/crear-productos", ProductController.createMultipleProducts);
router.post('/crear-producto', ProductController.createProduct);
router.put('/actualizar-producto/:id', ProductController.updateProduct);
router.delete('/eliminar-producto/:id', ProductController.deleteProduct);


module.exports = router
