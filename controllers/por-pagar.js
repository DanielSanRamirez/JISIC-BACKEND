const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');

const getPorPagarPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;
    const inscripcionesFinal = [];

    var option = {
        page: desde,
        limit: 10,
        populate: ['participante', 'producto'],
    };

    Inscripcion.paginate({ estado: true, estadoParticipante: true, estadoRecibo: false}, option, (err, inscripciones) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!inscripciones) {
                res.status(404).send({ message: 'No se encontro Inscripciones' });
            } else {
                return res.json({
                    totalPages: inscripciones.totalPages,
                    inscripciones: inscripciones.docs,
                });
            }
        }
    }); 
};

const getDocumentosPorPagar = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];
    let data1 = [];

    switch (dato) {
        case 'identificacion':
            data1 = await Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: false }).populate('participante').populate('producto');
            data1.forEach(element => {
                if (element.participante.identificacion.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'apellidos':
            data1 = await Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: false }).populate('participante').populate('producto');
            data1.forEach(element => {
                if (element.participante.apellidos.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'nombres':
            data1 = await Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: false }).populate('participante').populate('producto');
            data1.forEach(element => {
                if (element.participante.nombres.match(regex)) {
                    data.push(element);
                }

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/por-pagar/coleccion/identificacion o api/por-pagar/coleccion/nombres o api/por-pagar/coleccion/apellidos'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

module.exports = {
    getPorPagarPaginado,
    getDocumentosPorPagar
}