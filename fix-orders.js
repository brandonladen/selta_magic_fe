import pool from './server/database.js';

async function fixOrdersTable() {
  try {
    console.log('Checking and fixing orders table structure...');
    
    // Get current columns
    const result = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['orders']);
    const existingColumns = result.rows.map(row => row.column_name);
    
    console.log('Existing columns:', existingColumns);
    
    // Define required columns
    const requiredColumns = [
      { name: 'payment_intent_id', type: 'VARCHAR(255) UNIQUE' },
      { name: 'shipping_address', type: 'JSONB' },
      { name: 'status', type: 'VARCHAR(50) DEFAULT \'pending\'' },
      { name: 'total_amount', type: 'DECIMAL(10,2)' },
      { name: 'user_id', type: 'UUID REFERENCES users(id) ON DELETE CASCADE' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ];
    
    // Add missing columns
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding missing column: ${column.name}`);
        await pool.query(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.type}`);
        console.log(`✅ Added ${column.name}`);
      } else {
        console.log(`✅ Column ${column.name} already exists`);
      }
    }
    
    console.log('✅ Orders table structure is now complete');
    
    // Also ensure order_items table exists
    const orderItemsCheck = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1', ['order_items']);
    
    if (orderItemsCheck.rows.length === 0) {
      console.log('Creating order_items table...');
      await pool.query(`
        CREATE TABLE order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id),
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          price DECIMAL(10,2) NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          product_image VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      console.log('✅ order_items table created');
    } else {
      console.log('✅ order_items table already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixOrdersTable();
