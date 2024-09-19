const { Negocio } = require('../../db'); 

const bloquearNegocio = async (req, res) => {
  try {
    const { id } = req.params;

    const negocio = await Negocio.findByPk(id);

    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    // Cambiar el estado a 'bloqueado'
    negocio.status = 'bloqueado';
    await negocio.save();

    return res.status(200).json({ message: 'Negocio bloqueado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error al bloquear el negocio.' });
  }
};

module.exports = bloquearNegocio;
