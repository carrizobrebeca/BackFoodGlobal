const { Producto } = require('../../db');
const { Op } = require('sequelize');

const getProductos = async (req, res) => {
  try {
    const { nombre, status } = req.query; // Extrae el parámetro 'nombre' y 'status' de la consulta.

    const whereClause = {}; // Inicializa un objeto para la cláusula 'where'.

    if (nombre) {
      whereClause.nombre = {
        [Op.iLike]: `%${nombre}%`
      };
    }

    if (status && ['activo', 'bloqueado', 'eliminado'].includes(status)) {
      whereClause.status = status;
    }

    const productosDb = await Producto.findAll({
      where: whereClause // Aplica la cláusula 'where' para filtrar los productos.
    });

    if (productosDb.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos.' });
    }

    return res.status(200).json(productosDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos.' });
  }
};

module.exports = getProductos;


