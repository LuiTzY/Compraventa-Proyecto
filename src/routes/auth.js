import authController from '../controllers/auth.js';
import validateCreate from '../validators/user.js';
import userController from '../controllers/user.js';
import { Router } from 'express';
import * as authJwt from '../middlewares/authjwt.js';
import { verifySingOut } from '../middlewares/verifySingout.js';
import * as token from '../middlewares/tokenExpirationRenew.js';
import {checkRolesExists} from '../middlewares/verifySignup.js';

const router = Router();
//Ruta testeada completa con las funcionalidades
//Ruta para listar los usuarios (requiere ser administrador)
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);
//Ruta para crear cuenta
router.post('/sigIn', validateCreate, checkRolesExists, authController.signIn);
//Ruta para iniciar sesion
router.post('/signUp/:email/:password',[authController.signUp]);
//Ruta para cerrar sesion
router.post('/signOut/:id', [authJwt.verifyToken, authJwt.isUser, verifySingOut]);
//Ruta para renovar tokens
router.post('/renew-token/:id', [authJwt.verifyToken, token.checkRefreshTokenExpiration]);
//Ruta para cambiar roles de usuarios (requiere ser administrador)
router.put('/change-role/:id', [authJwt.verifyToken, authJwt.isAdmin], checkRolesExists, authController.changeRoleById);     

export default router;  