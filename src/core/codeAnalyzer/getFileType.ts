/**
 * Determines the file type based on file extension
 */

import type { FileType } from '../../types';

/**
 * Determines the file type based on file extension
 * @param fileName - File name
 * @returns File type
 */
export function getFileType(fileName: string): FileType {
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
    return 'typescript';
  }

  if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
    return 'javascript';
  }

  if (fileName.endsWith('.json')) {
    return 'json';
  }

  if (fileName.endsWith('.md')) {
    return 'markdown';
  }

  return 'other';
}
