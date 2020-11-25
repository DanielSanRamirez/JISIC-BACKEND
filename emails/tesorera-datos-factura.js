var nodemailer = require('nodemailer');

const path = require('path');

var { transporterEmails } = require('./transporte-emails');

// email sender function
exports.sendEmail = async function (req, res) {

    // Definimos el transporter
    const transporter = await transporterEmails;

    // Definimos el email //https://jisic2021.herokuapp.com/email-confirmation //http://localhost:4200/email-confirmation
    var mailOptions = {
        from: "'JISIC' <ejemplo@epn.ec>",
        to: 'danielsanramirez@hotmail.com', //${req.email}
        subject: 'Pago Inscripciones JISIC',
        attachments: [{
            filename: req.pago.imgDeposito,
            path: path.join(__dirname, `../uploads/factura/${req.pago.imgDeposito}`)
        }], function(err, info) {
            if (err) {
                console.error(err);
                res.send(err);
            }
            else {
                console.log(info);
                res.send(info);
            }
        },
        html: `
        <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                            background-color: #FDFEFE;
                        }

                        h1 {
                            color: #7FB3D5;
                        }
                        .imagenBanner {
                            width: 100%;
                            height:auto;
                        }
                    </style>
                </head>
                <body>
                    <img class="imagenBanner" src="https://jisic.epn.edu.ec/images/inscripcion/bannerEmail.jpg" alt="Banner de las JISIC">

                    <h1>Estimada,</h1>
 
                    <p>El participante ${req.participante.nombres} ${req.participante.apellidos} ha realizado un pago de inscripción a las JISIC con los siguientes datos:</p>

                    <p><strong>Cliente:</strong> ${req.pago.nombres} ${req.pago.apellidos}</p>
                    <p><strong>Tipo de Identificación:</strong> ${req.pago.tipoIdentificacion}</p>
                    <p><strong>Identificación:</strong> ${req.pago.identificacion}</p>
                    <p><strong>Dirección:</strong> ${req.pago.direccion}</p>
                    <p><strong>Teléfono:</strong> ${req.pago.telefono}</p>
                    <p><strong>Email:</strong> ${req.participante.email}</p>
                    <p><strong>Número de comprobante de pago:</strong> ${req.pago.numeroTransaccion}</p>
                    <p><strong>Banco desde el que se emitió la Transferencia:</strong> ${req.pago.nombreBanco}</p>
                    <p><strong>Valor cancelado:</strong> ${req.costoTotal}</p>

                    <p>En el archivo adjunto se encuentra una copia del depósito realizado para su validación.</p>

                    <p>Este mensaje se generó automáticamente por el Sistema de Registro JISIC</p>

                    <script>
                        if(${req.pago.tipoIdentificacion} === "1") {
                            document.getElementById("tipoIdentificacion").innerHTML = "Cédula de Identidad";
                        } else {
                            document.getElementById("tipoIdentificacion").innerHTML = "RUC";
                        }
                    </script> 

                </body>
            </html>
        `
    };

    // Enviamos el email
    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
            //res.send(500, err.message);
        } else {
            //console.log("Email sent", info.messageId);
            res.status(200).jsonp(req[0].body);
        }
    });

};