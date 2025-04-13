module.exports = (sequelize, DataTypes) => {
    const Cuerpo = sequelize.define('Cuerpo', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        cuerpo: { type: DataTypes.STRING(50), allowNull: false }
    });

    Cuerpo.associate = models => {
        Cuerpo.hasMany(models.Usuario, { foreignKey: 'cuerpo', onDelete: 'RESTRICT' });
    };

    return Cuerpo;
};