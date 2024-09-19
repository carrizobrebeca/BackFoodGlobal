const fs = require('fs');
const cloudinary = require('cloudinary').v2; // Importa y configura Cloudinary
const { Negocio } = require('../../db');

// Expresiones regulares para validaciones
const nombreRegex = /^[A-Za-z0-9\s]{3,}$/; // Nombre con al menos 3 caracteres, puede contener letras, números y espacios
const descripcionRegex = /^.{10,1000}$/; // Descripción entre 10 y 1000 caracteres

const updateNegocio = async (req, res) => {
    try {
        const { id } = req.params; // ID del negocio a actualizar
        const { nombre, descripcion, imagen: imagenLocal, status } = req.body; // Datos a actualizar

        // Buscar el negocio por ID
        const negocioExistente = await Negocio.findByPk(id);

        if (!negocioExistente) {
            return res.status(404).json({ mensaje: 'Negocio no encontrado' });
        }

        let imagen = negocioExistente.imagen; // Mantener la imagen existente por defecto

        // Validaciones con expresiones regulares
        if (nombre && !nombreRegex.test(nombre)) {
            return res.status(400).json({ message: 'Nombre inválido. Debe tener al menos 3 caracteres y solo contener letras, números y espacios.' });
        }

        if (descripcion && !descripcionRegex.test(descripcion)) {
            return res.status(400).json({ message: 'Descripción inválida. Debe tener entre 10 y 1000 caracteres.' });
        }

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
            nombre: nombre || negocioExistente.nombre,
            descripcion: descripcion || negocioExistente.descripcion,
            status: status || negocioExistente.status,
            imagen: imagen || negocioExistente.imagen, // Guardar la URL de Cloudinary o la existente
        };

        // Actualizar el negocio en la base de datos
        const [affectedRows] = await Negocio.update(camposActualizados, {
            where: { id }
        });

        if (affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Negocio no actualizado' });
        }

        res.json({ mensaje: 'Negocio actualizado exitosamente', negocio: camposActualizados });
    } catch (error) {
        console.error('Error al actualizar el negocio:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el negocio', error: error.message });
    }
};

module.exports = updateNegocio;

