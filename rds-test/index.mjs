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

const postgisexec = async () =>{
    const result = sequelize.query('select postgis_version();');
    return result;
}

export const handler = async (event) => {
    try {
        await initializeDb();

        const { users } = sequelize.models;
        const allUsers = await users.findAll({
            limit: 10
        });
        const [postgisVersion] = await sequelize.query(
            'SELECT postgis_version();',
            {
                type: QueryTypes.SELECT,
                plain: true // Returns a single object instead of an array
            }
        );
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data: postgisVersion
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
