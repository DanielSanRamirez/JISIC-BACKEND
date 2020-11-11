const { response } = require('express');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion')

// Importación de correo electrónico
const sendRechazoPreInscripcion = require('../emails/rechazo-pre-inscripcion');
const sendEmailLlenarDatosFactura = require('../emails/llenar-datos-factura');

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
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante').populate('producto');
            data1.forEach(element => {
                if (element.participante.identificacion.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'apellidos':
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante').populate('producto');
            data1.forEach(element => {
                if (element.participante.apellidos.match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'nombres':
            data1 = await Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante').populate('producto');
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

const actualizarEstadoParticipanteRechazo = async (req, res = response) => {

    // Se obtiene el id de la inscripción
    const id = req.params.id;
    const datosEmail = [];

    try {

        // Busca en la BD la inscripción con el id
        const inscripcionDB = await Inscripcion.findById(id);

        if (!inscripcionDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una inscripción con ese id'
            });
        };

        const uidParticipante = inscripcionDB.participante;
        inscripcionDB.estadoParticipante = false;

        const estadoParticipanteInscripcionActualizado = await Inscripcion.findByIdAndUpdate(id, inscripcionDB, { new: true });

        const inscripciones = await Inscripcion.find({ participante: uidParticipante });
        let numeroElementos = 0;
        let estadoParticipanteActualizado;

        inscripciones.forEach(element => {
            if (element.estadoParticipante === false) {
                
                numeroElementos += 1;
            }
        });

        if (numeroElementos === inscripciones.length) {
            const participanteDB = await Participante.findById(uidParticipante);

            if (!participanteDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe una participante con ese id'
                });
            };
            estadoParticipanteActualizado = await Participante.findByIdAndUpdate(uidParticipante, participanteDB, { new: true });
        } else {
            estadoParticipanteActualizado = await Participante.findById(uidParticipante);
        }

        datosEmail.push(req.body.mensaje);
        datosEmail.push(estadoParticipanteActualizado);
        datosEmail.push(estadoParticipanteInscripcionActualizado);
        sendRechazoPreInscripcion.sendEmail(datosEmail);

        res.json({
            ok: true,
            inscripcion: estadoParticipanteInscripcionActualizado,
            participante: estadoParticipanteActualizado 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const actualizarEstadoInscripcion = async (req, res = response) => {

    // Se obtiene el id de la inscripción
    const id = req.params.id;
    const datosEmail = [];

    try {

        // Busca en la BD la inscripción con el id
        const inscripcionDB = await Inscripcion.findById(id);

        if (!inscripcionDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una inscripción con ese id'
            });
        };

        inscripcionDB.estado = true;

        const estadoInscripcionActualizado = await Inscripcion.findByIdAndUpdate(id, inscripcionDB, { new: true });

        const participanteDB = await Participante.findById(inscripcionDB.participante);

        // Comprobar cuantas inscripciones están en falso 
        const inscripcionesParticipante = await Inscripcion.find({ participante: inscripcionDB.participante, estado: false });
        
        if (inscripcionesParticipante.length === 0) {
            
            const inscripcion = await Inscripcion.findById({_id: id, estado: true});
            datosEmail.push(participanteDB);
            datosEmail.push(inscripcion.costoTotal);
            sendEmailLlenarDatosFactura.sendEmail(datosEmail);
        }

        res.json({
            ok: true,
            inscripcion: estadoInscripcionActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

module.exports = {
    getPreInscripcionPaginado,
    getDocumentosPreInscripcion,
    actualizarEstadoParticipanteRechazo,
    actualizarEstadoInscripcion
}