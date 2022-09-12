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
        const token = await generarJWT( dbUser.id, name );

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

const loginUsuario = async (req, resp = response) => {

    const { email, password } = req.body;

    try{

        const dbUser = await Usuario.findOne( { email });

        if( !dbUser ){
            return resp.status(400).json({
                ok:false,
                msg:"Correo no existe"
            });
        }

        //validar password
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if( !validPassword ){
            return resp.status(400).json({
                ok:false,
                msg:"Password no es valido"
            });
        }

        //Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        //respuesta del servicio
        return resp.status(200).json({
            ok:true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });

    }catch(errors){
        return resp.status(500).json({
            ok:false,
            msg:"Contactarse con el administrador"
        });
    }
};


const revalidarToken = async (req, resp = response) => {

    const { uid } = req;

    const dbUser = await Usuario.findById(uid);

    const token =  await generarJWT( uid, dbUser.name);

    return resp.status(200).json({
        ok:true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
};



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}