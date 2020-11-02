const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');

const getPreRegistroPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;

    var option = {
        page: desde,
        limit: 10
    };

    Participante.paginate({ estado: false }, option, (err, participantes) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!participantes) {
                res.status(404).send({ message: 'No se encontro Participante' });
            } else {
                return res.json({
                    ok: true,
                    totalPages: participantes.totalPages,
                    participantes: participantes.docs,
                });
            }
        }
    });

};

const getDocumentosPreRegistro = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];
    let data1 = [];

    switch (dato) {
        case 'identificacion':
            data = await Participante.find({ identificacion: regex, estado: false });
            break;

        case 'apellidos':
            data = await Participante.find({ apellidos: regex, estado: false });
            break;

        case 'nombres':
            data = await Participante.find({ nombres: regex, estado: false });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/pre-registro/coleccion/identificacion o api/pre-registro/coleccion/apellidos o api/pre-registro/coleccion/nombres'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

const actualizarParticipante = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const participanteDB = await Participante.findById(uid);

        if (!participanteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un participante con ese id'
            });
        };

        // Actualización
        const { email, ...campos } = req.body;

        if (participanteDB.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(400).json({
                ok: false,
                msg: 'No puede actualizar el email'
            });
        };

        const participanteActualizado = await Participante.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            participante: participanteActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const borrarParticipante = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const participanteDB = await Participante.findById(uid);

        if (!participanteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un participante con ese id'
            });
        }

        const insctipciones = await Inscripcion.find({ participante: uid });
        insctipciones.forEach(async element => {
            await Inscripcion.findByIdAndDelete(element._id)
        });
        await Participante.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Participante e inscripciones eliminados'
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
    getPreRegistroPaginado,
    getDocumentosPreRegistro,
    actualizarParticipante,
    borrarParticipante
}