// backend/models/userModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sqlDB.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
        }
    },
    cartData: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    tableName: 'users',
    timestamps: true
});

export default User;