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
    logging: console.log
});

const modelDefiners = [
    require('./model/users.model.js'),
    // Add more models here...
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// Sync all models and create tables if they don't exist
sequelize.sync({ force: false, alter: true })  // ⚠️ Be careful with `force: true` as it drops tables
  .then(async () => {
    console.log('Tables created successfully!');

    // Insert demo users
    await User.bulkCreate([
        { address: '0x1234567890abcdef', createTime: new Date(), updateTime: new Date() },
        { address: '0xabcdef1234567890', createTime: new Date(), updateTime: new Date() },
        { address: '0x9876543210fedcba', createTime: new Date(), updateTime: new Date() },
      ]);

    console.log('Demo users inserted successfully!');
  })
  .catch((error) => {
    console.error('Error syncing tables:', error);
  });

module.exports = sequelize;
