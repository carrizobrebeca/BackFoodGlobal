const { Negocio } = require('../../db');

// Aprobar negocio
const aprobarNegocio = async (req, res) => {
  try {
    const negocio = await Negocio.findByPk(req.params.id);
    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    negocio.aprobado = true; // Suponiendo que tienes un campo 'aprobado' en tu modelo
    await negocio.save();

    return res.status(200).json({ message: 'Negocio aprobado con éxito.' });
  } catch (error) {
    console.error('Error al aprobar el negocio:', error);
    return res.status(500).json({ message: 'Error al aprobar el negocio.' });
  }
};

// Rechazar negocio
const rechazarNegocio = async (req, res) => {
  try {
    const negocio = await Negocio.findByPk(req.params.id);
    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    await negocio.destroy(); // Elimina el negocio si es rechazado
    return res.status(200).json({ message: 'Negocio rechazado y eliminado.' });
  } catch (error) {
    console.error('Error al rechazar el negocio:', error);
    return res.status(500).json({ message: 'Error al rechazar el negocio.' });
  }
};

module.exports = { aprobarNegocio, rechazarNegocio };
