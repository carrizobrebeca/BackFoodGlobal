const { Usuario } = require('../../db');

const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Verificar si el usuario ya estaba eliminado
    if (usuario.status === 'eliminado') {
      return res.status(400).json({ error: 'El usuario ya está eliminado.' });
    }

    // Actualizar el estado del usuario a 'eliminado' en lugar de eliminarlo permanentemente
    usuario.status = 'eliminado';
    await usuario.save();

    return res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
};

module.exports = deleteUsuario;
