const { Schema, model } = require('mongoose');

// Importación para paginar
const mongoosePaginate = require('mongoose-paginate-v2');

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
    institucion: {
        type: String,
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
    },
    estadoParticipante: {
        type: Boolean,
        default: false
    },
    pago: {
        type: Schema.Types.ObjectId,
        ref: 'Pago'
    },
}, {
    collection: 'inscripciones' // Se coloca esta propiedad ya que mongo no puede poner plural 'es' solo 's'
});

InscripcionSchema.plugin(mongoosePaginate);

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
InscripcionSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Inscripcion', InscripcionSchema);