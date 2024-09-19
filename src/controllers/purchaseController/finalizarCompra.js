const { conn: sequelize, Pedido, Pedido_Producto, Producto, Usuario } = require('../../db');
const enviarCorreo = require('../../services/mailService');

const finalizarCompra = async (req, res) => {
  const { usuario_id, negocio_id, productos, tipo_entrega, estado = 'pendiente', datos_entrega } = req.body;
  const io = req.io; // Obteniendo la instancia de Socket.IO desde req

  // Validación de campos requeridos
  if (!usuario_id || !negocio_id || !productos || !Array.isArray(productos) || productos.length === 0 || !tipo_entrega || !datos_entrega) {
    return res.status(400).json({ message: 'Faltan datos requeridos: usuario_id, negocio_id, productos, tipo_entrega o datos_entrega.' });
  }

  // Validación de datos según el tipo de entrega
  if (tipo_entrega === 'domicilio') {
    const { ciudad, direccion_envio, codigo_postal } = datos_entrega;
    if (!ciudad || !direccion_envio || !codigo_postal) {
      return res.status(400).json({ message: 'Faltan datos de entrega para el tipo de entrega domicilio.' });
    }
  } else if (tipo_entrega === 'retiro') {
    const { nombre, documento_identidad } = datos_entrega;
    if (!nombre || !documento_identidad) {
      return res.status(400).json({ message: 'Faltan datos de retiro: nombre o documento de identidad.' });
    }
  } else {
    return res.status(400).json({ message: 'Tipo de entrega no válido.' });
  }

  // Iniciar la transacción
  const transaction = await sequelize.transaction();

  try {
    let total = 0;
    for (const item of productos) {
      const producto = await Producto.findByPk(item.producto_id, { transaction });
      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ message: `Producto ${item.producto_id} no encontrado.` });
      }
      if (producto.stock < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({ message: `No hay suficiente stock para el producto ${item.producto_id}.` });
      }
      total += producto.precio * item.cantidad;
    }

    // Crear el pedido
    const nuevoPedido = await Pedido.create({
      usuario_id,
      negocio_id,
      fecha: new Date(),
      total,
      tipo_entrega,
      estado,
      ...(tipo_entrega === 'domicilio' && {
        ciudad: datos_entrega.ciudad,
        direccion_envio: datos_entrega.direccion_envio,
        codigo_postal: datos_entrega.codigo_postal,
      }),
      ...(tipo_entrega === 'retiro' && {
        nombre: datos_entrega.nombre,
        documento_identidad: datos_entrega.documento_identidad,
      }),
    }, { transaction });

    // Guardar los detalles del pedido
    const detalles = productos.map(item => ({
      pedido_id: nuevoPedido.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
    }));

    await Pedido_Producto.bulkCreate(detalles, { transaction });

    // Actualizar el stock
    for (const item of productos) {
      const producto = await Producto.findByPk(item.producto_id, { transaction });
      await producto.update({ stock: producto.stock - item.cantidad }, { transaction });
    }

    // Finalizar la transacción
    await transaction.commit();

    // Enviar correo al usuario
    const usuario = await Usuario.findByPk(usuario_id);
    const asunto = 'Compra exitosa - Tu pedido está en proceso';
    const mensaje = `Gracias por tu compra, ${usuario.nombre}. Tu pedido está en proceso de armado.`;

    try {
      await enviarCorreo(usuario.email, asunto, mensaje);
      if (io && typeof io.emit === 'function') {
        io.emit(`pedido_${usuario_id}`, {
          message: 'Compra finalizada con éxito. Tu pedido está en proceso de armado.',
          pedido: nuevoPedido,
        });
      } else {
        console.error('Socket.IO no está disponible.');
      }
    } catch (error) {
      console.error('Error al enviar el correo o emitir evento:', error);
    }

    const datosEntrega = tipo_entrega === 'domicilio'
      ? {
        ciudad: nuevoPedido.ciudad,
        direccion_envio: nuevoPedido.direccion_envio,
        codigo_postal: nuevoPedido.codigo_postal,
      }
      : {
        nombre: nuevoPedido.nombre,
        documento_identidad: nuevoPedido.documento_identidad,
      };

    return res.status(200).json({
      message: 'Compra finalizada con éxito.',
      pedido: {
        id: nuevoPedido.id,
        usuario_id: nuevoPedido.usuario_id,
        negocio_id: nuevoPedido.negocio_id,
        fecha: nuevoPedido.fecha,
        total: nuevoPedido.total,
        tipo_entrega: nuevoPedido.tipo_entrega,
        estado: nuevoPedido.estado,
        productos: productos.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })),
        datos_entrega: datosEntrega,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: 'Ocurrió un error al finalizar la compra.', error: error.message });
  }
};

module.exports = finalizarCompra;