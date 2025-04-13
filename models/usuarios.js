import { DataTypes } from 'sequelize';
import sequelize from '../services/database';

export const Roles = sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

export const Cuerpos = sequelize.define('cuerpos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cuerpo: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

export const Usuarios = sequelize.define('usuarios', {
    num_placa: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ultima_sesion: {
        type: DataTypes.DATE
    },
    rol: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: 'id'
        }
    },
    cuerpo: {
        type: DataTypes.INTEGER,
        references: {
            model: Cuerpos,
            key: 'id'
        }
    }
});
