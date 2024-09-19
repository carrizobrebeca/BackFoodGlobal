const { Negocio } = require('../../db');



const deleteNegocio = async (req, res) => {
    try {
      const { id } = req.params;
  
      const negocio = await Negocio.findByPk(id);
  
      if (!negocio) {
        return res.status(404).json({ message: 'Negocio no encontrado.' });
      }
  
      // Cambiar el estado a 'eliminado' en lugar de eliminar físicamente el negocio
      negocio.status = 'eliminado';
      await negocio.save();
  
      return res.status(200).json({ message: 'Negocio marcado como eliminado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Ocurrió un error al eliminar el negocio.' });
    }
  };
  

module.exports = deleteNegocio;
