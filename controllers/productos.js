// Importación para tener las funciones del res
const { response } = require('express');

// Impotación del modelo
const Producto = require('../models/producto');

const getProductos = async (req, res = response) => {

    const [productos] = await Promise.all([
        Producto.find({}, 'nombre name costo')
    ]);

    res.json({
        ok: true,
        productos
    });

};

const crearProducto = async (req, res = response) => {

    // Obtener datos del body de la petición
    const { nombre, name, costo } = req.body;

    try {

        // Consulta en la BD si existe el nombre
        const existeNombre = await Producto.findOne({ nombre });

        // Consulta en la BD si existe el name
        const existeName = await Producto.findOne({ name });

        if (existeNombre || existeName) {
            return res.status(404).json({
                ok: false,
                msg: 'Ya existe un producto con el mismo nombre'
            });
        }

        const producto = new Producto(req.body);

        await producto.save();
        
        res.json({
            ok: true,
            producto
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }

};

module.exports = {
    getProductos,
    crearProducto
}