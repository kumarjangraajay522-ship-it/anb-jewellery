import { DataTypes } from 'sequelize';
import sequelize from '../config/sqlDB.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    address: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'Order Placed'
    },
    paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    payment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: true
});

export default Order;