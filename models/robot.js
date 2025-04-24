// robots.js
module.exports = (sequelize, DataTypes) => {
    const Robot = sequelize.define('Robot', {
        robotId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        modelo: { type: DataTypes.STRING(50), allowNull: false },
        url: { type: DataTypes.STRING(255) }
    });

    Robot.associate = models => {
        Robot.hasMany(models.Informe, { foreignKey: 'robotId', onDelete: 'CASCADE' });
        Robot.hasMany(models.Evento, { foreignKey: 'robotId', onDelete: 'CASCADE' });
    };

    return Robot;
};
