const { Producto } = require('../../db');
const cloudinary = require('cloudinary').v2;

const postProductos = async (req, res) => {
  try {
    const { nombre, descripcion, precio, negocio_id, categoria, stock, imagen: imagenLocal, status } = req.body;
    let imagen = imagenLocal;

    if (!nombre || !descripcion || !precio || !negocio_id || !categoria || !stock) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    // Verificar si el producto ya existe por nombre
    const productoExistente = await Producto.findOne({
      where: { nombre }
    });

    if (productoExistente) {
      return res.status(400).json({ message: 'El producto ya existe.' });
    }

    // Subir la imagen a Cloudinary si es una ruta local o una URL externa
    if (imagen) {
      try {
        const uploadResult = await cloudinary.uploader.upload(imagen, {
          folder: 'foodglobal',
          resource_type: 'image',
        });
        imagen = uploadResult.secure_url; // Asegurarse de usar siempre la URL de Cloudinary
      } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return res.status(500).json({ message: 'Ocurrió un error al subir la imagen.', error: error.message });
      }
    }

    // Crear el nuevo producto en la base de datos con la URL de Cloudinary
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      negocio_id,
      imagen, // Guardar la URL de Cloudinary
      categoria,
      stock,
      status: status || 'activo' // Asignar un estado por defecto si no se proporciona uno
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ message: 'Ocurrió un error al crear el producto.' });
  }
};

module.exports = postProductos;
