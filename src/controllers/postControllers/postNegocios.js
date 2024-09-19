const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { Negocio, Usuario } = require('../../db');

// Expresiones regulares para validaciones
const nombreRegex = /^[A-Za-z0-9\s]{3,}$/;
const descripcionRegex = /^.{10,1000}$/;

const postNegocios = async (req, res) => {
  try {
    const { nombre, descripcion, imagen: imagenLocal, usuario_id,status } = req.body;
    let imagen = imagenLocal;

    // Validaciones con expresiones regulares
    if (!nombreRegex.test(nombre)) {
      return res.status(400).json({ message: 'Nombre inválido. Debe tener al menos 3 caracteres y solo contener letras, números y espacios.' });
    }

    if (!descripcionRegex.test(descripcion)) {
      return res.status(400).json({ message: 'Descripción inválida. Debe tener entre 10 y 1000 caracteres.' });
    }

    if (!usuario_id) {
      return res.status(400).json({ message: 'Falta el ID del usuario.' });
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      return res.status(400).json({ message: 'El usuario no existe.' });
    }

    // Verificar si ya existe un negocio con el mismo nombre
    const negocioExistente = await Negocio.findOne({ where: { nombre } });
    if (negocioExistente) {
      return res.status(400).json({ message: `Ya existe un negocio con el nombre "${nombre}".` });
    }

    // Subir la imagen a Cloudinary
    try {
      const uploadResult = await cloudinary.uploader.upload(imagen, {
        folder: 'foodglobal',
        resource_type: 'image',
      });
      imagen = uploadResult.secure_url;
    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      return res.status(500).json({ message: 'Ocurrió un error al subir la imagen.', error: error.message });
    }

    // Crear el nuevo negocio
    const nuevoNegocio = await Negocio.create({
      nombre,
      descripcion,
      imagen,
      usuario_id,
      status
    });

    return res.status(201).json(nuevoNegocio);
  } catch (error) {
    console.error('Error al crear el negocio:', error);
    return res.status(500).json({ message: 'Ocurrió un error al crear el negocio.', error: error.message });
  }
};


module.exports = postNegocios;

