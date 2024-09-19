const jwt = require('jsonwebtoken');
const { Usuario } = require('../db');
const jwtSecret = process.env.JWT_SECRET; // Secreto para verificar el token

const auth = (roles) => {
  return async (req, res, next) => {
    try {
      // 1. Verificar si el token está presente y en el formato correcto
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'No token provided or invalid token format' });
      }

      const token = authHeader.split(' ')[1];

      // 2. Verificar si el token es válido
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;

      // 3. Verificar si el usuario existe en la base de datos
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Agregar el nombre del usuario a req.user
      req.user.name = usuario.name;

      // 4. Verificar si el usuario tiene los roles requeridos
      if (!roles.includes(usuario.rol)) {
        return res.status(403).json({ message: 'No permission' });
      }

      // Si pasa todas las verificaciones, continuar al siguiente middleware o ruta
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(500).json({ message: 'Authentication failed' });
    }
  };
};

module.exports = auth;

