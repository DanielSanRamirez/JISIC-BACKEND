// Importación para tener las funciones del res
const { response } = require('express');

const path = require('path');
const inscripcion = require('../models/inscripcion');

// Impotación del modelo
const Inscripcion = require('../models/inscripcion');
const Pais = require('../models/pais');
const Participante = require('../models/participante');

const getReporte = async (req, res = response) => {

    const tipo = req.params.tipo;

    switch (tipo) {
        case 'pre-inscripcion':
            reportePreInscripcion().then(
                resp => {
                    if (resp) {
                        const pathReporte = path.join(__dirname, `../reports/pre-inscripcion.xlsx`);
                        res.download(pathReporte, 'pre-inscripcion.xlsx', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            );
            break;

        case 'por-pagar':
            reportePorPagar().then(
                resp => {
                    if (resp) {
                        const pathReporte = path.join(__dirname, `../reports/por-pagar.xlsx`);
                        res.download(pathReporte, 'por-pagar.xlsx', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            );
            break;

        case 'pagos':
            reportePagos().then(
                resp => {
                    if (resp) {
                        const pathReporte = path.join(__dirname, `../reports/pagos.xlsx`);
                        res.download(pathReporte, 'pagos.xlsx', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            );
            break;

        case 'inscritos':
            reporteInscritos().then(
                resp => {
                    if (resp) {
                        const pathReporte = path.join(__dirname, `../reports/inscritos.xlsx`);
                        res.download(pathReporte, 'inscritos.xlsx', (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            );
            break;
        default:
            break;
    }



}

const reportePreInscripcion = async function exTest() {
    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();

    const [participantes] = await Promise.all([
        Inscripcion.find({ estado: false, estadoParticipante: true }).populate('participante').populate('producto')
    ]);



    const sheet = workbook.addWorksheet('Pre-Inscripcion');

    sheet.columns = [
        { header: 'IDENTIFICACIÓN', key: 'identificacion', width: 20 },
        { header: 'PARTICIPANTE', key: 'participante', width: 50 },
        { header: 'EMAIL', key: 'email', width: 40 },
        { header: 'TIPO DE INSCRIPCIÓN', key: 'tipoInscripcion', width: 50 },
    ];

    participantes.forEach(element => {
        sheet.addRow({
            identificacion: element.participante.identificacion,
            participante: `${element.participante.apellidos} ${element.participante.nombres}`,
            email: element.participante.email,
            tipoInscripcion: element.producto.nombre
        });
    });

    const pathReporte = path.join(__dirname, `../reports/pre-inscripcion.xlsx`);
    await workbook.xlsx.writeFile(pathReporte);

    return true;
}

const reportePorPagar = async function exTest() {
    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();

    const [participantes] = await Promise.all([
        Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: false }).populate('participante').populate('producto')
    ]);

    const [paises] = await Promise.all([
        Pais.find({})
    ]);

    const sheet = workbook.addWorksheet('Pre-Inscripcion');

    sheet.columns = [
        { header: 'IDENTIFICACIÓN', key: 'identificacion', width: 20 },
        { header: 'PARTICIPANTE', key: 'participante', width: 50 },
        { header: 'EMAIL', key: 'email', width: 40 },
        { header: 'TELEFONO', key: 'telefono', width: 15 },
        { header: 'TIPO DE INSCRIPCIÓN', key: 'tipoInscripcion', width: 50 },
    ];

    participantes.forEach(element => {
        paises.forEach(elementPaises => {
            if (String(element.participante.codTelefono) === String(elementPaises._id)) {
                sheet.addRow({
                    identificacion: element.participante.identificacion,
                    participante: `${element.participante.apellidos} ${element.participante.nombres}`,
                    email: element.participante.email,
                    telefono: `+${elementPaises.phone_code} ${element.participante.telefono}`,
                    tipoInscripcion: element.producto.nombre
                });
            }
        });
    });

    const pathReporte = path.join(__dirname, `../reports/por-pagar.xlsx`);
    await workbook.xlsx.writeFile(pathReporte);

    return true;
}

const reportePagos = async function exTest() {

    let inscritos = [];

    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();

    const [participantes] = await Promise.all([
        Participante.find({ estado: true, estadoInscrito: true })
    ]);

    const [inscripciones] = await Promise.all([
        Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: true })
            .populate('participante')
            .populate('pago')
    ]);

    participantes.forEach(element => {
        inscripciones.forEach(elementInscripciones => {
            if (String(element._id) === String(elementInscripciones.participante._id)) {
                if (inscritos.length === 0) {
                    inscritos.push(elementInscripciones)
                } else {
                    inscritos.forEach(elementInscritos => {
                        //console.log(elementInscritos);
                        if (String(elementInscritos.participante._id) !== String(elementInscripciones.participante._id)) {
                            inscritos.push(elementInscripciones);
                        }
                    });
                }
            }
        });
    });

    const sheet = workbook.addWorksheet('Pagos');

    sheet.columns = [
        { header: 'PARTICIPANTE', key: 'participante', width: 50 },
        { header: 'N° DE COMPROBANTE', key: 'numComprobante', width: 40 },
        { header: 'IDENTIFICACION', key: 'identificacion', width: 15 },
        { header: 'CLIENTE', key: 'cliente', width: 50 },
        { header: 'N° DE FACTURA', key: 'numFactura', width: 15 },
        { header: 'FECHA DE PAGO', key: 'fechaPago', width: 15 },
        { header: 'VALOR CANCELADO', key: 'valorCancelado', width: 20 },
    ];

    inscritos.forEach(element => {
        sheet.addRow({
            participante: `${element.participante.apellidos} ${element.participante.nombres}`,
            numComprobante: element.pago.numeroTransaccion,
            identificacion: element.pago.identificacion,
            cliente: `${element.pago.apellidos} ${element.pago.nombres}`,
            numFactura: element.pago.numeroFactura,
            fechaPago: element.pago.fechaTransaccion,
            valorCancelado: element.costoTotal,
        });
    });

    const pathReporte = path.join(__dirname, `../reports/pagos.xlsx`);
    await workbook.xlsx.writeFile(pathReporte);

    return true;
}

const reporteInscritos = async function exTest() {
    const ExcelJS = require('exceljs');

    const workbook = new ExcelJS.Workbook();

    const [participantes] = await Promise.all([
        Inscripcion.find({ estado: true, estadoParticipante: true, estadoRecibo: true, estadoInscrito: true })
            .populate('participante')
            .populate('producto')
            .populate('pago')
    ]);

    const [paises] = await Promise.all([
        Pais.find({})
    ]);

    const sheet = workbook.addWorksheet('Inscritos');

    sheet.columns = [
        { header: 'PARTICIPANTE', key: 'participante', width: 50 },
        { header: 'IDENTIFICACIÓN', key: 'identificacion', width: 20 },
        { header: 'EMAIL', key: 'email', width: 40 },
        { header: 'TELEFONO', key: 'telefono', width: 15 },
        { header: 'DIRECCIÓN', key: 'direccion', width: 15 },
        { header: 'TIPO DE INSCRIPCIÓN', key: 'tipoInscripcion', width: 50 },
    ];

    participantes.forEach(element => {
        paises.forEach(elementPaises => {
            if (String(element.participante.codTelefono) === String(elementPaises._id)) {
                sheet.addRow({
                    participante: `${element.participante.apellidos} ${element.participante.nombres}`,
                    identificacion: element.participante.identificacion,
                    email: element.participante.email,
                    telefono: `+${elementPaises.phone_code} ${element.participante.telefono}`,
                    direccion: element.participante.direccion,
                    tipoInscripcion: element.producto.nombre
                });
            }
        });
    });

    const pathReporte = path.join(__dirname, `../reports/inscritos.xlsx`);
    await workbook.xlsx.writeFile(pathReporte);

    return true;
}

module.exports = {
    getReporte
}
