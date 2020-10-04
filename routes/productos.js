/*
    Ruta: /api/productos
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const { getProductos, crearProducto } = require('../controllers/productos');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getProductos);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('costo', 'El costo es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

module.exports = router;