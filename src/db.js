require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_DEPLOY
} = process.env;

// Configura la conexión a la base de datos
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/foodglobal`, {
  logging: false,
  native: false,
});

// Configura la conexión a la base de datos (para producción, descomenta la línea de DB_DEPLOY)
// const sequelize = new Sequelize(DB_DEPLOY, {
//   logging: false,
//   native: false,
// });

const basename = path.basename(__filename);
const modelDefiners = [];

// Lee todos los archivos de la carpeta Models y agrégalos a modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Inyecta la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));

// Capitaliza los nombres de los modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
const { Chat, Negocio, Notificaciones, Pago, Pedido, Producto, Reseña, Usuario, Carrito, Carrito_Producto } = sequelize.models;

// Relación Chat
Chat.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Chat, { foreignKey: 'usuario_id' });
Chat.belongsTo(Negocio, { foreignKey: 'negocio_id' });
Negocio.hasMany(Chat, { foreignKey: 'negocio_id' });

// Relación Negocio-Usuario
Negocio.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });
Usuario.hasMany(Negocio, { foreignKey: 'usuario_id' });

// Relación Negocio-Producto
Negocio.hasMany(Producto, { foreignKey: 'negocio_id' });
Producto.belongsTo(Negocio, { foreignKey: 'negocio_id' });

// Relación Notificaciones
Notificaciones.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Notificaciones, { foreignKey: 'usuario_id' });

// Relación Pago-Pedido
Pago.belongsTo(Pedido, { foreignKey: 'pedido_id' });
Pedido.hasOne(Pago, { foreignKey: 'pedido_id' });

// Relación Pedido-Usuario
Pedido.belongsTo(Usuario, {
  foreignKey: {
    name: 'usuario_id',
    allowNull: false
  }
});
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });

// Relación Pedido-Producto (muchos a muchos a través de Pedido_Producto)
Pedido.belongsToMany(Producto, {
  through: 'Pedido_Producto',
  foreignKey: 'pedido_id',
  otherKey: 'producto_id',
  as: 'productos'  // Alias para acceder a los productos asociados a un pedido
});
Producto.belongsToMany(Pedido, {
  through: 'Pedido_Producto',
  foreignKey: 'producto_id',
  otherKey: 'pedido_id',
  as: 'pedidos'  // Alias para acceder a los pedidos asociados a un producto
});

// Relación Reseña-Usuario-Producto
Reseña.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Reseña, { foreignKey: 'usuario_id' });
Reseña.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(Reseña, { foreignKey: 'producto_id' });

// Relaciones Carrito
Carrito.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Carrito, { foreignKey: 'usuario_id' });

Carrito_Producto.belongsTo(Carrito, { foreignKey: 'carrito_id' });
Carrito.hasMany(Carrito_Producto, { foreignKey: 'carrito_id' });

Carrito_Producto.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(Carrito_Producto, { foreignKey: 'producto_id' });

// Relación Pedido-Negocio (nueva relación añadida)
Pedido.belongsTo(Negocio, { foreignKey: 'negocio_id', as: 'negocio' });
Negocio.hasMany(Pedido, { foreignKey: 'negocio_id', as: 'pedidos' });

// Exporta la conexión y los modelos
module.exports = {
  ...sequelize.models,
  conn: sequelize,  // Asegúrate de que conn esté exportado correctamente
};
