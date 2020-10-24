var nodemailer = require('nodemailer');

var {transporterEmails} = require('./transporte-emails');

// email sender function
exports.sendEmail = async function (req, res) {
    
    // Definimos el transporter
    const transporter = transporterEmails;

    // Definimos el email //https://jisic2021.herokuapp.com/email-confirmation //http://localhost:4200/email-confirmation
    var mailOptions = {
        from: "'JISIC' <jisic@epn.edu.ec>",
        to: req[0].email, //${req.email}
        subject: 'Inscripción JISIC',
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

                    <h1>Su preinscripción ha sido Aprobada.</h1>
 
                    <p>Para continuar con el proceso de inscripción debe cancelar la cantidad de: ${req[1]} USD durante los próximos 5 días.</p>  
                    
                    <p>Se recomienda a los estudiantes de la EPN realizar el pago en Tesorería, acercándose previamente a la Secretaría de la Facultad de Ingeniería de Sistemas.</p>
                    <p>Para transferencias bancarias, por favor usar la siguiente información:</p>

                    <p>Banco: Pichincha</p>
                    <p>Tipo de cuenta: Corriente</p>
                    <p>Número: 3245292604</p>
                    <p>Destinatario: Escuela Politécnica Nacional</p>
                    <p>RUC: 1760005620001</p>
                    <p>Sublínea 130108</p>
                    <p>Dirección del banco: Av. Amazonas y Pereira</p>
                    <p>Teléfono: 2980-980</p>

                    <p>Los costos de transferencia deberán ser cubiertos por el participante. Por favor, tenga en cuenta que estos costos pueden variar entre diferentes bancos.</p>
                    <p>Una vez realizada la transferencia debe llenar el formulario de pago disponible dando click en el siguiente botón:</p>

                    
                    <a href="http://localhost:4200/email-confirmation/${req[0]._id}" title="Continuar">
                        <img src="https://jisic.epn.edu.ec/images/inscripcion/button.png" alt="Continue Button" style="width:200px;height:auto;border:0;">
                    </a>
                    

                    <p>El formulario debe ser llenado hasta 24 horas después de haber realizado el pago o la transferencia. Caso contrario, su registro puede quedar sin identificar.</p>
                    
                    <p>Su inscripción será aprobada cuando la información del formulario sea verificada.</p>
                    <p>Este mensaje se generó automáticamente por el sistema de inscripciones de JISIC. Por favor, no responda a este mensaje.</p>

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