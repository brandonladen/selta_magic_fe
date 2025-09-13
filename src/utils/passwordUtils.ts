
/**
 * Generates a secure password with a mix of uppercase, lowercase, numbers, and special characters
 * @param length Length of the password (default: 12)
 * @returns A secure random password
 */
export const generateSecurePassword = (length = 12): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding similar looking characters like I and O
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'; // Excluding similar looking characters like l
  const numbers = '23456789'; // Excluding 0 and 1 which can look like O and l
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + specialChars;
  
  // Ensure at least one of each character type
  let password = 
    uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
    lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
  // Fill the rest of the password with random characters
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};
