// imagen.js
module.exports = (sequelize, DataTypes) => {
    const Imagen = sequelize.define('Imagen', {
      imagenId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      metadatos: { type: DataTypes.TEXT }
    });
  
    Imagen.associate = models => {
      Imagen.belongsToMany(models.Informe, {
        through: models.InformeImagen,
        foreignKey: 'imagenId'
      });
    };
  
    return Imagen;
  };
  