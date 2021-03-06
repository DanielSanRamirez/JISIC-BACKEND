const { response } = require("express");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['participante', 'factura'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El path está mal ingresado'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la image...
    const file = req.files.archivo;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    })

};

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const archivo = req.params.archivo;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${archivo}`);

    // Imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-image-available.png`);
        res.sendFile(pathImg);
    }

}

const downloadImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const archivo = req.params.archivo;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${archivo}`);
    res.download(pathImg, archivo, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = {
    fileUpload,
    retornaImagen,
    downloadImagen
}