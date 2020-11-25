var nodemailer = require('nodemailer');

exports.transporterEmails = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ejemplo@epn.ec',
        pass: '254lkhkhiu'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});