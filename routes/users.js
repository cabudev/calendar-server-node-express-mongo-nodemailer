/*
    Rutas de Usuarios
    host + /api/users
*/

const express = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../middleware/validate');

const router = express.Router();

//importa los controladores
const { createUser, resetPassword, sendToken, changePicture } = require('../controllers/users');
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
    '/reset-password',
    sendToken
);

router.put(
    '/reset-password',
    resetPassword
);

router.put(
    '/change-picture',
    changePicture
);

module.exports = router;