import mysql, { ConnectionConfig, Connection } from 'mysql';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mysqlConfig: ConnectionConfig = {
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection: Connection = mysql.createConnection(mysqlConfig);

export default connection;
