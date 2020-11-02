/*
    Ruta: /api/inscritos
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación de los controllers
const { getInscritos, getDocumentosInscritos } = require('../controllers/inscritos');

// Importación de middlewares
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', getInscritos);

router.get('/coleccion/:dato/:busqueda', getDocumentosInscritos);

module.exports = router;