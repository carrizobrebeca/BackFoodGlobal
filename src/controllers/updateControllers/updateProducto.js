const { Producto } = require('../../db');
const cloudinary = require('cloudinary').v2;

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, stock, imagen: imagenLocal, status } = req.body;

  try {
    // Obtener el producto existente de la base de datos
    const productoExistente = await Producto.findByPk(id);

    if (!productoExistente) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    let imagen = productoExistente.imagen; // Mantener la imagen existente por defecto

    // Manejo de la imagen
    if (imagenLocal) {
      try {
        // Subir la nueva imagen a Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imagenLocal, {
          folder: 'foodglobal',
          resource_type: 'image',
        });
        imagen = uploadResult.secure_url; // Actualizar con la URL de Cloudinary
      } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return res.status(500).json({ message: 'Ocurrió un error al subir la imagen.', error: error.message });
      }
    }

    // Actualizar solo los campos que se proporcionaron en la solicitud
    const camposActualizados = {
      nombre: nombre || productoExistente.nombre,
      descripcion: descripcion || productoExistente.descripcion,
      precio: precio || productoExistente.precio,
      imagen, // Guardar la URL de Cloudinary o la existente
      categoria: categoria || productoExistente.categoria,
      stock: stock || productoExistente.stock,
      status: status || productoExistente.status,
    };

    // Actualizar el producto en la base de datos
    const [affectedRows] = await Producto.update(camposActualizados, {
      where: { id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no actualizado' });
    }

    res.json({ mensaje: 'Producto actualizado exitosamente', producto: camposActualizados });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
};

module.exports = updateProducto;
