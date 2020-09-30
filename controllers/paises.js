// Importación para tener las funciones del res
const { response } = require('express');

// Impotación del modelo
const Pais = require('../models/pais');

const getPaises = async (req, res = response) => {

    // Definir el valor para traer los datos
    const desde = Number(req.query.desde) || 0;

    const [paises, total] = await Promise.all([
        Pais.find({}, 'nombre phone_code').skip(desde).limit(10),
        Pais.countDocuments()
    ]);

    res.json({
        ok: true,
        paises,
        total
    });

};


module.exports = {
    getPaises
}
