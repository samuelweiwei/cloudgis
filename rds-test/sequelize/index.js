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
    require('./model/users.model'),
    // Add more models here...
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}


module.exports = sequelize;
