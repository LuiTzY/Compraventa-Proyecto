var express = require('express');
const ProductoController = require('../controllers/producto');
var router = express.Router();

router.get('/home', ProductoController.home)
router.post('/crear-producto', userController.createUser)
router.put('/actualizar-producto/:id', userController.updateUser)
router.put('/actualizar-precio-producto/:id', userController.updateUser)

module.exports = router
