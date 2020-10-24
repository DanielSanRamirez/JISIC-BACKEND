const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion')

const getPreInscripcionPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    let inscripciones = Inscripcion;

    const [participantes] = await Promise.all([
        Participante
            .find({ estado: false })
    ]);

    var option = {
        page: desde,
        limit: 1,
        populate: 'participante'
    };

    Inscripcion.paginate({ estado: false }, option, (err, inscripciones) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!inscripciones) {
                res.status(404).send({ message: 'No se encontro Inscripciones' });
            } else {
                //console.log(inscripciones.docs);

                inscripciones.docs.forEach(element => {
                    participantes.forEach(elementos => {
                        if (String(element.participante._id) === String(elementos._id)) {
                            inscripciones.docs.pop(element);
                            console.log('entro');
                        }
                    });
                });

                return res.json({
                    inscripciones
                })
                /*return res.json({
                    ok: true,
                    totalPages: inscripciones.totalPages,
                    inscripciones: inscripciones.docs,
                });*/
            }
        }
    });

    /*const [inscripcion] = await Promise.all([
        Inscripcion
        .find({estado: false}).populate('participante')
    ]);*/

    /*inscripcion.forEach(element => {
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
    });*/
};

module.exports = {
    getPreInscripcionPaginado
}