// usuarios.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      numPlaca: { type: DataTypes.STRING(10), primaryKey: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      ultimaSesion: { type: DataTypes.DATE },
      rol: { type: DataTypes.INTEGER, allowNull: false }
    });
  
    Usuario.associate = models => {
      Usuario.belongsTo(models.Rol, { foreignKey: 'rol' });
      Usuario.hasMany(models.Informe, { foreignKey: 'numPlaca' });
    };
  
    return Usuario;
  };
  