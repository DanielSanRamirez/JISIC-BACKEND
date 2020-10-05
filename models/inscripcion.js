const { Schema, model } = require('mongoose');

const InscripcionSchema = Schema({
    participante: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Participante'
    },
    producto: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    tipoIdentificacion: {
        type: String,
        require: true
    },
    identificacion: {
        type: String,
        require: true
    },
    costoTotal: {
        type: Number,
        require: true
    },
    img: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'inscripciones' // Se coloca esta propiedad ya que mongo no puede poner plural 'es' solo 's'
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
InscripcionSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Inscripcion', InscripcionSchema);