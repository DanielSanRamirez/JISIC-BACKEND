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

const getProductosPaginado = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [productos, total] = await Promise.all([
        Producto
            .find({})
            .skip(desde)
            .limit(10),

        Producto.countDocuments()
    ]);

    res.json({
        ok: true,
        productos,
        total
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

const getDocumentosProducto = async (req, res = response) => {
    const valorBusqueda = req.params.busqueda;
    const regex = new RegExp(valorBusqueda, 'i');

    let data = [];

    data = await Producto.find({ nombre: regex });

    if (!data) {
        return res.status(400).json({
            ok: false,
            msg: 'El path tiene que ser .../coleccion/productos/...'
        });
    }

    res.json({
        ok: true,
        resultados: data
    });
}

const actualizarProducto = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const productoBD = await Producto.findById(uid);

        if (!productoBD) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un producto con ese id'
            });
        }

        // Actualización
        const { nombre, name, ...campos } = req.body;
        const regexNombre = new RegExp(nombre, 'i');
        const regexName = new RegExp(name, 'i');

        if (productoBD.nombre.toLowerCase() !== nombre.toLowerCase()) {
            const existeNombre = await Producto.findOne({
                nombre: regexNombre
            });
            if (existeNombre) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con ese nombre'
                });
            }
        }

        if (productoBD.name.toLowerCase() !== name.toLowerCase()) {
            const existeName = await Producto.findOne({
                name: regexName
            });
            if (existeName) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con ese name'
                });
            }
        }

        const productoActualizado = await Producto.findByIdAndUpdate(uid, req.body, { new: true });

        res.json({
            ok: true,
            producto: productoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        });
    }
}

const borrarProducto = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const productoDB = await Producto.findById(uid);

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un producto con ese id'
            });
        }

        await Producto.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Producto eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        })
    }
}

module.exports = {
    getProductos,
    crearProducto,
    getProductosPaginado,
    getDocumentosProducto,
    actualizarProducto,
    borrarProducto
}