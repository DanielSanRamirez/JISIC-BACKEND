var nodemailer = require('nodemailer');

var {transporterEmails} = require('./transporte-emails');

// email sender function
exports.sendEmail = async function (req, res) {
    
    // Definimos el transporter
    const transporter = transporterEmails;

    // Definimos el email //https://jisic2021.herokuapp.com/email-confirmation //http://localhost:4200/email-confirmation
    var mailOptions = {
        from: "'JISIC' <jisic@epn.edu.ec>",
        to: req[1].email, //${req.email}
        subject: 'Notification of Rejection',
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

                    <h1>Problems have been found in your pre-registration:</h1>
 
                    <p>${req[0]}</p>  
                    
                    <p>Press the button below to re-upload your file to the Registration System JISIC:</p>

                    
                    <a href="${process.env.CORREO}rechazo/pre-inscripcion/${req[2]._id}" title="Continuar">
                        <img src="https://jisic.epn.edu.ec/images/inscripcion/button.png" alt="Continue Button" style="width:200px;height:auto;border:0;">
                    </a>

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