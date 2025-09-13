import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'dove_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dazzling_dove_commerce',
  password: process.env.DB_PASSWORD || 'dove_password_123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
