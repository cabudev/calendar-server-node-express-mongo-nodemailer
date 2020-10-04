/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../middleware/validate');

const router = express.Router();

//importa los controladores
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middleware/validate-jwt');

//define las rutas
router.post(
    '/new',  
    [
        check('name', "El nombre es obligatorio").not().isEmpty(),
        check('email', "El email es obligatorio").isEmail(),
        check('password', "La contrasela tiene que tener al menos 6 caracteres").isLength({ min : 6 }),
        validateFields
    ],
    createUser
);

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