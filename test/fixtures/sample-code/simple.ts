/**
 * Simple TypeScript file for testing AST parsing
 */

import { someUtil } from './utils';
import * as path from 'path';

export const VERSION = '1.0.0';

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export async function fetchData(url: string): Promise<unknown> {
  // Use imported modules to avoid lint errors
  const _util = someUtil;
  const _path = path;
  return fetch(url);
}

function _privateFunction(): void {
  console.log('This is private');
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserId = string | number;

export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
