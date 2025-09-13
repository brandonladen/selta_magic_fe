import pool from './server/database.js';

async function fixOrdersTable() {
  try {
    console.log('Adding payment_intent_id column to orders table...');
    
    // Add the missing column
    await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255) UNIQUE');
    
    console.log('✅ payment_intent_id column added successfully');
    
    // Verify the column was added
    const result = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2', ['orders', 'payment_intent_id']);
    
    if (result.rows.length > 0) {
      console.log('✅ Column verified: payment_intent_id exists');
    } else {
      console.log('❌ Column still missing');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('✅ Column already exists');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

fixOrdersTable();
