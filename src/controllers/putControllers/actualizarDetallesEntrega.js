const { Pedido } = require('../../db');

const actualizarDetallesEntrega = async (req, res) => {
  const { tipo_entrega, datos_entrega } = req.body;
  const { pedido_id } = req.params; // Obtener el pedido_id desde los parámetros de la ruta

  try {
    // Buscar el pedido por ID
    const pedido = await Pedido.findByPk(pedido_id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado.' });
    }

    // Verificar el tipo de entrega y los datos requeridos
    if (tipo_entrega === 'retiro') {
      // Verificar que los datos necesarios para la entrega por retiro estén presentes
      const { nombre_persona, documento_identidad } = datos_entrega;
      if (!nombre_persona || !documento_identidad) {
        return res.status(400).json({ message: 'Faltan datos para la entrega por retiro.' });
      }

      // Actualizar solo los datos para el retiro y limpiar los datos de domicilio
      await pedido.update({
        tipo_entrega: 'retiro',
        nombre_persona,
        documento_identidad,
        ciudad: null, // Limpiar los datos de domicilio si antes fue seleccionado
        direccion_envio: null,
        codigo_postal: null,
      });

    } else if (tipo_entrega === 'domicilio') {
      // Verificar que los datos necesarios para la entrega a domicilio estén presentes
      const { ciudad, direccion_envio, codigo_postal } = datos_entrega;
      if (!ciudad || !direccion_envio || !codigo_postal) {
        return res.status(400).json({ message: 'Faltan datos para la entrega a domicilio.' });
      }

      // Actualizar solo los datos para la entrega a domicilio y limpiar los datos de retiro
      await pedido.update({
        tipo_entrega: 'domicilio',
        ciudad,
        direccion_envio,
        codigo_postal,
        nombre_persona: null, // Limpiar los datos de retiro si antes fue seleccionado
        documento_identidad: null,
      });

    } else {
      // Si el tipo de entrega no es válido, devolver un error
      return res.status(400).json({ message: 'Tipo de entrega no válido.' });
    }

    // Obtener el pedido actualizado para retornarlo en la respuesta
    const pedidoActualizado = await Pedido.findByPk(pedido_id);

    // Devolver el pedido actualizado como respuesta
    return res.status(200).json({
      message: 'Detalles de entrega actualizados correctamente.',
      pedido: pedidoActualizado
    });

  } catch (error) {
    // Manejo de errores
    return res.status(500).json({ message: 'Error al actualizar los detalles de entrega.', error: error.message });
  }
};

module.exports = { actualizarDetallesEntrega };
