var express =  require('express');
var userController = require('../controllers/user');
var router = express.Router();

router.get('/home', userController.home)
router.post('/crear-usuario', userController.createUser)
router.put('/actualizar-usuario/:id', userController.updateUser)

module.exports = router;