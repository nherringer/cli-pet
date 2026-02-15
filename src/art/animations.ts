// Terminal animations

import { setTimeout as sleep } from 'timers/promises';

export async function typeWriter(text: string, delay: number = 30): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  process.stdout.write('\n');
}

export async function fadeIn(lines: string[], delay: number = 80): Promise<void> {
  for (const line of lines) {
    console.log(line);
    await sleep(delay);
  }
}

export async function celebrate(): Promise<void> {
  const frames = ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎆'];
  for (let i = 0; i < 3; i++) {
    for (const frame of frames) {
      process.stdout.write(`\r  ${frame} `);
      await sleep(60);
    }
  }
  process.stdout.write('\r');
}
