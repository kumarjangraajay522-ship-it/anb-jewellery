// backend/models/productModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sqlDB.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    mrp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    image: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    video: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subCategory: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bestseller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'products',
    timestamps: true
});

export default Product;