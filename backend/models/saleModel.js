import { DataTypes } from 'sequelize';
import sequelize from '../config/sqlDB.js';

const SaleConfig = sequelize.define('SaleConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetDate: {
        type: DataTypes.STRING, // Storing as ISO string from datetime-local
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export default SaleConfig;