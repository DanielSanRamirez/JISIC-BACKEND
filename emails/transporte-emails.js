var nodemailer = require('nodemailer');

exports.transporterEmails = nodemailer.createTransport({
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