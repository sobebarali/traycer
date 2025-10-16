/**
 * Finds files relevant to a given task
 */

import type { TaskDescription, FileInfo } from '../../types';
import { analyzeWorkspace } from './analyzeWorkspace';
import { calculateRelevanceScore } from './calculateRelevanceScore';

/**
 * Finds files relevant to a given task
 * @param params - Parameters object
 * @param params.task - Task description
 * @param params.workspaceRoot - Optional workspace root path
 * @returns Array of relevant files, sorted by relevance
 */
export async function findRelevantFiles({
  task,
  workspaceRoot,
}: {
  task: TaskDescription;
  workspaceRoot?: string;
}): Promise<FileInfo[]> {
  const analysis = await analyzeWorkspace(workspaceRoot);

  // If no scope keywords, return all files
  if (task.scope.length === 0) {
    return analysis.files;
  }

  // Score each file based on relevance
  const scoredFiles = analysis.files.map((file) => {
    const score = calculateRelevanceScore({ file, task });
    return { file, score };
  });

  // Sort by score (descending) and filter out zero scores
  const relevantFiles = scoredFiles
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.file);

  // Return top results or all if nothing matched
  return relevantFiles.length > 0 ? relevantFiles : analysis.files;
}
