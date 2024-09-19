const { Pedido } = require('../../db'); // Asegúrate de que la ruta sea correcta

const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll(); // Obtener todos los pedidos
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
};

module.exports = getPedidos;