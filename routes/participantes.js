/*
    Ruta: /api/participantes
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const { getParticipantes, crearParticipante, actualizarParticipante } = require('../controllers/participantes');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getParticipantes);

router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('codTelefono', 'El código del teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    validarCampos
], crearParticipante);

router.put('/:id', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('codTelefono', 'El código del teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    validarCampos
], actualizarParticipante);

module.exports = router;