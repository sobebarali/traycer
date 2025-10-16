/**
 * Calculates relevance score for a file based on task
 */

import * as path from 'path';
import type { FileInfo, TaskDescription } from '../../types';

/**
 * Calculates relevance score for a file based on task
 * @param params - Parameters object
 * @param params.file - File information
 * @param params.task - Task description
 * @returns Relevance score (higher is more relevant)
 */
export function calculateRelevanceScore({
  file,
  task,
}: {
  file: FileInfo;
  task: TaskDescription;
}): number {
  let score = 0;

  const filePath = file.path.toLowerCase();
  const fileName = path.basename(filePath);

  // Check each scope keyword
  for (const keyword of task.scope) {
    const lowerKeyword = keyword.toLowerCase();

    // Exact match in file name (highest score)
    if (fileName.includes(lowerKeyword)) {
      score += 10;
    }

    // Match in file path
    if (filePath.includes(lowerKeyword)) {
      score += 5;
    }

    // Match in imports
    if (file.imports.some((imp) => imp.toLowerCase().includes(lowerKeyword))) {
      score += 3;
    }

    // Match in exports
    if (file.exports.some((exp) => exp.toLowerCase().includes(lowerKeyword))) {
      score += 3;
    }
  }

  return score;
}
