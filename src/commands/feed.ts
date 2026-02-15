// Feed command — fetch GitHub activity and feed the pet

import chalk from 'chalk';
import ora from 'ora';
import { loadPet, savePet, getGitHubUsername } from '../pet/persistence.js';
import { applyDecay, applyActivity, analyzeActivity, createNewPet } from '../pet/engine.js';
import { fetchGitHubActivity } from '../github/activity.js';
import { renderPetStatus, renderActivityReport, renderError } from '../utils/display.js';
import { celebrate } from '../art/animations.js';

export async function feedCommand(): Promise<void> {
  let pet = loadPet();
  if (!pet) {
    console.log(renderError('No pet found! Run "cli-pet adopt" to get started.'));
    return;
  }

  // Apply decay first
  pet = applyDecay(pet);

  const spinner = ora({
    text: chalk.cyan('Fetching your GitHub activity...'),
    spinner: 'dots',
  }).start();

  try {
    const username = getGitHubUsername() || undefined;
    const activity = await fetchGitHubActivity(username);

    spinner.succeed(chalk.green('GitHub activity fetched!'));
    console.log();

    // Analyze and apply activity
    const impact = analyzeActivity(activity);

    // If pet is dead, revive with reduced stats
    if (!pet.isAlive) {
      console.log(chalk.yellow('🏥 Reviving your pet...'));
      pet = {
        ...pet,
        isAlive: true,
        stats: { hunger: 20, health: 20, happiness: 20, energy: 20 },
      };
    }

    const updatedPet = applyActivity(pet, impact);
    updatedPet.totalCommits += activity.recentCommits;
    updatedPet.totalPRs += activity.recentPRsMerged;
    updatedPet.streak = activity.streakDays;

    savePet(updatedPet);

    // Show activity report
    console.log(renderActivityReport(impact.messages));

    // Celebrate level ups
    const levelsGained = updatedPet.level - pet.level;
    if (levelsGained > 0) {
      console.log();
      console.log(chalk.bold.magenta(`  🎊 LEVEL UP! ${pet.name} is now level ${updatedPet.level}!`));
      await celebrate();
    }

    // Show updated status
    console.log();
    console.log(renderPetStatus(updatedPet));
    console.log();
  } catch (error: any) {
    spinner.fail(chalk.red('Failed to fetch GitHub activity'));
    console.log(renderError(error.message || 'Unknown error'));
  }
}
