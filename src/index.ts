#!/usr/bin/env node

// cli-pet — A GitHub-powered virtual pet for your terminal 🐾

import { Command } from 'commander';
import chalk from 'chalk';
import { adoptCommand } from './commands/adopt.js';
import { statusCommand } from './commands/status.js';
import { feedCommand } from './commands/feed.js';
import { playCommand } from './commands/play.js';
import { statsCommand } from './commands/stats.js';
import { tipsCommand } from './commands/tips.js';
import { renderTitle, renderError } from './utils/display.js';
import { hasPet } from './pet/persistence.js';

const program = new Command();

program
  .name('cli-pet')
  .description('🐾 A GitHub-powered virtual pet that lives in your terminal')
  .version('1.0.0');

program
  .command('adopt')
  .description('🏠 Adopt a new virtual pet')
  .action(async () => {
    try {
      await adoptCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

program
  .command('status')
  .description('👀 Check on your pet')
  .action(async () => {
    try {
      await statusCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

program
  .command('feed')
  .description('🍕 Feed your pet with GitHub activity')
  .action(async () => {
    try {
      await feedCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

program
  .command('play')
  .description('🎮 Play a mini-game with your pet')
  .action(async () => {
    try {
      await playCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

program
  .command('stats')
  .description('📊 View detailed GitHub stats & pet progress')
  .action(async () => {
    try {
      await statsCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

program
  .command('tips')
  .description('🧠 Get coding tips from your pet')
  .action(async () => {
    try {
      await tipsCommand();
    } catch (error: any) {
      console.log(renderError(error.message));
    }
  });

// Default action: show status if pet exists, otherwise show help
program.action(async () => {
  if (hasPet()) {
    await statusCommand();
  } else {
    console.log(renderTitle());
    console.log();
    console.log(chalk.bold('  🐾 Welcome to cli-pet!'));
    console.log(chalk.dim('  A GitHub-powered virtual pet for your terminal.\n'));
    console.log(chalk.cyan('  Get started by adopting a pet:\n'));
    console.log(chalk.white('    $ cli-pet adopt\n'));
    program.help();
  }
});

program.parse();
