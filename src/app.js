const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes/index.js');
const authRoutes = require('./routes/auth.routes.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Importamos el middleware cors
const corsOptions = require('./middleware/corsOptions.js'); // Importamos las opciones de CORS


require('./db.js');
require('./passport.js');

const app = express();

// Creamos el servidor HTTP y lo conectamos con Express
const server = http.createServer(app);

// Configuramos Socket.io para que funcione con el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: '*', // Permitimos las conexiones desde cualquier origen
    methods: ['GET', 'POST'], // Métodos permitidos
  },
});

// Configuramos Socket.io para manejar conexiones
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Ejemplo de recepción de un mensaje
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    
    // Emitir un evento de vuelta a los clientes
    io.emit('respuesta', { message: 'Respuesta desde el servidor' });
  });

  // Detectar cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

app.name = 'API';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'foodglobal', // Cambia por tu cloud_name
  api_key: '864176186175449', // Cambia por tu api_key
  api_secret: '-vF37gciGAv9ICq-Gw0TLEkRej0' // Cambia por tu api_secret
});

// Configurar Multer para usar Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'foodglobal', // Cambia por la carpeta en Cloudinary
    allowed_formats: ['jpg', 'webp', 'png'], // Formatos permitidos
  },
});

const upload = multer({ storage: storage });

// Configuraciones del body-parser y otros middlewares
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Implementamos las opciones de CORS desde corsOptions.js
app.use(cors(corsOptions));

// Configuración de sesiones y Passport
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Rutas de la API
app.use('/', routes);
app.use('/', authRoutes); // Rutas de autenticación

// Middleware para manejar errores
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

// Iniciar el servidor y Socket.io en el puerto 3000
server.listen(4000, () => {
  console.log('Servidor socket io corriendo en el puerto 4000');
});

module.exports = app;
