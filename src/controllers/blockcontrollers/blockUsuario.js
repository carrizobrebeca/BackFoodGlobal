// src/controllers/blockControllers/bloquearUsuario.js
const { Usuario } = require('../../db');

const bloquearUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario por su ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Cambiar el estado a 'bloqueado'
    usuario.status = 'bloqueado';
    await usuario.save();

    return res.status(200).json({ message: 'Usuario bloqueado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error al bloquear el usuario.' });
  }
};

module.exports = bloquearUsuario;
