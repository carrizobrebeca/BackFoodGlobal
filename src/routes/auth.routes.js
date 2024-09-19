const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware para manejar la creación de tokens JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    console.log(token);
    // Redirige a una página segura o al frontend con el token
    res.redirect(`/login?token=${token}`);  // Reemplaza `/welcome` con la ruta de tu frontend que maneje el token
  }
);


module.exports = router;
