const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Reseña', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    producto_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'id',
      },
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};
