const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion')

const getPreInscripcionPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;

    var option = {
        page: desde,
        limit: 10,
        populate: ['participante', 'producto'],
    };

    Inscripcion.paginate({ estado: false, estadoParticipante: true }, option, (err, inscripciones) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!inscripciones) {
                res.status(404).send({ message: 'No se encontro Inscripciones' });
            } else {
                return res.json({
                    ok: true,
                    totalPages: inscripciones.totalPages,
                    inscripciones: inscripciones.docs,
                });
            }
        }
    });
};

const getDocumentosPreInscripcion = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];
    let data1 = [];

    switch (dato) {
        case 'identificacion':
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante');
            data1.forEach(element => {
                if (element.participante.identificacion.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'apellidos':
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante');
            data1.forEach(element => {
                if (element.participante.apellidos.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'nombres':
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante');
            data1.forEach(element => {
                if (element.participante.nombres.match(regex)) {
                    data.push(element);
                }

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/pre-inscripcion/coleccion/identificacion o api/pre-registro/coleccion/nombres o api/pre-registro/coleccion/apellidos'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

module.exports = {
    getPreInscripcionPaginado,
    getDocumentosPreInscripcion
}