import { Pool } from 'pg';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Database configuration - only create pool in Node.js environment
let pool: Pool | null = null;

if (!isBrowser) {
  pool = new Pool({
    user: process.env.DB_USER || 'dove_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dazzling_dove_commerce',
    password: process.env.DB_PASSWORD || 'dove_password_123',
    port: parseInt(process.env.DB_PORT || '5432'),
  });
}

// Mock pool for browser environment
const mockPool = {
  query: async () => {
    throw new Error('Database not available in browser environment');
  },
  connect: async () => {
    throw new Error('Database not available in browser environment');
  },
  end: async () => {
    // No-op
  }
};

export default pool || mockPool;
