// User config management

import { getGitHubUsername, saveGitHubUsername } from '../pet/persistence.js';
import { execSync } from 'child_process';

export function resolveGitHubUsername(): string | null {
  // Check saved config first
  const saved = getGitHubUsername();
  if (saved) return saved;

  // Try gh CLI
  try {
    const username = execSync('gh api user --jq .login', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (username) {
      saveGitHubUsername(username);
      return username;
    }
  } catch {}

  // Try git config
  try {
    const username = execSync('git config --global user.name', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    if (username) return username;
  } catch {}

  return null;
}
