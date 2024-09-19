// Importa los modelos de Negocio y Producto desde el archivo de base de datos (db)
const { Negocio, Producto, Op } = require('../../db'); //En Sequelize, Op es un objeto que contiene operadores para construir consultas más complejas y realizar comparaciones en las consultas a la base de datos. 

const getProductosPorNegocio = async (req, res) => {
  try {
    // Obtiene el ID del negocio y el nombre del negocio desde los parámetros de la URL o la consulta
    const { negocioId } = req.params;
    const { nombre } = req.query; // Utiliza req.query para obtener parámetros de búsqueda de la URL

    // Define las opciones de búsqueda para el nombre del negocio
    const opcionesBusqueda = {};

    // Si se proporciona un nombre, agrega una condición de búsqueda por nombre del negocio
    if (nombre) {
      opcionesBusqueda.where = {
        nombre: {
          [Op.iLike]: `%${nombre}%`, // Utiliza el operador iLike para una búsqueda insensible a mayúsculas/minúsculas
        },
      };
    }

    // Buscar el negocio en la base de datos por su ID, incluyendo sus productos asociados
    const negocio = await Negocio.findOne({
      where: negocioId ? { id: negocioId } : opcionesBusqueda.where, // Filtra por ID o por nombre según los parámetros proporcionados
      include: {
        model: Producto,    // Incluye el modelo Producto en la consulta
        as: 'Productos',    // Utiliza el alias 'Productos' definido en la relación entre Negocio y Producto
      },
    });

    // Si el negocio no es encontrado, devuelve un mensaje de error 404
    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado.' });
    }

    // Si el negocio es encontrado, devuelve los productos asociados en la respuesta con un estado 200
    return res.status(200).json(negocio.Productos);
  } catch (error) {
    // Si ocurre un error durante la ejecución, imprime el error en la consola
    console.error(error);
    // Devuelve un mensaje de error genérico con estado 500
    return res.status(500).json({ message: 'Ocurrió un error al obtener los productos del negocio.' });
  }
};

// Exporta la función getProductosPorNegocio para que pueda ser utilizada en otros archivos
module.exports = getProductosPorNegocio;
