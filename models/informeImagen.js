// informelimagen.js
module.exports = (sequelize, DataTypes) => {
    const InformeImagen = sequelize.define('InformeImagen', {
        informeId: { type: DataTypes.INTEGER, primaryKey: true },
        imagenId: { type: DataTypes.INTEGER, primaryKey: true }
    });

    InformeImagen.associate = models => {
        InformeImagen.belongsTo(models.Informe, { foreignKey: 'informeId', onDelete: 'CASCADE' });
        InformeImagen.belongsTo(models.Imagen, { foreignKey: 'imagenId', onDelete: 'CASCADE' });
    };

    return InformeImagen;
};
