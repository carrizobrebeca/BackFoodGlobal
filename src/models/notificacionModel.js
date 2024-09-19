const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Notificaciones', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.UUID,  
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    leido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
