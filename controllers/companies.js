const { response } = require('express');
const Company = require('../models/Company');

const createCompany = async (req, res = response) => {
    const { tradename } = req.body;

    try {
        //comprueba si la empresa existe
        let company = await Company.findOne({ tradename });

        if( company ) {
            return res.status(400).json({
                ok: false,
                msg: 'La empresa ya esta dada de alta. Contacte con el administrador para que le envie una invitación'
            });
        }

        //crea la empresa
        company = await Company( req.body );

        await company.save();

        res.status(201).json({
            ok: true,
            ...company._doc
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error: contacta con el administrador'
        });
    }
}

module.exports = {
    createCompany
}