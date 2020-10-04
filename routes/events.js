/*
    Rutas de Eventos / Events
    host + /api/events
*/

const express = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validateJWT } = require('../middleware/validate-jwt');
const { validateFields } = require('./../middleware/validate');

const router = express.Router();

//pasa el middleware validateJWT a todas las rutas que van despues de esta linea
router.use( validateJWT );

//importa los controladores
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');


//ruta para obtener eventos
router.get(
    '/',
    getEvents
);

//ruta para crear un nuevo evento
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha Inicio obligatoria').custom( isDate ),
        check('end','Fecha Fin obligatoria').custom( isDate ),
        validateFields
    ],
    createEvent
);

//ruta para actualizar un evento
router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha Inicio obligatoria').custom( isDate ),
        check('end','Fecha Fin obligatoria').custom( isDate ),
        validateFields
    ], 
    updateEvent);

//ruta para eliminar un evento
router.delete('/:id', deleteEvent);


module.exports = router;