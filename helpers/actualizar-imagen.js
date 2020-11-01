const fs = require('fs');

const Inscripcion = require('../models/inscripcion');
const Pago = require('../models/pago');

const borrarImagen = (path) => {

    if (fs.existsSync(path)) {
        // Borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    
    let pathViejo = '';

    switch (tipo) {
        case 'participante':
            const inscripcion = await Inscripcion.findById(id);
            if (!inscripcion) {
                console.log('No es una inscripción por id');
                return false;
            }

            pathViejo = `./uploads/participante/${inscripcion.img}`;
            borrarImagen(pathViejo);

            inscripcion.img = nombreArchivo;
            await inscripcion.save();
            return true;
            break;

        case 'factura':
            const pago = await Pago.findById(id);
            if (!pago) {
                console.log('No es un pago por id');
                return false;
            }

            pathViejo = `./uploads/factura/${pago.imgDeposito}`;
            borrarImagen(pathViejo);

            pago.imgDeposito = nombreArchivo;
            pago.estadoInscripcion = true;
            await pago.save();

            const inscripciones = await Inscripcion.find({pago: id});
            inscripciones.forEach(async element => {
                element.estadoRecibo = true;
                await Inscripcion.findByIdAndUpdate(element._id, element, {new: true});
            });

            return true;
            break;

        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}