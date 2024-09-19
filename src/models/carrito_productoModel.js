const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Carrito_Producto', {
    carritoId: {
      type: DataTypes.UUID,
      references: {
        model: 'Carritos',
        key: 'id',
      },
      allowNull: false,
    },
    productoId: {
      type: DataTypes.UUID,
      references: {
        model: 'Productos',
        key: 'id',
      },
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
};