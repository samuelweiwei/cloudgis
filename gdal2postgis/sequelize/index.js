// const { Sequelize } = require('sequelize');
import { Sequelize } from 'sequelize';

const REGION = 'us-east-1';
const RDS_INSTANCE = 'pginstance1';
const DB_HOST = `${RDS_INSTANCE}.ct6uwmcmy1yk.us-east-1.rds.amazonaws.com`;
// const DB_HOST = 'localhost';
const DB_USER = "postgres";
const DB_PORT = 5432;
const DB_PASSWORD = "postgres";
const DB_NAME = "postgres";

let isDbConnected = false;
let isDbInitialized = false;

export const initializeDb = async () => {
    if (!isDbConnected) {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            isDbConnected = true;

            if (!isDbInitialized) {
                await sequelize.sync({ force: false, alter: true });
                isDbInitialized = true;
            }
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }
};

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
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

