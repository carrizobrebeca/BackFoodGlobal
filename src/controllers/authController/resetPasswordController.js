const crypto = require('crypto');
const { Usuario } = require('../../db');
const enviarCorreo = require('../../services/mailService'); // Asegúrate de que la función esté en el archivo correcto

const solicitarRestablecimientoContraseña = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'No hay ningún usuario con ese email.' });
    }

    // Generar token de restablecimiento y fecha de expiración
    const token = crypto.randomBytes(20).toString('hex');
    const expiracion = Date.now() + 3600000; // Token válido por 1 hora

    // Actualizar el usuario con el token y la fecha de expiración
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpires = expiracion;
    await usuario.save();

    // Enviar correo con el token
    const resetURL = `http://localhost:3000/reset?token=${token}`;
    const asunto = 'Solicitud de restablecimiento de contraseña';
    const mensaje = `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetURL}`;

    await enviarCorreo(email, asunto, mensaje);

    res.status(200).json({ message: 'Se ha enviado un correo con instrucciones para restablecer la contraseña.' });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error al solicitar restablecimiento de contraseña.' });
  }
};

module.exports = { solicitarRestablecimientoContraseña };
