const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Chat', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.UUID,  // Cambiado a UUID
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    negocio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Negocios',
        key: 'id',
      },
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
