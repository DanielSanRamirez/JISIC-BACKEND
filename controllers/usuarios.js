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

    const desde = Number(req.query.desde) || 1;

    var option = {
        page: desde,
        limit: 10
    };

    Usuario.paginate({}, option, (err, usuarios) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!usuarios) {
                res.status(404).send({ message: 'No se encontro Usuario' });
            } else {
                return res.json({
                    ok: true,
                    totalPages: usuarios.totalPages,
                    usuarios: usuarios.docs,
                });
            }
        }
    });
};

const getDocumentosUsuario = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];

    switch (dato) {
        case 'nombres':
            data = await Usuario.find({ nombres: regex })
            break;

        case 'perfil':
            data = await Usuario.find({ perfil: regex })
            break;

        case 'estado':
            data = await Usuario.find({ estado: valorBusqueda })
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/usuarios/coleccion/nombres o api/usuarios/coleccion/perfil o api/usuarios/coleccion/estado'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

const actualizarUsuario = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        };

        // Actualización
        const { nombre, password, ...campos } = req.body;
        const regexNombre = new RegExp(nombre, 'i');

        if (usuarioDB.nombre.toLowerCase() !== nombre.toLowerCase()) {
            const existeNombre = await Usuario.findOne({
                nombre: regexNombre
            });
            if (existeNombre) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese nombre'
                });
            }
        };

        // Encriptar contraseña
        if (req.body.password === '') {
            req.body.password = usuarioDB.password;
        } else {
            const salt = bcryptjs.genSaltSync();
            req.body.password = bcryptjs.hashSync(password, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    crearUsuario,
    getUsuariosPaginado,
    getDocumentosUsuario,
    actualizarUsuario,
    borrarUsuario
}