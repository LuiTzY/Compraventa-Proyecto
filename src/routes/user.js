import userController from '../controllers/user.js';
import validateCreate from '../validators/user.js';
import { Router } from 'express';
import * as authJwt from '../middlewares/authjwt.js';
import * as token from '../middlewares/tokenExpirationRenew.js';
import {checkRolesExists} from '../middlewares/verifySignup.js';
const router = Router();


//ruta para las operaciones con los usuarios solo
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);
router.get('/test', userController.test);
//El usuario debe de ser administrador debido a que es informacion confidencial de la bd, para eso esta el inicio de sesion
router.get('/get-user/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.getUserByid);
router.post('/create-user', [authJwt.verifyToken, authJwt.isAdmin, checkRolesExists, validateCreate], userController.createUser);
//Debe de ser un usuario para que pueda actualizar lo que desee
router.delete('/delete-user/:id',validateCreate, [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUserById);
router.put('/update-user/:id', validateCreate, [authJwt.verifyToken, authJwt.isAdmin],  userController.updateUserById);
router.get('/renew-password/', [authJwt.verifyToken,authJwt.isUser], token.generateChangePasswordToken );
router.patch('/change-password/:email/', [authJwt.verifyToken, authJwt.isUser, token.checkPasswordToken], userController.resetPasswordByEmail);

//se exporta la configuracion de rutas
export default router;
