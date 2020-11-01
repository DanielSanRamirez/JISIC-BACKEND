// Importación para tener las funciones del res
const { response } = require('express');

const path = require('path');

const sendEmailTesorera = require('../emails/tesorera-datos-factura');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');
const Pago = require('../models/pago');

const getPagoPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;
    const inscripcionesFinal = [];

    var option = {
        page: desde,
        limit: 10,
        populate: ['participante', 'producto', 'pago'],
    };

    Inscripcion.paginate({ estado: true, estadoParticipante: true, estadoRecibo: true }, option, (err, inscripciones) => {
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

const crearPago = async (req, res = response) => {

    const id = req.query.id;

    // Obtener datos del body de la petición
    const { numeroTransaccion } = req.body;

    var datosEmail = [];

    try {

        // Consulta en la BD si existe el email
        const existeNumeroTransaccion = await Pago.findOne({ numeroTransaccion });

        if (existeNumeroTransaccion) {
            return res.status(404).json({
                ok: false,
                msg: 'El número de transacción ya está ingresado'
            });
        }

        const pago = new Pago(req.body);

        await pago.save();

        const pagoRegistrado = await Pago.findOne({ numeroTransaccion });

        if (!pagoRegistrado) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un pago registrado'
            });
        }

        const idPago = pagoRegistrado._id;

        const inscripciones = await Inscripcion.find({ participante: id });
        inscripciones.forEach(async element => {
            element.pago = idPago;
            element.estadoRecibo = true;
            await Inscripcion.findByIdAndUpdate(element._id, element, { new: true })
        });

        res.json({
            ok: true,
            pago
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }

};

const emailTeso = async (req, res = response) => {

    const id = req.query.id;

    var datosEmail = [];

    try {

        datosEmail = await Inscripcion.findOne({participante: id}).populate('participante').populate('producto').populate('pago');

        if (datosEmail.pago.tipoIdentificacion == '1') {
            datosEmail.pago.tipoIdentificacion = 'Cédula de Identidad'
        } else {
            datosEmail.pago.tipoIdentificacion = 'RUC'
        }

        await sendEmailTesorera.sendEmail(datosEmail);

        res.json({
            ok: true,
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

/*const actualizarEstadoParticipante = async (req, res = response) => {

    // Se obtiene el id del participante
    const uid = req.params.id;
    const datosEmail = [];

    try {

        // Busca en la BD el participante con el uid
        const participanteDB = await Participante.findById(uid);
        
        if (!participanteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un participante con ese id'
            });
        };

        // Comprobar cuantas inscripciones están en falso 
        const inscripcionesParticipante = await Inscripcion.find({ participante: uid, estado: false });
        
        if (inscripcionesParticipante.length === 0) {
            
            const inscripcion = await Inscripcion.findOne({participante: uid, estado: true});
            datosEmail.push(participanteDB);
            datosEmail.push(inscripcion.costoTotal);
            sendEmailLlenarDatosFactura.sendEmail(datosEmail);
        }

        const participanteActualizado = await Participante.findByIdAndUpdate(uid, req.body, { new: true });
        const inscripciones = await Inscripcion.find({participante: uid});
        inscripciones.forEach(async element => {
            element.estadoParticipante = true;
            await Inscripcion.findByIdAndUpdate(element._id, element, {new: true});
        });

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
}*/

/*const getParticipante = async (req, res = response) => {

    // Definir el valor para traer los datos
    const id = req.query.id;

    const participante = await Participante.findById(id);

    res.json({
        ok: true,
        participante
    });

};*/

module.exports = {
    crearPago,
    getPagoPaginado,
    emailTeso
}
