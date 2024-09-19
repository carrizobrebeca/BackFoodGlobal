const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido_Producto = sequelize.define('Pedido_Producto', {
    pedido_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Pedidos', // Asegúrate de que el modelo y la tabla se llamen 'Pedidos'
        key: 'id',
      },
    },
    producto_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Productos', // Asegúrate de que el modelo y la tabla se llamen 'Productos'
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false, // La cantidad del producto en el pedido es obligatoria
    },
  }, {
    paranoid: false, // Desactiva el borrado lógico si no es necesario
    timestamps: false, // Desactiva los timestamps si no son necesarios
  });

  return Pedido_Producto;
};
