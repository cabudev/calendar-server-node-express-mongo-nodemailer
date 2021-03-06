const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createJWT } = require('../helpers/jwt');

const loginUser =  async(req, res) => {
    
    const { email, password } = req.body

    try {
        //comprueba que el usuario existe en db
        const user = await User.findOne({ email });

        if( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        //confirma la contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña Incorrecta'
            });
        }

        //genera JWT
        const token = await createJWT( user.id, user.name );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            urlProfilePicture: user.profile_picture,
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

const renewToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name;

    //genera nuevo JWT
    const token = await createJWT( uid, name );

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    loginUser,
    renewToken
}