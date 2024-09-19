const { Pedido, Producto } = require('../../db');

const obtenerPedidoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id, {
      include: {
        model: Producto,
        as: 'productos', // Debe coincidir con el alias definido en las asociaciones
        through: {
          attributes: ['cantidad'], // Si quieres incluir atributos adicionales de la tabla intermedia
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

module.exports = { obtenerPedidoPorId };
