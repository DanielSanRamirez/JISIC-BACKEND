// Importación para tener las funciones del res
const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');

const getInscritos = async (req, res) => {

    const desde = Number(req.query.desde) || 1;

    var option = {
        page: desde,
        limit: 10,
        populate: ['participante', 'producto', 'pago'],
    };

    Inscripcion.paginate({ estado: true, estadoParticipante: true, estadoRecibo: true, estadoInscrito: true }, option, (err, participantes) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!participantes) {
                res.status(404).send({ message: 'No se encontro Usuario' });
            } else {
                return res.json({
                    totalPages: participantes.totalPages,
                    participantes: participantes.docs,
                });
            }
        }
    });
};

const getDocumentosInscritos = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];
    let data1 = [];

    switch (dato) {
        case 'identificacion':
            data1 = await Participante.find({ estado: true, estadoInscrito: true });
            data1.forEach(element => {
                if (element.identificacion.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'apellidos':
            data1 = await Participante.find({ estado: true, estadoInscrito: true });
            data1.forEach(element => {

                if (element.apellidos.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'nombres':
            data1 = await Participante.find({ estado: true, estadoInscrito: true });
            data1.forEach(element => {
                if (element.nombres.match(regex)) {
                    data.push(element);
                }

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/inscritos/coleccion/identificacion o api/inscritos/coleccion/nombres o api/inscritos/coleccion/apellidos'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

module.exports = {
    getInscritos,
    getDocumentosInscritos
}