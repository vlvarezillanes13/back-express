const { response } = require('express');


const crearUsuario = (req, resp = response) => {

    resp.json({
        ok:true,
        msg:"New"
    })
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