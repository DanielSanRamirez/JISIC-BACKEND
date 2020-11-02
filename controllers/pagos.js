// Importación para tener las funciones del res
const { response } = require('express');

const path = require('path');

const sendEmailTesorera = require('../emails/tesorera-datos-factura');
const sendEmailRechazoPago = require('../emails/email-rechazo-pago');
const sendEmailAprobado = require('../emails/email-aprobado');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');
const Pago = require('../models/pago');

const getPagoPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 1;
    const inscripcionesFinal = [];

    var option = {
        page: desde,
        limit: 10
    };

    Pago.paginate({ estado: false, estadoInscripcion: true }, option, (err, pagos) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!pagos) {
                res.status(404).send({ message: 'No se encontro Pagos' });
            } else {
                return res.json({
                    totalPages: pagos.totalPages,
                    pagos: pagos.docs,
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

        datosEmail = await Inscripcion.findOne({ participante: id }).populate('participante').populate('producto').populate('pago');

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

const emailRechazoPago = async (req, res = response) => {

    const id = req.params.id;

    var datosEmail = [];

    try {

        const inscripcionDB = await Inscripcion.findOne({ pago: id }).populate('participante').populate('producto').populate('pago');

        if (!inscripcionDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una inscripción con ese id de Pago'
            });
        }

        datosEmail.push(req.body.mensaje);
        datosEmail.push(inscripcionDB.participante);
        datosEmail.push(id);

        await sendEmailRechazoPago.sendEmail(datosEmail);

        const inscripciones = await Inscripcion.find({ pago: id }).populate('participante').populate('producto').populate('pago');
        inscripciones.forEach(async element => {
            element.estadoRecibo = false;
            await Inscripcion.findByIdAndUpdate(element._id, element, { new: true });
        });

        const pago = await Pago.findById(id);
        pago.estadoInscripcion = false;
        await Pago.findByIdAndUpdate(id, pago, { new: true });

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

const getPago = async (req, res = response) => {

    const id = req.query.id;

    try {

        const pagoDB = await Pago.findById(id);

        if (!pagoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una registro de pago con ese id'
            });
        };

        res.json({
            ok: true,
            pago: pagoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
};

const actualizarEstadoPago = async (req, res = response) => {

    // Se obtiene el id del pago
    const id = req.params.id;
    const numeroFactura = req.body.numeroFactura;
    const datosEmail = [];

    try {

        // Busca en la BD el pago con el id
        const pagoDB = await Pago.findById(id);

        if (!pagoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un registro de pago con ese id'
            });
        };

        pagoDB.estado = true;
        pagoDB.numeroFactura = numeroFactura;

        await Pago.findByIdAndUpdate(id, pagoDB, { new: true });

        const inscripcion = await Inscripcion.findOne({ pago: id }).populate('participante');

        const participante = await Participante.findById(inscripcion.participante._id);
        participante.estadoInscrito = true;
        await Participante.findByIdAndUpdate(inscripcion.participante._id, participante, {new: true})

        datosEmail.push(inscripcion.participante)
        sendEmailAprobado.sendEmail(datosEmail[0]);

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const getDocumentosPago = async (req, res = response) => {

    const dato = req.params.dato;
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];
    let data1 = [];

    switch (dato) {
        case 'numeroTransaccion':
            data1 = await Pago.find({ estado: false, estadoInscripcion: true });
            data1.forEach(element => {
                if (String(element.numeroTransaccion).match(regex)) {
                    data.push(element);
                }

            });
            break;

        case 'identificacion':
            data1 = await Pago.find({ estado: false, estadoInscripcion: true });
            data1.forEach(element => {
                if (element.identificacion.match(regex)) {
                    data.push(element);
                }

            });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'El path tiene que ser api/pagos/coleccion/numeroTransaccion o api/pagos/coleccion/identificacion'
            })
    }

    res.json({
        ok: true,
        resultados: data
    });
};

module.exports = {
    crearPago,
    getPagoPaginado,
    emailTeso,
    emailRechazoPago,
    getPago,
    actualizarEstadoPago,
    getDocumentosPago
}
