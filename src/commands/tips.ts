// Tips command — coding tips based on activity patterns

import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { loadPet, getGitHubUsername } from '../pet/persistence.js';
import { fetchGitHubActivity } from '../github/activity.js';
import { GitHubActivity } from '../pet/types.js';
import { renderError } from '../utils/display.js';
import { typeWriter } from '../art/animations.js';
import { colors } from '../art/colors.js';

function generateTips(activity: GitHubActivity, petName: string): string[] {
  const tips: string[] = [];

  // Commit frequency tips
  if (activity.recentCommits === 0) {
    tips.push(`💡 ${petName} says: "Start with a small commit today! Even a README update counts. The hardest part is starting." 🚀`);
  } else if (activity.recentCommits < 5) {
    tips.push(`💡 ${petName} says: "Try breaking your work into smaller, atomic commits. It makes code review easier and keeps me well-fed!" 🍕`);
  } else if (activity.recentCommits > 20) {
    tips.push(`💡 ${petName} says: "Wow, you're on fire! Make sure each commit has a clear message. Future you will thank present you!" 🔥`);
  }

  // CI tips
  if (activity.ciSuccessRate < 0.5) {
    tips.push(`🏥 ${petName} says: "Your CI is struggling! Try running tests locally before pushing. My health depends on it!" 💚`);
  } else if (activity.ciSuccessRate < 0.8) {
    tips.push(`🔧 ${petName} says: "CI could be greener! Consider adding pre-commit hooks to catch issues early." 🪝`);
  } else if (activity.ciSuccessRate >= 0.95) {
    tips.push(`⭐ ${petName} says: "Almost perfect CI! You're a testing champion! Keep it up!" 🏆`);
  }

  // PR tips
  if (activity.recentPRsMerged === 0 && activity.recentCommits > 5) {
    tips.push(`🔀 ${petName} says: "You're committing but not merging PRs. Consider opening a PR to get feedback on your work!" 👀`);
  }

  if (activity.recentPRsReviewed === 0) {
    tips.push(`👥 ${petName} says: "Try reviewing a teammate's PR today. Code review is a two-way street — and I love teamwork!" 🤝`);
  }

  // Streak tips
  if (activity.streakDays === 0) {
    tips.push(`📅 ${petName} says: "Start a coding streak today! Even 15 minutes of coding a day builds momentum." ⚡`);
  } else if (activity.streakDays >= 7) {
    tips.push(`🔥 ${petName} says: "Amazing ${activity.streakDays}-day streak! But remember: rest is productive too. Take breaks!" 😌`);
  }

  // General tips (always include at least one)
  const generalTips = [
    `🌟 ${petName} says: "Write code that your future self will thank you for. Clear names > clever tricks."`,
    `📚 ${petName} says: "Read someone else's open source code today. It's the fastest way to learn new patterns!"`,
    `🧪 ${petName} says: "When in doubt, write a test first. TDD is like feeding me vegetables — good for both of us!"`,
    `🎯 ${petName} says: "Focus on one thing at a time. Context switching is the enemy of deep work."`,
    `🌿 ${petName} says: "Keep your branches short-lived. Long-lived branches are where merge conflicts breed!"`,
    `📝 ${petName} says: "Document your 'why', not just your 'what'. Code tells you how; comments tell you why."`,
  ];

  tips.push(generalTips[Math.floor(Math.random() * generalTips.length)]);

  return tips;
}

export async function tipsCommand(): Promise<void> {
  const pet = loadPet();
  if (!pet) {
    console.log(renderError('No pet found! Run "cli-pet adopt" to get started.'));
    return;
  }

  const spinner = ora({
    text: chalk.cyan(`${pet.name} is analyzing your coding patterns...`),
    spinner: 'dots',
  }).start();

  try {
    const username = getGitHubUsername() || undefined;
    const activity = await fetchGitHubActivity(username);

    spinner.succeed(chalk.green(`${pet.name} has some advice!`));
    console.log();

    const tips = generateTips(activity, pet.name);

    const content = tips.map((tip) => `  ${tip}`).join('\n\n');

    console.log(boxen(content, {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'magenta',
      title: `🧠 ${pet.name}'s Coding Tips`,
      titleAlignment: 'center',
    }));
    console.log();
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to generate tips'));
    console.log(renderError(error.message || 'Unknown error'));
  }
}
