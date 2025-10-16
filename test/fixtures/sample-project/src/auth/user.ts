/**
 * User interface
 */
export interface User {
  id: string;
  username: string;
  email: string;
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean;
  user: User;
  token: string;
}

/**
 * User class for managing user data
 */
export class UserManager {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}
