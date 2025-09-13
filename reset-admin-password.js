import pool from './server/database.js';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  const adminEmail = 'Roosseltam@gmail.com';
  const newPassword = 'admin123';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);

  try {
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3 RETURNING id',
      [passwordHash, adminEmail, 'admin']
    );
    if (result.rowCount > 0) {
      console.log('✅ Admin password reset to admin123');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    process.exit(0);
  }
}

resetAdminPassword();
