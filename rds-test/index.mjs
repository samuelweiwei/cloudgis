import { sequelize, initDatabase } from './sequelize/index.js';

let isDbConnected = false;
let isDbInitialized = false;

const initializeDb = async () => {
    if (!isDbConnected) {
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            isDbConnected = true;

            if (!isDbInitialized) {
                await initDatabase();
                isDbInitialized = true;
            }
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }
};

export const handler = async (event) => {
    try {
        await initializeDb();

        const { users } = sequelize.models;
        const allUsers = await users.findAll({
            limit: 10
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data: allUsers
            })
        };

    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'An error occurred',
                error: err.message
            })
        };
    }
};
