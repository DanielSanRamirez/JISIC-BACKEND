/*
    Ruta: /api/por-pagar
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
// const { check } = require('express-validator');

// Importación de los controllers
const { 
    getPorPagarPaginado, 
    getDocumentosPorPagar 
} = require('../controllers/por-pagar');

// Importación de middlewares
// const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getPorPagarPaginado);

router.get('/coleccion/:dato/:busqueda', getDocumentosPorPagar);

/*router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('codTelefono', 'El código del teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    check('tipoIdentificacion', 'El tipo de identificacion es obligatorio').not().isEmpty(),
    check('identificacion', 'La identificacion es obligatoria').not().isEmpty(),
    validarCampos
], );

router.put('/:id', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('codTelefono', 'El código del teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('pais', 'El país es obligatorio').not().isEmpty(),
    validarCampos
], );

router.put('/estado/:id', [
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    validarCampos
], );*/

module.exports = router;