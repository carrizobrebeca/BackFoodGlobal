const { Negocio } = require('../../db');
const { Op } = require('sequelize'); // Importamos Op para operadores como iLike

const getNegocios = async (req, res) => {
  try {
    const { nombre, status } = req.query;
    
    let whereClause = { status: 'activo' }; // Por defecto, solo mostrar negocios activos

    if (nombre) {
      whereClause.nombre = {
        [Op.iLike]: `%${nombre}%`
      };
    }

    // Si se proporciona un estado en la consulta, ajustar el whereClause
    if (status && ['activo', 'bloqueado', 'eliminado'].includes(status)) {
      whereClause.status = status;
    }

    const negocios = await Negocio.findAll({ where: whereClause });

    if (negocios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron negocios.' });
    }

    return res.status(200).json(negocios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los negocios.' });
  }
};

module.exports = getNegocios;
