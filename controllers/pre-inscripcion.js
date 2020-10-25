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

module.exports = {
    getPreInscripcionPaginado
}