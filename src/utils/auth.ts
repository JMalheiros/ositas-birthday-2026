// SHA-256 hash of "password" - CHANGE THIS TO YOUR DESIRED PASSWORD HASH!
// To generate: echo -n "yourpassword" | openssl dgst -sha256
const PASSWORD_HASH = 'aa0e55628c0edd6f1185c497011fdd3b2692e3fa068d383767d70cfca4467cbc';

// Hash a password using SHA-256
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify if the provided password is correct
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === PASSWORD_HASH;
}
