import pkg from 'pg';
const { Pool } = pkg;

const REGION = 'us-east-1';
const RDS_INSTANCE = 'pginstance1';
const DB_HOST = `${RDS_INSTANCE}.ct6uwmcmy1yk.us-east-1.rds.amazonaws.com`;
const DB_USER = "postgres";
const DB_PORT = 5432;
const DB_PASSWORD = "postgres";
const DB_NAME = "postgres";

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // For development only. In production, use proper SSL certificates
    },
    // Set the idle timeout to help with connection reuse
    idleTimeoutMillis: 120000,
    // Connection timeout
    connectionTimeoutMillis: 10000,
    // Maximum number of clients the pool should contain
    max: 20
});

// Add error handling for the pool
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const handler = async (event) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT NOW()');   
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                timestamp: result.rows[0].now
            })
        };
        
    } catch (err) {
        console.error('Database error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Database error occurred',
                error: err.message
            })
        };
        
    } finally {
        if (client) {
            client.release();
        }
    }
  };