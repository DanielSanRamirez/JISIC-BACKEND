/*
    Ruta: /api/inscripciones
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const {
    crearInscripcion,
    getInscripcionPaginado,
    getInscripcion,
    getInscripciones,
    getInscripcionPorPago
} = require('../controllers/inscripciones');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/inscripciones/', getInscripciones);

router.get('/inscripcion', getInscripcion);

router.get('/inscripcion/pago', getInscripcionPorPago);

router.post('/', [
    check('participante', 'El id del Participante es obligatorio').not().isEmpty(),
    check('producto', 'El id del Producto es obligatorio').not().isEmpty(),
    check('costoTotal', 'El costo total es obligatorio').not().isEmpty(),
    validarCampos
], crearInscripcion);

module.exports = router;