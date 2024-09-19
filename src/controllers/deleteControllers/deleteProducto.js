const { Producto } = require('../../db');

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Cambiar el estado a 'eliminado' en lugar de eliminar físicamente
    producto.status = 'eliminado';
    await producto.save();

    return res.status(200).json({ message: 'Producto marcado como eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error al eliminar el producto.' });
  }
};

module.exports = deleteProducto;


