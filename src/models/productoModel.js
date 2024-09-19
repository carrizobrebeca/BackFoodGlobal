const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Producto', {
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Asegura que el stock sea mayor o igual a 0
      },
    },
    negocio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Negocios',  // Asegúrate de que el nombre del modelo sea correcto
        key: 'id',
      },
    },
    
    status: {
      type: DataTypes.ENUM('activo', 'bloqueado', 'eliminado'),
      defaultValue: 'activo', // Valor por defecto
    },
  }, {
    paranoid: true, // Habilita el borrado lógico (registro de eliminaciones)
    timestamps: true, // Habilita los timestamps (createdAt y updatedAt)
  });
};
