// robots.js
module.exports = (sequelize, DataTypes) => {
  const Robot = sequelize.define('Robot', {
    robotId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    modelo: { type: DataTypes.STRING(20), allowNull: false },
    url: { type: DataTypes.STRING(30) }
  });

  Robot.associate = models => {
    Robot.hasMany(models.Informe, { foreignKey: 'robotId' });
    Robot.hasMany(models.Evento, { foreignKey: 'robotId' });
  };

  return Robot;
};
