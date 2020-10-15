const { Schema, model } = require('mongoose');

const ParticipanteSchema = Schema({
    nombres: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
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
    email: {
        type: String,
        require: true,
        unique: true
    },
    pais: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Pais'
    },
    tipoIdentificacion: {
        require: true,
        type: String,
    },
    identificacion: {
        require: true,
        type: String,
    },
    estado: {
        type: Boolean,
        default: false
    },
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
ParticipanteSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Participante', ParticipanteSchema);