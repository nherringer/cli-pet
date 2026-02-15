// Adopt command — interactive pet adoption

import chalk from 'chalk';
import { createNewPet } from '../pet/engine.js';
import { savePet, hasPet, saveGitHubUsername } from '../pet/persistence.js';
import { PetSpecies, SPECIES_NAMES } from '../pet/types.js';
import { renderTitle, renderPetStatus } from '../utils/display.js';
import { typeWriter, fadeIn } from '../art/animations.js';
import { resolveGitHubUsername } from '../utils/config.js';
import * as readline from 'readline';

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export async function adoptCommand(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log(renderTitle());
    console.log();

    if (hasPet()) {
      await typeWriter(chalk.yellow('⚠ You already have a pet! Use "cli-pet status" to check on them.'));
      await typeWriter(chalk.dim('If you want to adopt a new pet, your current pet will be replaced.'));
      const confirm = await askQuestion(rl, chalk.bold('\nContinue? (y/N): '));
      if (confirm.toLowerCase() !== 'y') {
        console.log(chalk.green('\nGreat! Your pet is waiting for you. 🐾'));
        rl.close();
        return;
      }
      console.log();
    }

    await typeWriter('🏠 Welcome to the cli-pet Adoption Center!');
    console.log();

    // Show available species
    await fadeIn([
      chalk.bold('Available pets:'),
      '',
      `  ${chalk.cyan('1.')} ${SPECIES_NAMES.cat}    — Purrs when your CI is green`,
      `  ${chalk.cyan('2.')} ${SPECIES_NAMES.dog}    — Fetches your GitHub notifications`,
      `  ${chalk.cyan('3.')} ${SPECIES_NAMES.dragon} — Breathes fire on failing tests`,
      `  ${chalk.cyan('4.')} ${SPECIES_NAMES.octocat} — The ultimate GitHub companion`,
      '',
    ], 60);

    const speciesMap: Record<string, PetSpecies> = {
      '1': 'cat', '2': 'dog', '3': 'dragon', '4': 'octocat',
      'cat': 'cat', 'dog': 'dog', 'dragon': 'dragon', 'octocat': 'octocat',
    };

    let species: PetSpecies | undefined;
    while (!species) {
      const choice = await askQuestion(rl, chalk.bold('Choose your pet (1-4): '));
      species = speciesMap[choice.toLowerCase()];
      if (!species) {
        console.log(chalk.red('Please enter 1, 2, 3, or 4'));
      }
    }

    // Name the pet
    let name = '';
    while (!name) {
      name = await askQuestion(rl, chalk.bold(`\nName your ${species}: `));
      if (!name) {
        console.log(chalk.red('Your pet needs a name!'));
      }
    }

    // GitHub username
    console.log();
    const detectedUsername = resolveGitHubUsername();
    let username = detectedUsername;
    if (detectedUsername) {
      await typeWriter(`🔗 Detected GitHub user: ${chalk.cyan(detectedUsername)}`);
      const confirm = await askQuestion(rl, chalk.bold('Is this correct? (Y/n): '));
      if (confirm.toLowerCase() === 'n') {
        username = await askQuestion(rl, chalk.bold('Enter your GitHub username: '));
      }
    } else {
      username = await askQuestion(rl, chalk.bold('Enter your GitHub username: '));
    }

    if (username) {
      saveGitHubUsername(username);
    }

    // Create and save the pet
    const pet = createNewPet(name, species);
    savePet(pet);

    console.log();
    await typeWriter(`🎉 Congratulations! You adopted ${chalk.bold(name)} the ${species}!`);
    console.log();
    console.log(renderPetStatus(pet));
    console.log();
    await fadeIn([
      chalk.dim('Tips:'),
      chalk.dim('  • cli-pet status  — Check on your pet'),
      chalk.dim('  • cli-pet feed    — Feed with your GitHub activity'),
      chalk.dim('  • cli-pet play    — Play a mini-game'),
      chalk.dim('  • cli-pet stats   — See detailed GitHub stats'),
      chalk.dim('  • cli-pet tips    — Get coding tips from your pet'),
    ], 40);
  } finally {
    rl.close();
  }
}
