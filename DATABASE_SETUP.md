# Database Setup for Testimonials

This guide will help you set up the PostgreSQL database for the testimonials feature.

## Prerequisites

1. **PostgreSQL Database**: Make sure you have a PostgreSQL database running
2. **Environment Variables**: Set up your database connection in the environment

## Environment Setup

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dazzling_dove_commerce
DB_USER=dove_user
DB_PASSWORD=dove_password_123
```

## Database Setup Steps

### 1. Create Database and User

Connect to PostgreSQL as a superuser and run:

```sql
-- Create database
CREATE DATABASE dazzling_dove_commerce;

-- Create user
CREATE USER dove_user WITH PASSWORD 'dove_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dazzling_dove_commerce TO dove_user;

-- Connect to the new database
\c dazzling_dove_commerce;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO dove_user;
```

### 2. Run Database Migration

You can run the migration in several ways:

#### Option A: Using the Setup Script (Recommended)

```bash
# Navigate to your project directory
cd "c:\Users\USER\Desktop\dazzling dove frontend"

# Run the setup script
npm run db:setup
```

#### Option B: Manual SQL Execution

1. Connect to your database:
```bash
psql -h localhost -U dove_user -d dazzling_dove_commerce
```

2. Run the migration file:
```sql
\i src/db/migrations/create_testimonials_table.sql
```

#### Option C: Using Node.js Script

```bash
# Navigate to the src/db directory
cd src/db

# Run the setup script
node -r ts-node/register setup.ts
```

### 3. Verify Setup

After running the migration, you should have:

- ✅ `testimonials` table created
- ✅ Proper indexes for performance
- ✅ Sample testimonials inserted
- ✅ Triggers for automatic timestamp updates

You can verify by running:

```sql
-- Check if table exists
\dt

-- Check table structure
\d testimonials

-- Check sample data
SELECT COUNT(*) FROM testimonials;
```

## Features Included

### Database Schema

The testimonials table includes:
- `id` (UUID, Primary Key)
- `customer_name` (VARCHAR, NOT NULL)
- `customer_email` (VARCHAR, NOT NULL)
- `rating` (INTEGER, 1-5, NOT NULL)
- `title` (VARCHAR, Optional)
- `message` (TEXT, NOT NULL)
- `product_id` (VARCHAR, Optional)
- `product_name` (VARCHAR, Optional)
- `is_approved` (BOOLEAN, Default: false)
- `is_verified_purchase` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP, Auto-generated)
- `updated_at` (TIMESTAMP, Auto-updated)

### API Endpoints

The following API functions are available:

- `getAllTestimonials()` - Get all testimonials with filtering
- `createTestimonial()` - Create new testimonial
- `updateTestimonial()` - Update existing testimonial (admin)
- `deleteTestimonial()` - Delete testimonial (admin)
- `approveTestimonial()` - Approve testimonial (admin)
- `getTestimonialStats()` - Get statistics
- `getTestimonialById()` - Get single testimonial

### Fallback System

The application includes a fallback system:
- **Primary**: PostgreSQL database
- **Fallback**: localStorage (if database is unavailable)

This ensures the application works even if the database is not set up yet.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if PostgreSQL is running
   - Verify connection details in `.env`
   - Ensure database and user exist

2. **Permission Denied**
   - Make sure the user has proper privileges
   - Check if the user can connect to the database

3. **Table Already Exists**
   - The migration uses `IF NOT EXISTS` so it's safe to run multiple times
   - If you need to reset, drop the table first: `DROP TABLE testimonials;`

### Testing Connection

You can test the database connection using:

```javascript
import { testDatabaseConnection } from './src/db/setup';

testDatabaseConnection().then(success => {
  console.log('Database connection:', success ? 'OK' : 'Failed');
});
```

## Migration to Production

When moving to production:

1. Update environment variables for production database
2. Run the migration on production database
3. The application will automatically use the database when available
4. Monitor logs for any fallback to localStorage

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "db:setup": "node -r ts-node/register src/db/setup.ts",
    "db:test": "node -r ts-node/register -e \"import('./src/db/setup').then(m => m.testDatabaseConnection())\""
  }
}
```

## Next Steps

After setting up the database:

1. ✅ Test the testimonials form (should save to database)
2. ✅ Check admin panel (should show database testimonials)
3. ✅ Verify fallback works (disable database temporarily)
4. ✅ Monitor application logs for any issues

The testimonials system now supports both database persistence and localStorage fallback, ensuring reliability and scalability.
