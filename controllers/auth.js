const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, resp = response) => {

    const { name, email, password } = req.body;

    try{
        //Verificar el email
        const usuario = await Usuario.findOne({ email});
        if( usuario ){
            return resp.status(400).json({
                ok:false,
                msg:"El usuario ya existe"
            })
        }
        //Crear usuario con el modelo
        const dbUser = new Usuario( req.body );
        //Hashear la contraseña
        const salt = bcrypt.genSaltSync( 10 );
        dbUser.password = bcrypt.hashSync( password, salt);
        //Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        //Crear usuario BD
        await dbUser.save();

        //Generar respuesta exitosa
        return resp.status(201).json({
            ok:true,
            uid: dbUser.id,
            name,
            token
        })

    }catch(errors){
        return resp.status(500).json({
            ok:false,
            msg:"Contactarse con el administrador"
        });
    }
};

const loginUsuario = (req, resp = response) => {

    resp.json({
        ok:true,
        msg:"Login"
    })
};


const revalidarToken = (req, resp = response) => {
    resp.json({
        ok:true,
        msg:"Renew"
    })
};



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}