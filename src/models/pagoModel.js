const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Pago', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    metodo: {
      type: DataTypes.ENUM('mercado pago', 'paypal', 'tarjeta'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    paranoid: true, // Habilita el borrado lógico (registro de eliminaciones)
    timestamps: true, // Deshabilita los timestamps (createdAt y updatedAt)
  });
};
