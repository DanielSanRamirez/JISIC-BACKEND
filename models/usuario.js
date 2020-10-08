const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    perfil: {
        type: String,
        require: true
    },
    nombres: {
        type: String,
        require: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
UsuarioSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
});

module.exports = model('Usuario', UsuarioSchema);