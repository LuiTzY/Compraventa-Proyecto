//Definir el modelo de el usuario
const {DataTypes} = require('sequelize') 
const sequelize = require('../../database')

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true, // Indica que el email debe ser único
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true, // Permite que updated_at sea null
    }
}, {
  tableName: 'users',
  timestamps: false, // Esto debería activar automáticamente las marcas de tiempo
  underscored: true // Esto cambia la convención de nombres a snake_case // si no se especifica, sequeliza va a tomar el nombre en minusculas de mi modelo y pluralizado es decir USERS
});

module.exports = User;