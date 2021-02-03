/*
    Rutas Empresa
    host + /api/companies
*/

const express = require('express');
const { check } = require('express-validator');
const { validateFields } = require('./../middleware/validate');
//const { validateJWT } = require('../middleware/validate-jwt');

const router = express.Router();

//importa los controladores
const { createCompany } = require('../controllers/companies');


//define las rutas
router.post(
    '/',
    [
        check('tradename', "El nombre de empresa es demasiado largo").isLength({ max : 255 }),
        validateFields
    ],
    createCompany
);


module.exports = router;