const { Usuario } = require('../../db');
const cloudinary = require('cloudinary').v2; // Importa Cloudinary

// Expresiones regulares para validaciones
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,20}$/;
const rolRegex = /^(admin|usuario|socio)$/;
const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const statusRegex = /^(activo|bloqueado|eliminado)$/;
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, imagen, email, password, rol, status } = req.body;

  try {
    // Obtener el usuario existente de la base de datos
    const usuarioExistente = await Usuario.findByPk(id);

    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Validaciones
    if (nombre && (!nombreRegex.test(nombre) || nombre.length < 3)) {
      return res.status(400).json({ error: 'El nombre debe ser una cadena de al menos 3 letras.' });
    }
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: 'El email debe ser una dirección de correo electrónico válida.' });
    }
    if (password && !passwordRegex.test(password)) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 6 y 20 caracteres, con al menos un número, una letra mayúscula y una letra minúscula.' });
    }
    if (rol && !rolRegex.test(rol)) {
      return res.status(400).json({ error: 'El rol debe ser uno de los siguientes: "admin", "usuario", o "socio".' });
    }
    if (status && !statusRegex.test(status)) {
      return res.status(400).json({ error: 'El estado debe ser uno de los siguientes: "activo", "bloqueado", o "eliminado".' });
    }

    // Manejo de la imagen en caso de que sea proporcionada
    let imagenActualizada = usuarioExistente.imagen;
    if (imagen) {
      try {
        // Subir la imagen a Cloudinary
        const resultadoSubida = await cloudinary.uploader.upload(imagen, {
          folder: 'usuarios', // Subir la imagen en una carpeta específica de Cloudinary
          resource_type: 'image',
        });
        imagenActualizada = resultadoSubida.secure_url; // Actualizar con la URL de Cloudinary
      } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return res.status(500).json({ error: 'Ocurrió un error al subir la imagen.' });
      }
    }

    // Actualizar solo los campos que se proporcionaron en la solicitud
    const camposActualizados = {
      nombre: nombre || usuarioExistente.nombre,
      apellido: apellido || usuarioExistente.apellido,
      imagen: imagenActualizada, // Usar la nueva imagen si se subió, o mantener la anterior
      email: email || usuarioExistente.email,
      password: password || usuarioExistente.password,
      rol: rol || usuarioExistente.rol,
      status: status || usuarioExistente.status,
    };

    // Actualizar el usuario en la base de datos
    await Usuario.update(camposActualizados, { where: { id } });

    if (camposActualizados.rol === 'socio') {
      const asunto = 'Confirmación de Socio';
      const mensaje = `Hola ${camposActualizados.nombre},\n\nTu petición como socio en nuestra plataforma ha sido exitoso. ¡Bienvenido!\n\nSaludos,\nEquipo de Soporte FoodGlobal`;

      try {
        await enviarCorreo(camposActualizados.email, asunto, mensaje);
      } catch (error) {
        console.error('Error al enviar el correo al usuario:', error);
        return res.status(500).json({ mensaje: 'Error al enviar el correo al usuario', error: error.message });
      }
    }

    res.json({ mensaje: 'Usuario actualizado exitosamente', usuario: camposActualizados });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
  }
};

module.exports = updateUsuario;