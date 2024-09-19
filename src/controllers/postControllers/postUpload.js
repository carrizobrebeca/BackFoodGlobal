const uploadController = upload.single('imagen');

uploadController(req, res, () => {
  try {
    // Verifica si req.file está presente
    if (!req.file) {
      return res.status(400).send('No se subió ningún archivo.');
    }
    
    // Devuelve la URL pública de la imagen subida a Cloudinary
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).send('Error subiendo el archivo.');
  }
});

module.exports = uploadController;


