const express =  require('express');
const userController = require('../controllers/user');
const router = express.Router();
const userValidator = require('../../validators/user');
const hashMiddleware = require('../../middlewares/hash')

router.get('/home', userController.home)
router.post('/crear-usuario', userValidator.validateCreate, hashMiddleware.hashPassword, userController.createUser)
router.put('/actualizar-usuario/:id', userController.updateUser)
router.patch('/change-password/:email',  userController.changePassword)

module.exports = router;
