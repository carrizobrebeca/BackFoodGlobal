const { Negocio } = require('../../db');


const getDetailNegocios = async (req, res) => {
    try {
        const { id } = req.params;  // Extrae el 'id' de los parámetros de la ruta (req.params) en la URL
        const negocio = await Negocio.findByPk(id);  // Busca en la base de datos el negocio cuyo id coincida con el proporcionado utilizando 'findByPk', que encuentra una fila por su clave primaria (primary key)

        if (!negocio) {  // Si no se encuentra un negocio con el id dado
            return res.status(404).json({ message: 'Negocio no encontrado.' });  // Devuelve un mensaje de error 404 indicando que no se encontró el negocio
        }

        return res.status(200).json(negocio);  // Si se encuentra el negocio, devuelve los detalles del mismo con un código de éxito 200
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el negocio.' });  // Devuelve un mensaje de error 500 indicando un error interno del servidor
    }
};

module.exports = getDetailNegocios;  
