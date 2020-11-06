/*
    Ruta: /api/reportes
*/

// Importación para definir rutas
const { Router } = require('express');

// Importación de los controllers
const {
    getReporte
} = require('../controllers/reportes');

const router = Router();

router.get('/:tipo', getReporte);

module.exports = router;