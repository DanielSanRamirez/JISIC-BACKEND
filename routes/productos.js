/*
    Ruta: /api/productos
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const {
    getProductos,
    crearProducto,
    getProductosPaginado,
    getDocumentosProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getProductos);

router.get('/pag/', getProductosPaginado);

router.get('/coleccion/nombre/:busqueda', getDocumentosProducto)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('costo', 'El costo es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

router.put('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('costo', 'El costo es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto);

router.delete('/:id', borrarProducto);

module.exports = router;