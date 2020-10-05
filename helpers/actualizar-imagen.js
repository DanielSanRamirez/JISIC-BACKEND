const fs = require('fs');

const Inscripcion = require('../models/inscripcion');

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
            
            break;

        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}