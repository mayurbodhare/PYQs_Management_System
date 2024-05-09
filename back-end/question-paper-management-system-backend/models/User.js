const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// User.prototype.comparePassword = async function(password) {
//     try {
//         return await bcrypt.compare(password, this.password);
//     } catch (error) {
//         throw new Error('Error comparing passwords');
//     }
// };

module.exports = User;
