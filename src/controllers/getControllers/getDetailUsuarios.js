const { Usuario } = require('../../db');


const getDetailUsuarios = async (req, res) => {
    try {
        const { id } = req.params;  // Extrae el parámetro 'id' de los parámetros de la solicitud (req.params) en la URL de la solicitud

        const usuario = await Usuario.findByPk(id);  // Busca un usuario en la base de datos usando el ID proporcionado

        if (!usuario) {  // Si no se encuentra ningún usuario con el ID proporcionado
            return res.status(404).json({ message: 'Usuario no encontrado.' });  // Responde con un código de estado 404 y un mensaje indicando que el usuario no fue encontrado
        }

        return res.status(200).json(usuario);  // Si el usuario es encontrado, responde con un código de estado 200 y devuelve el usuario en formato JSON
    } catch (error) {  // Captura cualquier error que ocurra durante la ejecución
        console.error(error);  // Imprime el error en la consola para facilitar la depuración
        return res.status(500).json({ message: 'Error al obtener el usuario.' });  // Responde con un código de estado 500 y un mensaje indicando que ocurrió un error interno del servidor
    }
};

module.exports = getDetailUsuarios;  
