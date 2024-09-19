const express = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../../db'); // Ajusta según la configuración de tu modelo
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Reemplaza CLIENT_ID con tu Client ID de Google

const loginUsuario = async (req, res) => {
  const { email, password, credential } = req.body;

  if ((!email && !password) && !credential) {
    return res.status(400).json({
      error: 'Faltan datos',
      message: 'Debes enviar las credenciales correctamente. Se requiere un par de email y password, o un campo credential.',
    });
  }

  try {
    if (email && password) {
      // Buscar al usuario por email
      const user = await Usuario.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar la contraseña
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Generar el token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user });
    }

    if (credential) {
      // Validar Token y Desencriptar Token
      const dataUsuario = await verifyToken(credential);
      const user = await Usuario.findOne({ where: { email: dataUsuario.email } });

      if (user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user });
      } else {
        const nuevoUsuario = await Usuario.create({
          nombre: dataUsuario.given_name,
          apellido: dataUsuario.family_name,
          imagen: dataUsuario.picture,
          email: dataUsuario.email,
          rol: "usuario"
        });

        const token = jwt.sign({ id: nuevoUsuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user: nuevoUsuario });
      }
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

async function verifyToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Especifica el CLIENT_ID correcto que fue usado para generar el token
    });

    const payload = ticket.getPayload();
    return payload; // Contiene la información del usuario autenticado
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Token no válido');
  }
}

module.exports = loginUsuario;

