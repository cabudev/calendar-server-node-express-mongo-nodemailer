/*
    Rutas de Autenticación
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../middleware/validate');
const { validateJWT } = require('../middleware/validate-jwt');

const router = express.Router();

//importa los controladores
const { loginUser, renewToken} = require('../controllers/auth');


//define las rutas
router.post(
    '/',
    [
        check('email', "El email es obligatorio").isEmail(),
        check('password', "La contrasela tiene que tener al menos 6 caracteres").isLength({ min : 6 }),
        validateFields
    ],
    loginUser
);

router.get(
    '/renew', 
    validateJWT,
    renewToken
);

module.exports = router;