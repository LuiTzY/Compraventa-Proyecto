var express = require('express');
const CategoryController = require('../controllers/categoria');
var router = express.Router();

router.get('/home', CategoryController.home);
router.post('/crear-categoria', CategoryController.createCategory);
router.get('/obtener-categoria', CategoryController.getCategorys);
router.put('/actualizar-categoria/:nombre', CategoryController.updateCategory);
router.delete('/eliminar-categoria/:nombre',CategoryController.deleteCategory);

module.exports = router
