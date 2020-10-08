const { response } = require('express');

// Importación del modelo 
const Usuario = require('../models/usuario');

// Importación del módulo para encriptación
const bcryptjs = require('bcryptjs');

// Importación para generar JWT
const { generarJWT } = require('../helpers/jwt');

const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { nombre, password, perfil } = req.body;
    try {

        // Verificar nombre
        const usuarioDB = await Usuario.findOne({ nombre });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Verificar perfil
        if (usuarioDB.perfil !== perfil) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no valido con el perfil seleccionado'
            });
        }

        // Verificar estado
        if (!usuarioDB.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Su usuario está inactivo, hable con el administrador'
            })
        }

        // Generar el TOKEN -JWT
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.perfil)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

const renewToken = async (req, res = response) => {
    
    const uid = req.uid;

    // Generar el TOKEN -JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.perfil)
    });
}

module.exports = {
    login,
    renewToken
}