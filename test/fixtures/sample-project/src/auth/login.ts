import { User, AuthResult } from './user';

/**
 * Authenticates a user with username and password
 * @param username - The username
 * @param password - The password
 * @returns Authentication result
 */
export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  // Mock authentication logic
  if (username.length === 0 || password.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user: User = {
    id: '123',
    username,
    email: `${username}@example.com`,
  };

  return {
    success: true,
    user,
    token: 'mock-jwt-token',
  };
}

/**
 * Validates user credentials
 * @param username - The username
 * @param password - The password
 * @returns True if valid
 */
export function validateCredentials(username: string, password: string): boolean {
  return username.length > 0 && password.length >= 8;
}
