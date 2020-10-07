var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = async function (req, res) {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jisic@epn.edu.ec',
            pass: 'JT2016PFvf'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
    // Definimos el email //https://jisic2021.herokuapp.com/email-confirmation //http://localhost:4200/email-confirmation
    var mailOptions = {
        from: "'JISIC 2021' <jisic@epn.edu.ec>",
        to: req.email, //${req.email}
        subject: 'Verificación de correo electrónico – JISIC2021',
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
                    <img class="imagenBanner" src="https://jisic.epn.edu.ec/images/jisic2019/JISIC-2019-banner-tipo-epn2-FINAL.jpg" alt="Banner de las JISIC">

                    <h1>Bienvenido(a),</h1>
 
                    <p>Usted se ha registrado con la siguiente información:</p> 
                    <p>Nombres: ${req.nombres}</p> 
                    <p>Apellidos: ${req.apellidos}</p> 
                    
                    <p>Estos datos serán usados para la emisión de certificados de participación en el evento.</p>
                    <p>Para activar su cuenta, pulse el botón de abajo para verificar su correo electrónico:</p>
                    
                    <a href="http://localhost:4200/email-confirmation" title="Ve a completar tu registro">
                        <img src="https://www.flaticon.es/svg/static/icons/svg/257/257198.svg" alt="HTML tutorial" style="width:200px;height:auto;border:0;">
                    </a>
                    

                    <p>Este mensaje se generó automáticamente por el sistema de inscripciones de JISIC.</p>
                    <p>Por favor, no responda a este mensaje.</p>
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
            res.status(200).jsonp(req.body);
        }
    });

};