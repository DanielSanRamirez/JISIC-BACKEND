// Importación para tener las funciones del res
const { response } = require('express');

// Impotación del modelo
const Pais = require('../models/pais');

const getPaises = async (req, res = response) => {

    const [paises] = await Promise.all([
        Pais.find({}, 'nombre name phone_code').sort('nombre'),
        
    ]);

    res.json({
        ok: true,
        paises,
        
    });

};


module.exports = {
    getPaises
}
