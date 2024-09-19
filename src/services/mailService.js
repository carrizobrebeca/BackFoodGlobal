//?  Usa el transportador importado desde emailConfig.js para enviar correos.


const transporter = require('./emailConfig'); // Asegúrate de que la ruta sea correcta



const enviarCorreo = async (destinatario, asunto, mensaje) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Correo de origen
    to: destinatario,             // Correo del destinatario
    subject: asunto,              // Asunto del correo
    text: mensaje,                // Mensaje del correo
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito a', destinatario);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error; // Lanza el error para manejarlo donde se llame la función
  }
};

module.exports = enviarCorreo;