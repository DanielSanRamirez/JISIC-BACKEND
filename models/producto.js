const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    costo: {
        type: Number,
        require: true
    }
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
ProductoSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Producto', ProductoSchema);