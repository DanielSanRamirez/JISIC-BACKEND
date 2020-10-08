const { response } = require('express');

// Importación del modelo 
const Usuario = require('../models/usuario');

// Importación del módulo para encriptación
const bcryptjs = require('bcryptjs');

// Importación para generar JWT
const { generarJWT } = require('../helpers/jwt');

//const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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

        // Generar el TOKEN -JWT
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token,
            //menu: getMenuFrontEnd(usuarioDB.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

module.exports = {
    login
}