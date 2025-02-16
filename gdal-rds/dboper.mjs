import { Signer } from "@aws-sdk/rds-signer";
import {Pool} from 'pg';

const REGION = 'us-east-1';
const RDS_INSTANCE = 'pginstance1';
const DB_HOST = `${RDS_INSTANCE}.ct6uwmcmy1yk.us-east-1.rds.amazonaws.com`;
const DB_USER = "postgres";
const DB_PORT = 5432;
const USE_IAM_AUTH = process.env.USE_IAM_AUTH === "true";  

async function createAuthToken() {
    const dbInfo = {
        region: REGION,
        hostname: DB_HOST,
        port: DB_PORT,
        username: DB_USER
    };
    const signer = new Signer(dbInfo);
    const token = await signer.getAuthToken();
    return token;
}

async function dbOps() {
    const token = await createAuthToken();
    let connectionConfig = {
        host: DB_HOST,
        user: DB_USER,
        password: token,
        database: 'postgres',
        ssl: 'Amazon RDS',
    };
    const conn = await new Pool(connectionConfig);
    const [res,] = await conn.query('SELECT NOW()');
    return res;
}