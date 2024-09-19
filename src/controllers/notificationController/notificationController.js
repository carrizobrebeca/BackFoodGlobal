//? Usa el servicio de correo
const enviarCorreo = require('../../services/mailService');

// Controlador para enviar notificaciones por correo
const enviarNotificacionCorreo = async (req, res) => {
  const { email, asunto, mensaje } = req.body;

  try {
    // Usamos el servicio de envío de correos
    await enviarCorreo(email, asunto, mensaje);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ message: 'Error al enviar correo' });
  }
};

module.exports = {
  enviarNotificacionCorreo,
};
