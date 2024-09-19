// controllers/blockcontrollers/bloquearProducto.js
const { Producto } = require('../../db');

const bloquearProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto por ID
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Cambiar el estado a 'bloqueado'
    producto.status = 'bloqueado';
    await producto.save();

    return res.status(200).json({ message: 'Producto bloqueado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error al bloquear el producto.' });
  }
};

module.exports = bloquearProducto;
