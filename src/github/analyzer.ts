// GitHub activity analyzer — maps raw activity to pet stat changes

import { GitHubActivity, ActivityImpact } from '../pet/types.js';
import { analyzeActivity } from '../pet/engine.js';

export { analyzeActivity };

export function summarizeActivity(activity: GitHubActivity): string {
  const parts: string[] = [];

  if (activity.recentCommits > 0) {
    parts.push(`${activity.recentCommits} commit(s)`);
  }
  if (activity.recentPRsMerged > 0) {
    parts.push(`${activity.recentPRsMerged} PR(s) merged`);
  }
  if (activity.recentPRsReviewed > 0) {
    parts.push(`${activity.recentPRsReviewed} review(s)`);
  }
  if (activity.streakDays > 0) {
    parts.push(`${activity.streakDays}-day streak`);
  }

  if (parts.length === 0) {
    return 'No recent activity found';
  }

  return parts.join(' • ');
}
