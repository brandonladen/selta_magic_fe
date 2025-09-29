import pool from '@/lib/database';
import fs from 'fs';
import path from 'path';

export async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'create_testimonials_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await pool.query(migrationSQL);

    console.log('Database setup completed successfully!');
    console.log('Testimonials table created with sample data.');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection successful!');
    console.log('Current time from database:', result.rows[0].current_time);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      const isConnected = await testDatabaseConnection();
      
      if (isConnected) {
        await setupDatabase();
        console.log('Setup completed successfully!');
      } else {
        console.error('Cannot setup database - connection failed');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('Setup failed:', error);
      process.exit(1);
    }
  })();
}
