// Importación para tener las funciones del res
const { response } = require('express');

// Impotación del modelo
const Inscripcion = require('../models/inscripcion');
const Producto = require('../models/producto');
const Pago = require('../models/pago');
const Participante = require('../models/participante');

const { fileUpload } = require('./uploads');

const getInscripcionPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    let inscripciones = [];

    const [participantes] = await Promise.all([
        Participante
            .find({ estado: true })
    ]);

    const [inscripcion] = await Promise.all([
        Inscripcion
            .find({ estado: true, estadoRecibo: true }).populate('participante')
    ]);

    const [pago] = await Promise.all([
        Pago
            .find({ estado: false }).populate('inscripcion')
    ])

    pago.forEach(elementoPago => {
        inscripcion.forEach(element => {
            if (String(elementoPago.inscripcion._id) === String(element._id)) {
                participantes.forEach(elementos => {
                    if (String(element.participante._id) === String(elementos._id)) {
                        inscripciones.push(elementoPago);
                    }
                });    
            }
        });
    });


    const inscripcionesPag = inscripciones.slice(desde, desde + 10);

    res.json({
        ok: true,
        inscripcionesPag,
        total: inscripciones.length
    });
};

const crearInscripcion = async (req, res = response) => {

    // Obtener datos del body de la petición
    const { participante, producto, institucion, costoTotal, estado } = req.body;

    try {

        // Consulta en la BD si existe el producto y el participante
        const existeInscripcion = await Inscripcion.findOne({ participante, producto });

        const _id = producto;

        const esProfesional = await Producto.findById({ _id });

        if (esProfesional.nombre === 'Profesionales y Profesores Externos') {
            req.body.estado = true;
        }

        if (existeInscripcion) {
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe una inscripción con el participante y el producto seleccionado'
            });
        }

        const inscripcion = new Inscripcion(req.body);

        await inscripcion.save();

        res.json({
            ok: true,
            inscripcion
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }

};

/*const actualizarParticipante = async (req, res = response) => {

    // Se obtiene el id del participante
    const uid = req.params.id;

    try {

        // Busca en la BD el usuario con el uid
        const participanteDB = await Participante.findById(uid);

        if (!participanteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un participante con ese id'
            });
        };

        // Actualización
        const { email, ...campos } = req.body;

        if (participanteDB.email !== email) {
            const existeEmail = await Participante.findOne({
                email: email
            });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un participante con ese email'
                });
            };
        };

        const participanteActualizado = await Participante.findByIdAndUpdate(uid, campos, { new: true });

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

};*/

module.exports = {
    getInscripcionPaginado,
    crearInscripcion
    //actualizarParticipante
}
