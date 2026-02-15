// Stats command — detailed GitHub activity breakdown

import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { loadPet, getGitHubUsername } from '../pet/persistence.js';
import { fetchGitHubActivity } from '../github/activity.js';
import { renderError } from '../utils/display.js';
import { colors } from '../art/colors.js';

export async function statsCommand(): Promise<void> {
  const pet = loadPet();
  if (!pet) {
    console.log(renderError('No pet found! Run "cli-pet adopt" to get started.'));
    return;
  }

  const spinner = ora({
    text: chalk.cyan('Fetching GitHub stats...'),
    spinner: 'dots',
  }).start();

  try {
    const username = getGitHubUsername() || undefined;
    const activity = await fetchGitHubActivity(username);

    spinner.succeed(chalk.green('Stats loaded!'));
    console.log();

    const ciEmoji = activity.ciSuccessRate >= 0.9 ? '💚' :
                    activity.ciSuccessRate >= 0.5 ? '🟡' : '🔴';
    const ciPercent = Math.round(activity.ciSuccessRate * 100);

    const streakEmoji = activity.streakDays >= 7 ? '🔥' :
                        activity.streakDays >= 3 ? '✨' : '💪';

    const content = [
      colors.highlight(`📊 GitHub Activity for ${username || 'you'}`),
      '',
      `  🔄 Recent Commits (7d):     ${chalk.bold(String(activity.recentCommits))}`,
      `  📝 Today's Commits:          ${chalk.bold(String(activity.totalCommitsToday))}`,
      `  🔀 PRs Merged (7d):          ${chalk.bold(String(activity.recentPRsMerged))}`,
      `  👀 PRs Reviewed (7d):        ${chalk.bold(String(activity.recentPRsReviewed))}`,
      `  ${ciEmoji} CI Success Rate:         ${chalk.bold(`${ciPercent}%`)}`,
      `  ${streakEmoji} Coding Streak:           ${chalk.bold(`${activity.streakDays} day(s)`)}`,
      '',
      colors.muted('─'.repeat(40)),
      '',
      colors.highlight(`🐾 ${pet.name}'s Lifetime Stats`),
      '',
      `  📈 Total Commits Fed:        ${chalk.bold(String(pet.totalCommits))}`,
      `  🔀 Total PRs Fed:            ${chalk.bold(String(pet.totalPRs))}`,
      `  ⭐ Current Level:            ${colors.level(`Lv.${pet.level}`)}`,
      `  ✨ Current XP:               ${colors.xp(`${pet.xp}/100`)}`,
      `  🎂 Pet Age:                  ${chalk.bold(`${Math.floor((Date.now() - new Date(pet.birthDate).getTime()) / (1000 * 60 * 60 * 24))} day(s)`)}`,
      `  🔥 Best Streak:              ${chalk.bold(`${pet.streak} day(s)`)}`,
    ].join('\n');

    console.log(boxen(content, {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      title: '📈 GitHub Stats & Pet Progress',
      titleAlignment: 'center',
    }));
    console.log();
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to fetch stats'));
    console.log(renderError(error.message || 'Unknown error'));
  }
}
