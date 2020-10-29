// Importación para tener las funciones del res
const { response } = require('express');

const sendEmailPreRegistro = require('../emails/pre-inscrption');
const sendEmailLlenarDatosFactura = require('../emails/llenar-datos-factura');

// Impotación del modelo
const Participante = require('../models/participante');
const Inscripcion = require('../models/inscripcion');

const getParticipantes = async (req, res = response) => {

    // Definir el valor para traer los datos
    const desde = Number(req.query.desde) || 0;

    const [participantes, total] = await Promise.all([
        Participante.find({}, 'nombres apellidos direccion codTelefono telefono email pais')
            .skip(desde)
            .limit(10)
            .populate('pais', 'nombre')
            .populate('codTelefono', 'phone_code'),
        Participante.countDocuments()
    ]);

    res.json({
        ok: true,
        participantes,
        total
    });

};

const crearParticipante = async (req, res = response) => {

    // Obtener datos del body de la petición
    const { nombres, apellidos, direccion, codTelefono, telefono, email, pais, tipoIdentificacion, identificacion } = req.body;

    try {

        // Consulta en la BD si existe el email
        const existeEmail = await Participante.findOne({ email });

        if (existeEmail) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const participante = new Participante(req.body);

        await participante.save();

        sendEmailPreRegistro.sendEmail(participante);

        res.json({
            ok: true,
            participante
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }

};

const actualizarParticipante = async (req, res = response) => {

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

};

const actualizarEstadoParticipante = async (req, res = response) => {

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
}

const getParticipante = async (req, res = response) => {

    // Definir el valor para traer los datos
    const id = req.query.id;

    const participante = await Participante.findById(id);

    res.json({
        ok: true,
        participante
    });

};

module.exports = {
    getParticipantes,
    crearParticipante,
    actualizarParticipante,
    actualizarEstadoParticipante,
    getParticipante
}
