const { Schema, model } = require('mongoose');

// Importación para paginar
const mongoosePaginate = require('mongoose-paginate-v2');

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

ProductoSchema.plugin(mongoosePaginate);

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
ProductoSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Producto', ProductoSchema);