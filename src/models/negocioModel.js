const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Negocio', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true, // Campo para la imagen
    },
    usuario_id: {
      type: DataTypes.UUID, 
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('activo', 'bloqueado', 'eliminado'),
      allowNull: false,
      defaultValue: 'activo', // Valor por defecto
    },
  }, {
    paranoid: true, // Habilita el borrado lógico (registro de eliminaciones)
    timestamps: true, // Habilita timestamps (createdAt y updatedAt)
  });
};