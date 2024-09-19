const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Carrito', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
      allowNull: false,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
};