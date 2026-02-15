// Display helpers for terminal rendering

import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import { PetState } from '../pet/types.js';
import { getAsciiArt } from '../art/ascii.js';
import { colorizeArt, colorizedBar, colors } from '../art/colors.js';
import { getPersonalityMessage } from '../pet/engine.js';

export function renderTitle(): string {
  try {
    const title = figlet.textSync('cli-pet', { font: 'Small' });
    return colors.title(title);
  } catch {
    return colors.title('✦ cli-pet ✦');
  }
}

export function renderPetStatus(pet: PetState): string {
  const art = getAsciiArt(pet.species, pet.mood);
  const coloredArt = colorizeArt(art, pet.mood);

  const nameDisplay = colors.highlight(`${pet.name} the ${pet.species}`);
  const levelDisplay = colors.level(`Lv.${pet.level}`);
  const xpDisplay = colors.xp(`(${pet.xp}/100 XP)`);
  const moodDisplay = chalk.bold(`Mood: ${pet.mood.toUpperCase()}`);
  const aliveDisplay = pet.isAlive ? '' : chalk.bgRed.white(' ⚠ CRITICAL ');

  const ageMs = Date.now() - new Date(pet.birthDate).getTime();
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const ageDisplay = colors.muted(`Age: ${ageDays} day(s)`);

  const bars = [
    colorizedBar('Hunger', pet.stats.hunger, '🍕'),
    colorizedBar('Health', pet.stats.health, '❤️ '),
    colorizedBar('Happiness', pet.stats.happiness, '😊'),
    colorizedBar('Energy', pet.stats.energy, '⚡'),
  ].join('\n');

  const message = getPersonalityMessage(pet);

  const content = [
    `${nameDisplay}  ${levelDisplay} ${xpDisplay}  ${aliveDisplay}`,
    ageDisplay,
    '',
    coloredArt,
    '',
    moodDisplay,
    '',
    bars,
    '',
    colors.info(`💬 "${message}"`),
  ].join('\n');

  return boxen(content, {
    padding: 1,
    margin: 0,
    borderStyle: 'round',
    borderColor: pet.isAlive ? 'green' : 'red',
    title: '🐾 cli-pet',
    titleAlignment: 'center',
  });
}

export function renderActivityReport(messages: string[]): string {
  const content = messages.map((m) => `  ${m}`).join('\n');
  return boxen(content, {
    padding: 1,
    margin: { top: 1, bottom: 0, left: 0, right: 0 },
    borderStyle: 'round',
    borderColor: 'cyan',
    title: '📊 Activity Report',
    titleAlignment: 'center',
  });
}

export function renderError(message: string): string {
  return boxen(chalk.red(`❌ ${message}`), {
    padding: 1,
    borderStyle: 'round',
    borderColor: 'red',
    title: '⚠ Error',
    titleAlignment: 'center',
  });
}

export function renderSuccess(message: string): string {
  return boxen(chalk.green(`✅ ${message}`), {
    padding: 1,
    borderStyle: 'round',
    borderColor: 'green',
  });
}
