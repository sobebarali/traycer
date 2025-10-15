/**
 * Complex TypeScript file for testing AST parsing
 */

import { Request, Response } from 'express';
import type { NextFunction } from 'express';
import defaultExport from 'some-module';

export class UserService {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: generateId(),
      ...data,
    };
    this.users.set(user.id, user);
    return user;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export type UserId = string;
export type UserList = User[];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('Middleware executed');
  next();
}

export { defaultExport };
export { Request as ExpressRequest };
