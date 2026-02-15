// Play command — mini terminal game with the pet

import chalk from 'chalk';
import { loadPet, savePet } from '../pet/persistence.js';
import { applyDecay } from '../pet/engine.js';
import { renderPetStatus, renderError, renderSuccess } from '../utils/display.js';
import { typeWriter } from '../art/animations.js';
import * as readline from 'readline';

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export async function playCommand(): Promise<void> {
  let pet = loadPet();
  if (!pet) {
    console.log(renderError('No pet found! Run "cli-pet adopt" to get started.'));
    return;
  }

  pet = applyDecay(pet);

  if (!pet.isAlive) {
    console.log(renderError(`${pet.name} has fainted! Run "cli-pet feed" to revive them first.`));
    return;
  }

  if (pet.stats.energy < 10) {
    console.log(renderError(`${pet.name} is too tired to play! Let them rest or feed them first.`));
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log();
    await typeWriter(`🎮 ${pet.name} wants to play "Guess the Number"!`);
    console.log();

    const target = Math.floor(Math.random() * 20) + 1;
    let attempts = 0;
    const maxAttempts = 5;
    let won = false;

    console.log(chalk.dim(`  ${pet.name} is thinking of a number between 1 and 20...`));
    console.log(chalk.dim(`  You have ${maxAttempts} attempts!`));
    console.log();

    while (attempts < maxAttempts && !won) {
      attempts++;
      const guess = await askQuestion(rl, chalk.bold(`  Attempt ${attempts}/${maxAttempts} — Your guess: `));
      const num = parseInt(guess, 10);

      if (isNaN(num) || num < 1 || num > 20) {
        console.log(chalk.red('  Please enter a number between 1 and 20!'));
        attempts--;
        continue;
      }

      if (num === target) {
        won = true;
        console.log();
        console.log(renderSuccess(`🎉 Correct! ${pet.name} is impressed!`));
      } else if (num < target) {
        const hints = ['Higher!', 'Go up!', 'Too low!', 'Nope, higher!'];
        console.log(chalk.yellow(`  ${pet.name}: "${hints[Math.floor(Math.random() * hints.length)]} 📈"`));
      } else {
        const hints = ['Lower!', 'Go down!', 'Too high!', 'Nope, lower!'];
        console.log(chalk.yellow(`  ${pet.name}: "${hints[Math.floor(Math.random() * hints.length)]} 📉"`));
      }
    }

    if (!won) {
      console.log();
      console.log(chalk.yellow(`  ${pet.name}: "The answer was ${target}! Better luck next time! 😅"`));
    }

    // Update pet stats based on game result
    pet.stats.happiness = Math.min(100, pet.stats.happiness + (won ? 15 : 5));
    pet.stats.energy = Math.max(0, pet.stats.energy - 10);
    pet.mood = won ? 'playing' : pet.mood;
    pet.lastPlayed = new Date().toISOString();
    pet.xp += won ? 15 : 5;

    savePet(pet);

    console.log();
    console.log(renderPetStatus(pet));
    console.log();
  } finally {
    rl.close();
  }
}
