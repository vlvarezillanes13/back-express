const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

const router = Router();

//Crear Usuario
router.post( '/new', crearUsuario );

//Login de usuario
router.post( '/', [
    check('email', 'El email es obligaotrio').isEmail(),
    check('password', 'La contraseña es obligaotria').isLength({ min: 6})
],loginUsuario );

//Validar y Revalidar token
router.get( '/renew', revalidarToken );


module.exports = router;