import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize('anbjewl_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database Connected Successfully');
    } catch (error) {
        console.error('❌ MySQL Connection Error:', error);
    }
};

export default sequelize;