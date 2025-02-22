import { sequelize, initializeDb } from './sequelize/index.js'; 
import { QueryTypes } from 'sequelize';

const postgisexec = () =>{
    const result = sequelize.query('select postgis_version();');
    return result;
}
let postgisVersion;

export const handler = () => {
    try {
        initializeDb();
        
        // First check if PostGIS is installed
        const isPostgisInstalled = sequelize.query(
            'SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = \'postgis\');',
            {
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        
        // If PostGIS is not installed, install it
        if (!isPostgisInstalled.exists) {
            console.log('PostGIS not found, installing...');
            sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;', {
                type: QueryTypes.RAW
            });
            console.log('PostGIS installation completed');
        }

        // Now we can safely query PostGIS version
        postgisVersion = sequelize.query(
            'SELECT postgis_full_version() as version;',
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
                data: "succeed"
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
    } finally {
        console.log('PostGIS version:', postgisVersion);
    }
};

await handler();