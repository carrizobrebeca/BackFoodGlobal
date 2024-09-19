const express = require('express');
const routes = express.Router();

// Importar modelos
const { Usuario, Producto, Pedido, Pedido_Producto, Pago, Negocio } = require('../db'); // Ajusta la ruta según tu estructura

// Importar todos los controladores

//Get Controllers
const getDetailNegocios = require('../controllers/getControllers/getDetailNegocios');
const getDetailProductos = require('../controllers/getControllers/getDetailProductos');
const getDetailUsuarios = require('../controllers/getControllers/getDetailUsuarios')
const getNegocios = require('../controllers/getControllers/getNegocios');
const getProductos = require('../controllers/getControllers/getProductos');
const getUsuarios = require('../controllers/getControllers/getUsuarios');
const getProductosPorNegocio = require('../controllers/getControllers/getProductosPorNegocio'); 
const getPedidos = require('../controllers/getControllers/getPedidos');

//Post Controllers
const postNegocios = require('../controllers/postControllers/postNegocios');
const postProductos = require('../controllers/postControllers/postProductos');
const postUsuarios = require('../controllers/postControllers/postUsuarios');
const paymentIntent = require('../controllers/paymentControllers/paymentController');
const loginUsuario = require('../controllers/postControllers/loginUsuario');
const deleteProducto = require('../controllers/deleteControllers/deleteProducto');
const deleteUsuario = require('../controllers/deleteControllers/deleteUsuario');
const deleteNegocio = require('../controllers/deleteControllers/deleteNegocio')

//Update Controllers
const updateNegocio = require('../controllers/updateControllers/updateNegocio');
const updateUsuario = require('../controllers/updateControllers/updateUsuario');
const updateProducto = require('../controllers/updateControllers/updateProducto');

// Block Controllers
const bloquearNegocio = require('../controllers/blockcontrollers/blockNegocio');
const bloquearUsuario = require('../controllers/blockcontrollers/blockUsuario');
const bloquearProducto = require('../controllers/blockcontrollers/blockProducto');

// Purchase Controller
const finalizarCompra = require('../controllers/purchaseController/finalizarCompra');

// Common Controller
const recoverEntity = require('../controllers/common/recoverEntity');

// Pedido Controller
// const { obtenerPedidoPorId } = require('../controllers/putControllers/pedidoController');
const { obtenerPedidoPorId } = require('../controllers/getControllers/pedidoController');
const { actualizarDetallesEntrega } = require('../controllers/putControllers/actualizarDetallesEntrega');

// Notification Controller
const { enviarNotificacionCorreo } = require('../controllers/notificationController/notificationController'); // Importa el controlador de notificaciones

// Password Reset Controllers
const { solicitarRestablecimientoContraseña} = require('../controllers/authController/resetPasswordController'); // Asegúrate de que esta ruta esté correcta
const {restablecerContraseña } = require('../controllers/authController/restorePasswordController'); 

// Configurar las rutas
routes.get('/negocios', getNegocios); 
routes.get('/negocios/:id', getDetailNegocios); 
routes.get('/productos', getProductos); 
routes.get('/productos/:id', getDetailProductos);
routes.get('/usuarios', getUsuarios); 
routes.get('/usuarios/:id', getDetailUsuarios); 
routes.get('/pedidos', getPedidos);

// Ruta para obtener productos por negocio
routes.get('/negocios/:negocioId/productos', getProductosPorNegocio); 

routes.post('/negocios', postNegocios);
routes.post('/productos', postProductos); 
routes.post('/usuarios', postUsuarios); 
routes.post('/create-payment-intent', paymentIntent); 
routes.post('/login', loginUsuario);

routes.delete('/productos/:id', deleteProducto);
routes.delete('/usuarios/:id', deleteUsuario);
routes.delete('/negocios/:id', deleteNegocio);


// Rutas para recuperación de entidades sin autenticación
routes.post('/restore/usuarios/:id', (req, res) => recoverEntity(Usuario, req, res)); 
routes.post('/restore/productos/:id', (req, res) => recoverEntity(Producto, req, res)); 
routes.post('/restore/pedidos/:id', (req, res) => recoverEntity(Pedido, req, res)); 
routes.post('/restore/pedido-producto/:id', (req, res) => recoverEntity(Pedido_Producto, req, res)); 
routes.post('/restore/pagos/:id', (req, res) => recoverEntity(Pago, req, res)); 
routes.post('/restore/negocios/:id', (req, res) => recoverEntity(Negocio, req, res)); 


// Ruta para bloquear negocio
routes.put('/negocios/:id/bloquear', bloquearNegocio);
routes.post('/block/usuarios/:id', bloquearUsuario);
routes.post('/block/productos/:id', bloquearProducto);

// Rutas para editar datos de Negocios, productos y usuarios
routes.put('/negocios/:id', updateNegocio);
routes.put('/usuarios/:id', updateUsuario);
routes.put('/productos/:id', updateProducto);

// Ruta para finalizar la compra
routes.post('/finalizar-compra', finalizarCompra);

// Ruta para actualizar el estado del pedido
// routes.put('/pedidos/:id/estado', actualizarEstadoPedido);

// Ruta para obtener pedido por ID
routes.get('/pedidos/:id', obtenerPedidoPorId);

// Ruta para actualizar los detalles de entrega de un pedido
routes.put('/pedidos/:pedido_id/entrega', actualizarDetallesEntrega);


// Nueva ruta para notificaciones
routes.post('/notificaciones/enviar-correo', enviarNotificacionCorreo); // Ruta para enviar correos electrónicos

// Rutas para restablecimiento de contraseña
routes.post('/reset-password', solicitarRestablecimientoContraseña);
routes.post('/update-password', restablecerContraseña);


module.exports = routes;

