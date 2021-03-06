const { Schema, model } = require('mongoose');

// Importación para paginar
const mongoosePaginate = require('mongoose-paginate-v2');

const PagoSchema = Schema({
    estado: {
        type: Boolean,
        default: false
    },
    estadoInscripcion: {
        type: Boolean,
        default: true
    },
    nombres: {
        type: String,
        require: true
    },
    apellidos: {
        type: String
    },
    direccion: {
        type: String,
        require: true
    },
    codTelefono: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Pais'
    },
    telefono: {
        type: String,
        require: true
    },
    tipoIdentificacion: {
        type: String,
        require: true
    },
    identificacion: {
        type: String,
        require: true
    },
    nombreBanco: {
        type: String,
        require: true
    },
    numeroTransaccion: {
        type: Number,
        require: true
    },
    fechaTransaccion: {
        type: Date,
        require: true
    },
    imgDeposito: {
        type: String,
    },
    numeroFactura: {
        type: String,
    },
});

PagoSchema.plugin(mongoosePaginate);

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
PagoSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Pago', PagoSchema);