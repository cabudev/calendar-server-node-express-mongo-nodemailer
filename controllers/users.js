const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createJWT } = require('../helpers/jwt');
const sendEmail = require('../handlers/email');


const createUser = async (req, res = response) => {
    
    const {email, password } = req.body;

    try {
        //comprueba que el usuario no existe en db
        let user = await User.findOne({ email });

        if( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya hay un usuario asociado a este email'
            });
        }

        user = new User( req.body );

        //encripta contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        //genera JWT
        const token = await createJWT( user.id, user.name );

        //si puede crearlo: 201 (estado para cuando se crea en bd)
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
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
        //const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${user.token}`;
        console.log(resetUrl);

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
        console.log(xtoken)
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