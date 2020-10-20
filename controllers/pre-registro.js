const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');

const getPreRegistroPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [participantes, total] = await Promise.all([
        Participante
            .find({estado: false})
            .skip(desde)
            .limit(10),

            Participante
            .find({estado: false})
            .countDocuments()
    ]);

    res.json({
        ok: true,
        participantes,
        total
    });
};

module.exports = {
    getPreRegistroPaginado
}