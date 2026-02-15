// GitHub activity fetcher — uses gh CLI or Octokit

import { Octokit } from '@octokit/rest';
import { GitHubActivity } from '../pet/types.js';
import { execSync } from 'child_process';

function getGitHubToken(): string | null {
  // Try gh CLI first
  try {
    const token = execSync('gh auth token', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    if (token) return token;
  } catch {}

  // Try environment variable
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  return null;
}

function getAuthenticatedUsername(octokit: Octokit): Promise<string> {
  return octokit.rest.users.getAuthenticated().then((res) => res.data.login);
}

export async function fetchGitHubActivity(username?: string): Promise<GitHubActivity> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error(
      'GitHub authentication required!\n' +
      'Please authenticate using one of:\n' +
      '  • gh auth login (recommended)\n' +
      '  • Set GITHUB_TOKEN environment variable'
    );
  }

  const octokit = new Octokit({ auth: token });

  // Get the authenticated user if username not provided
  const user = username || await getAuthenticatedUsername(octokit);

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch recent events
  const [eventsRes] = await Promise.all([
    octokit.rest.activity.listPublicEventsForUser({
      username: user,
      per_page: 100,
    }).catch(() => ({ data: [] })),
  ]);

  const events = eventsRes.data;

  // Count commits (PushEvents in last 7 days)
  const pushEvents = events.filter(
    (e: any) => e.type === 'PushEvent' && new Date(e.created_at!) >= oneWeekAgo
  );
  const recentCommits = pushEvents.reduce(
    (sum: number, e: any) => sum + (e.payload?.commits?.length || 0), 0
  );

  // Count today's commits
  const todayPushEvents = events.filter(
    (e: any) => e.type === 'PushEvent' && new Date(e.created_at!) >= oneDayAgo
  );
  const totalCommitsToday = todayPushEvents.reduce(
    (sum: number, e: any) => sum + (e.payload?.commits?.length || 0), 0
  );

  // Count merged PRs (PullRequestEvent with action=closed and merged)
  const prEvents = events.filter(
    (e: any) => e.type === 'PullRequestEvent' &&
    e.payload?.action === 'closed' &&
    e.payload?.pull_request?.merged &&
    new Date(e.created_at!) >= oneWeekAgo
  );
  const recentPRsMerged = prEvents.length;

  // Count PR reviews
  const reviewEvents = events.filter(
    (e: any) => e.type === 'PullRequestReviewEvent' && new Date(e.created_at!) >= oneWeekAgo
  );
  const recentPRsReviewed = reviewEvents.length;

  // Calculate CI success rate from recent status/check events
  // Use a simpler heuristic: ratio of successful workflow runs
  let ciSuccessRate = 0.8; // default optimistic
  try {
    // Try to find repos with recent activity
    const repos = [...new Set(events.map((e: any) => e.repo?.name).filter(Boolean))].slice(0, 3);
    let totalRuns = 0;
    let successRuns = 0;

    for (const repoFull of repos) {
      const [owner, repo] = (repoFull as string).split('/');
      try {
        const runs = await octokit.rest.actions.listWorkflowRunsForRepo({
          owner,
          repo,
          per_page: 10,
          created: `>=${oneWeekAgo.toISOString().split('T')[0]}`,
        });
        for (const run of runs.data.workflow_runs) {
          totalRuns++;
          if (run.conclusion === 'success') successRuns++;
        }
      } catch {}
    }

    if (totalRuns > 0) {
      ciSuccessRate = successRuns / totalRuns;
    }
  } catch {}

  // Calculate streak (consecutive days with activity)
  const activityDates = new Set(
    events.map((e: any) => new Date(e.created_at!).toISOString().split('T')[0])
  );

  let streakDays = 0;
  const checkDate = new Date(now);
  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (activityDates.has(dateStr)) {
      streakDays++;
    } else if (i > 0) {
      break; // streak broken
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const lastEvent = events[0];
  const lastActivityDate = lastEvent ? (lastEvent as any).created_at : now.toISOString();

  return {
    recentCommits,
    recentPRsMerged,
    recentPRsReviewed,
    ciSuccessRate,
    streakDays,
    totalCommitsToday,
    lastActivityDate,
  };
}
