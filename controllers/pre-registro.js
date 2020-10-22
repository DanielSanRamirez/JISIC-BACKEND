const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');

const getPreRegistroPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;

    var option = {
        page: desde,
        limit: 10
    };

    Participante.paginate({estado: false}, option, (err, participantes) => {
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

module.exports = {
    getPreRegistroPaginado
}