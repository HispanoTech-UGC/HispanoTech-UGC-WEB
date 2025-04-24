// informes.js
module.exports = (sequelize, DataTypes) => {
    const Informe = sequelize.define('Informe', {
        informeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        fechaIni: { type: DataTypes.DATE, allowNull: false },
        fechaFin: { type: DataTypes.DATE, allowNull: false },
        numPlaca: { type: DataTypes.STRING(10), allowNull: false },
        robotId: { type: DataTypes.INTEGER, allowNull: false },
        tituloInforme: { type: DataTypes.STRING(100), allowNull: false }
    });

    Informe.associate = models => {
        Informe.belongsTo(models.Usuario, { foreignKey: 'numPlaca', onDelete: 'CASCADE' });
        Informe.belongsTo(models.Robot, { foreignKey: 'robotId', onDelete: 'CASCADE' });
        Informe.belongsToMany(models.Imagen, {
            through: models.InformeImagen,
            foreignKey: 'informeId',
            onDelete: 'CASCADE'
        });
    };

    return Informe;
};
