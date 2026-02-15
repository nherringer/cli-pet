// Status command — show pet status with ASCII art

import chalk from 'chalk';
import { loadPet, savePet } from '../pet/persistence.js';
import { applyDecay } from '../pet/engine.js';
import { renderPetStatus, renderError } from '../utils/display.js';

export async function statusCommand(): Promise<void> {
  const pet = loadPet();
  if (!pet) {
    console.log(renderError('No pet found! Run "cli-pet adopt" to get started.'));
    return;
  }

  // Apply time-based decay
  const updatedPet = applyDecay(pet);
  savePet(updatedPet);

  console.log();
  console.log(renderPetStatus(updatedPet));
  console.log();

  if (!updatedPet.isAlive) {
    console.log(chalk.red.bold('  ⚠ Your pet has fainted! Run "cli-pet feed" to revive them!'));
    console.log();
  } else if (updatedPet.stats.hunger < 30) {
    console.log(chalk.yellow('  💡 Tip: Run "cli-pet feed" to check GitHub activity and feed your pet!'));
    console.log();
  }
}
