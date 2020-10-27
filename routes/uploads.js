/*
    Ruta: /api/uploads
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación para validaciones en la ruta
const { check } = require('express-validator');

// Importación del controlador
const { fileUpload, retornaImagen, downloadImagen } = require('../controllers/uploads');

// Importación para subir archivos
const expressFileUpload = require('express-fileupload');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', fileUpload);

router.get('/:tipo/:archivo', retornaImagen);

router.get('/descargar/:tipo/:archivo', downloadImagen);

module.exports = router;