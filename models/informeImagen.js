// informelimagen.js
module.exports = (sequelize, DataTypes) => {
    const InformeImagen = sequelize.define('InformeImagen', {
      informeId: { type: DataTypes.INTEGER, primaryKey: true },
      imagenId: { type: DataTypes.INTEGER, primaryKey: true }
    });
  
    return InformeImagen;
  };
  