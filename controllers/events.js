const { response } = require('express');
const Event = require('../models/Event');


const getEvents = async(req, res = response) => {
    
    const events = await Event.find()
                              .populate('user', 'name');
    
    res.status(200).json({
        ok: true,
        events
    });
}

const createEvent = async(req, res = response) => {
    
    const event = new Event( req.body );

    try {
        
        event.user = req.uid;
        const eventCreated = await event.save()

        res.status(201).json({
            ok: true,
            event: eventCreated 
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Contacta con el administrador'
        });
    }

}

const updateEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: "El evento no existe"
            });
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        //actualiza el evento en la DB por defecto devuelve los datos antes de actualizar
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(200).json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacta con el administrador'
        });
    }
}

const deleteEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: "El evento no existe"
            });
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para eliminar este evento'
            })
        }

        //actualiza el evento en la DB por defecto devuelve los datos antes de actualizar
        await Event.findByIdAndDelete( eventId );

        res.status(200).json({
            ok: true,
            msg: 'Evento Eliminado!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacta con el administrador'
        });
    }

}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
