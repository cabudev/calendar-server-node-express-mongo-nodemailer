const { response } = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Company = require('../models/Company');

const { createJWT } = require('../helpers/jwt');
const sendEmail = require('../handlers/email');


const createUser = async (req, res = response) => {
    
    const {company: tradename, name, email, password } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
           
        //comprueba que el usuario no existe en db
        let user = await User.findOne({ email });

        if( user ) {
            session.endSession();
            return res.status(400).json({
                ok: false,
                msg: 'Ya hay un usuario asociado a este email'
            });
        }

        //user = new User( req.body, {} );

        //encripta contraseña
        const salt = bcrypt.genSaltSync();
        passwordCrypt = bcrypt.hashSync( password, salt );

        //await user.save();
        user = await User.create([{ email, password: passwordCrypt, name  }], { session });
        
        //comprueba si la empresa existe
        let company = await Company.findOne({ tradename });
        if( tradename ){

            if( company ) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    ok: false,
                    msg: 'La empresa ya esta dada de alta. Contacte con el administrador para que le envie una invitación'
                });
            }

            admin_id = user[0].id;
            user_id = user[0].id;
            //crea la empresa
            //company = await Company( { tradename, admin_id, user_id } );

            company = await Company.create([{ tradename, admin_id, user_id }], { session });
            //await company.save(); 

        }

        //genera JWT
        const token = await createJWT( user.id, user.name );

        //hace el commit de la stansaccion y cierra la sesion
        await session.commitTransaction();
        session.endSession();

        //si puede crearlo: 201 (estado para cuando se crea en bd)
        return res.status(201).json({
            ok: true,
            uid: user[0].id,
            name: user[0].name,
            company: company[0].tradename,
            token
        });

    } catch (error) {
        //cancela el commit y cirra la sesion
        //await session.abortTransaction();
        session.endSession();

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error: contacta con el administrador'
        });
    }
}

const sendToken = async(req, res) => {
    const { email } = req.body

    try {
        //comprueba que el usuario existe en db
        const user = await User.findOne({ email });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        //genera JWT
        user.token = await createJWT( user.id, user.name );
        
        await user.save();

        const resetUrl = `${process.env.URL_CLIENT}/reset-password/${user.token}`

        await sendEmail.send({
            user,
            subject: 'Restablecer Contraseña',
            resetUrl,
            file: 'reset-password/index'
        });

        res.status(200).json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error: contacta con el administrador'
        });
    }
}

const resetPassword = async(req, res) => {
    
    const { token, password } = req.body;

    try {
        //comprueba que el token existe en db
        const user = await User.findOne({ token });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El token no existe'
            });
        }

        //encripta contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        //actualiza la contraseña
        await user.save();

        //genera el token de autenticación
        const xtoken = await createJWT( user.id, user.name );
        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: xtoken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error: contacta con el administrador'
        });
    }
}


const changePicture = async(req, res) => {
    const { uid, fileUrl } = req.body;

    try {
        //comprueba que el token existe en db
        const user = await User.findOne({ _id: uid });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        user.profile_picture = fileUrl;
        user.save();

        res.status(200).json({
            ok: true,
            fileUrl
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
    createUser,
    resetPassword,
    sendToken,
    changePicture
}