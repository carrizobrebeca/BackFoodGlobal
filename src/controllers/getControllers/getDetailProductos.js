const { Producto } = require('../../db');


const getDetailProductos = async (req, res) => {
    try {
        const { id } = req.params;  // Extrae el 'id' de los parámetros de la solicitud (req.params), que es el identificador del producto solicitado
        const producto = await Producto.findByPk(id);  // Usa 'findByPk' para buscar un producto en la base de datos por su clave primaria (id)

        if (!producto) {  // Verifica si el producto no fue encontrado (es decir, si 'producto' es null o undefined)
            return res.status(404).json({ message: 'Producto no encontrado.' });  // Si el producto no se encuentra, responde con un código de estado 404 y un mensaje indicando que el producto no fue encontrado
        }

        return res.status(200).json(producto);  // Si el producto se encuentra, responde con un código de estado 200 y devuelve el objeto del producto en formato JSON
    } catch (error) {  // Captura cualquier error que ocurra durante el proceso de búsqueda
        console.error(error);  // Imprime el error en la consola para facilitar la depuración
        return res.status(500).json({ message: 'Error al obtener el producto.' });  // Responde con un código de estado 500 y un mensaje indicando que ocurrió un error interno del servidor
    }
};

module.exports = getDetailProductos;  
