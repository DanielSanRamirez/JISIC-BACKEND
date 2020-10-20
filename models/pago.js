const { Schema, model } = require('mongoose');

const PagoSchema = Schema({
    estado: {
        type: Boolean,
        default: false
    },
    inscripcion: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Inscripcion'
    },
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
PagoSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Pago', PagoSchema);