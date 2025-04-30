// eventos.js
module.exports = (sequelize, DataTypes) => {
    const Evento = sequelize.define('Evento', {
        eventoId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        robotId: { type: DataTypes.INTEGER, allowNull: false }
    });

    Evento.associate = models => {
        Evento.belongsTo(models.Robot, { foreignKey: 'robotId', onDelete: 'CASCADE' });
    };

    return Evento;
};
