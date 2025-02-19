import { sequelize, initDatabase } from './sequelize/index.js';
import { QueryTypes } from 'sequelize';

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
        
        // First check if PostGIS is installed
        const isPostgisInstalled = await sequelize.query(
            'SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = \'postgis\');',
            {
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        
        // If PostGIS is not installed, install it
        if (!isPostgisInstalled.exists) {
            console.log('PostGIS not found, installing...');
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;', {
                type: QueryTypes.RAW
            });
            console.log('PostGIS installation completed');
        }

        // Now we can safely query PostGIS version
        const postgisVersion = await sequelize.query(
            'SELECT postgis_version() as version;',
            {
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                postgisVersion: postgisVersion,
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
