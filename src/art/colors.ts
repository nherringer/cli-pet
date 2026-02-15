// Color theming for the terminal display

import chalk from 'chalk';
import { PetMood } from '../pet/types.js';

export const colors = {
  title: chalk.bold.magentaBright,
  subtitle: chalk.dim,
  success: chalk.green,
  warning: chalk.yellow,
  danger: chalk.red,
  info: chalk.cyan,
  highlight: chalk.bold.white,
  muted: chalk.gray,
  pet: chalk.yellowBright,
  stat: {
    hunger: chalk.hex('#FF6B35'),
    health: chalk.hex('#FF4444'),
    happiness: chalk.hex('#44BB44'),
    energy: chalk.hex('#FFD700'),
  },
  level: chalk.bold.hex('#9B59B6'),
  xp: chalk.hex('#3498DB'),
  streak: chalk.hex('#E67E22'),
};

export function getMoodColor(mood: PetMood): (text: string) => string {
  const moodColors: Record<PetMood, (text: string) => string> = {
    happy: chalk.green,
    ecstatic: chalk.magentaBright,
    sad: chalk.blue,
    hungry: chalk.yellow,
    sick: chalk.red,
    sleeping: chalk.gray,
    playing: chalk.cyan,
    dead: chalk.dim.red,
  };
  return moodColors[mood];
}

export function colorizeArt(art: string, mood: PetMood): string {
  const color = getMoodColor(mood);
  return color(art);
}

export function statColor(value: number): (text: string) => string {
  if (value >= 75) return chalk.green;
  if (value >= 50) return chalk.yellow;
  if (value >= 25) return chalk.hex('#FF6B35');
  return chalk.red;
}

export function colorizedBar(label: string, value: number, emoji: string): string {
  const filled = Math.round(value / 5);
  const empty = 20 - filled;
  const color = statColor(value);
  const bar = color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  const percentage = color(`${value}%`.padStart(4));
  return `${emoji} ${chalk.bold(label.padEnd(10))} ${bar} ${percentage}`;
}
