/*
    Ruta: /api/pagos
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const {
    crearPago
} = require('../controllers/pagos');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//router.get('/', getParticipantes);

//router.get('/participante/', getParticipante);

router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('codTelefono', 'El código del teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('tipoIdentificacion', 'El tipo de identificacion es obligatorio').not().isEmpty(),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    check('nombreBanco', 'El nombre del banco es obligatorio').not().isEmpty(),
    check('numeroTransaccion', 'El número de la transacción es obligatorio').not().isEmpty(),
    check('fechaTransaccion', 'La fecha de la transacción es obligatoria').isDate(),
    validarCampos
], crearPago);

/*router.put('/estado/:id', [
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], actualizarEstadoParticipante);*/

module.exports = router;