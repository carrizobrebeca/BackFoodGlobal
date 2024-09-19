//? Configura y exporta el transportador


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu dirección de correo
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo
  },
});

module.exports = transporter;