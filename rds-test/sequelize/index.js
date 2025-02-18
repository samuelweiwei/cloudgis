const { Sequelize } = require('sequelize');

const REGION = 'us-east-1';
const RDS_INSTANCE = 'pginstance1';
const DB_HOST = `${RDS_INSTANCE}.ct6uwmcmy1yk.us-east-1.rds.amazonaws.com`;
const DB_USER = "postgres";
const DB_PORT = 5432;
const DB_PASSWORD = "postgres";
const DB_NAME = "postgres";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    query: {
        raw: true
    },
    logging: console.log
});

const modelDefiners = [
    require('./model/users.model.js'),
    // Add more models here...
];

// Initialize models
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Get User model after initialization
const { users: User } = sequelize.models;

// 修改为一个可导出的初始化函数，而不是立即执行
const initDatabase = async () => {
    try {
        // Sync tables
        await sequelize.sync({ force: false, alter: true });
        console.log('Tables created successfully!');

        // Check if we already have users
        const userCount = await User.count();
        
        if (userCount === 0) {
            // Insert demo users only if no users exist
            await User.bulkCreate([
                { 
                    address: '0x1234567890abcdef',
                    createTime: new Date(),
                    updateTime: new Date()
                },
                { 
                    address: '0xabcdef1234567890',
                    createTime: new Date(),
                    updateTime: new Date()
                },
                { 
                    address: '0x9876543210fedcba',
                    createTime: new Date(),
                    updateTime: new Date()
                },
            ]);
            console.log('Demo users inserted successfully!');
        } else {
            console.log('Users already exist, skipping demo data insertion');
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    initDatabase
};
