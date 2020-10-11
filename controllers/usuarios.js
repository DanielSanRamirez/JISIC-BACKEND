// Importación para tener las funciones del res
const { response } = require('express');

// Importar módulo para encriptación
const bcryptjs = require('bcryptjs')

// Impotación del modelo
const Usuario = require('../models/usuario');

const crearUsuario = async (req, res = response) => {

    // Obtener datos del body de la petición
    const { nombre, password, perfil, nombres } = req.body;

    try {

        // Consulta en la BD si existe el email
        const existeNombre = await Usuario.findOne({ nombre });

        if (existeNombre) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        res.json({
            ok: true,
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }

};

const getUsuariosPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({})
            .skip(desde)
            .limit(10),

        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
};

module.exports = {
    crearUsuario,
    getUsuariosPaginado
}