const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion')

const getPreInscripcionPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    let inscripciones = [];

    const [participantes] = await Promise.all([
        Participante
            .find({estado: true})
    ]);

    const [inscripcion] = await Promise.all([
        Inscripcion
        .find({estado: false}).populate('participante')
    ]);

    inscripcion.forEach(element => {
        participantes.forEach(elementos => {
            if (String(element.participante._id) === String(elementos._id)) {
                inscripciones.push(element);
            }
        });
    });
    
    const inscripcionesPag = inscripciones.slice(desde, desde+10);

    res.json({
        ok: true,
        inscripcionesPag, 
        total: inscripciones.length
    });
};

module.exports = {
    getPreInscripcionPaginado
}