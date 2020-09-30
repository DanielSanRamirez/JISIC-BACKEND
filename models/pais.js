const { Schema, model } = require('mongoose');

const PaisSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    iso3: {
        type: String,
        require: true
    },
    phone_code: {
        type: String,
        require: true
    }
}, {
    collection: 'paises' // Se coloca esta propiedad ya que mongo no puede poner plural 'es' solo 's'
});

// Este método me sirve para poder cambiar de _id a uid en la presentación de datos
PaisSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Pais', PaisSchema);