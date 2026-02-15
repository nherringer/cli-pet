// Pet state machine and stat calculations

import { PetState, PetStats, PetMood, ActivityImpact, GitHubActivity, DEFAULT_STATS, XP_PER_LEVEL } from './types.js';

export function calculateMood(stats: PetStats): PetMood {
  const avg = (stats.hunger + stats.health + stats.happiness + stats.energy) / 4;

  if (stats.health <= 0 || stats.hunger <= 0) return 'dead';
  if (stats.health < 20) return 'sick';
  if (stats.hunger < 20) return 'hungry';
  if (stats.energy < 15) return 'sleeping';
  if (avg >= 85) return 'ecstatic';
  if (avg >= 60) return 'happy';
  if (avg >= 35) return 'sad';
  return 'sad';
}

export function applyDecay(pet: PetState): PetState {
  const now = new Date();
  const lastFed = new Date(pet.lastFed);
  const hoursSinceLastFed = Math.max(0, (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60));

  // Decay rates per hour
  const hungerDecay = Math.min(hoursSinceLastFed * 2, 50);
  const healthDecay = Math.min(hoursSinceLastFed * 0.5, 20);
  const happinessDecay = Math.min(hoursSinceLastFed * 1.5, 40);
  const energyDecay = Math.min(hoursSinceLastFed * 1, 30);

  const newStats: PetStats = {
    hunger: clamp(pet.stats.hunger - hungerDecay),
    health: clamp(pet.stats.health - healthDecay),
    happiness: clamp(pet.stats.happiness - happinessDecay),
    energy: clamp(pet.stats.energy - energyDecay),
  };

  const isAlive = newStats.health > 0 && newStats.hunger > 0;

  return {
    ...pet,
    stats: newStats,
    mood: isAlive ? calculateMood(newStats) : 'dead',
    isAlive,
  };
}

export function applyActivity(pet: PetState, impact: ActivityImpact): PetState {
  const newStats: PetStats = {
    hunger: clamp(pet.stats.hunger + impact.hungerChange),
    health: clamp(pet.stats.health + impact.healthChange),
    happiness: clamp(pet.stats.happiness + impact.happinessChange),
    energy: clamp(pet.stats.energy + impact.energyChange),
  };

  const newXp = pet.xp + impact.xpGained;
  const newLevel = pet.level + Math.floor(newXp / XP_PER_LEVEL);
  const remainingXp = newXp % XP_PER_LEVEL;

  return {
    ...pet,
    stats: newStats,
    xp: remainingXp,
    level: newLevel,
    mood: calculateMood(newStats),
    lastFed: new Date().toISOString(),
    isAlive: true,
  };
}

export function analyzeActivity(activity: GitHubActivity): ActivityImpact {
  const messages: string[] = [];
  let hungerChange = 0;
  let healthChange = 0;
  let happinessChange = 0;
  let energyChange = 0;
  let xpGained = 0;

  // Commits feed the pet
  if (activity.recentCommits > 0) {
    hungerChange += Math.min(activity.recentCommits * 8, 60);
    xpGained += activity.recentCommits * 5;
    if (activity.recentCommits >= 10) {
      messages.push(`🔥 ${activity.recentCommits} commits! Your pet is STUFFED!`);
    } else if (activity.recentCommits >= 5) {
      messages.push(`🍕 ${activity.recentCommits} commits — a good meal!`);
    } else {
      messages.push(`🍞 ${activity.recentCommits} commit(s) — a light snack.`);
    }
  } else {
    messages.push(`😿 No recent commits... your pet is getting hungry!`);
  }

  // CI status affects health
  if (activity.ciSuccessRate >= 0.9) {
    healthChange += 30;
    messages.push(`💚 CI is green! Your pet feels great!`);
  } else if (activity.ciSuccessRate >= 0.5) {
    healthChange += 10;
    messages.push(`🟡 CI is flaky — pet is a bit uneasy.`);
  } else if (activity.ciSuccessRate >= 0) {
    healthChange -= 10;
    messages.push(`🔴 CI is failing — your pet feels sick!`);
  }

  // PRs boost happiness
  if (activity.recentPRsMerged > 0) {
    happinessChange += activity.recentPRsMerged * 15;
    xpGained += activity.recentPRsMerged * 20;
    messages.push(`🎉 ${activity.recentPRsMerged} PR(s) merged! Pet is thrilled!`);
  }

  if (activity.recentPRsReviewed > 0) {
    happinessChange += activity.recentPRsReviewed * 10;
    xpGained += activity.recentPRsReviewed * 10;
    messages.push(`👀 ${activity.recentPRsReviewed} review(s) done — pet loves teamwork!`);
  }

  // Streaks boost energy
  if (activity.streakDays > 0) {
    energyChange += Math.min(activity.streakDays * 5, 40);
    xpGained += activity.streakDays * 3;
    if (activity.streakDays >= 7) {
      messages.push(`⚡ ${activity.streakDays}-day streak! Pet is SUPERCHARGED!`);
    } else if (activity.streakDays >= 3) {
      messages.push(`✨ ${activity.streakDays}-day streak — pet is energized!`);
    } else {
      messages.push(`💪 ${activity.streakDays}-day streak — keep it up!`);
    }
  }

  return { hungerChange, healthChange, happinessChange, energyChange, xpGained, messages };
}

export function createNewPet(name: string, species: PetState['species']): PetState {
  return {
    name,
    species,
    stats: { ...DEFAULT_STATS },
    mood: 'happy',
    level: 1,
    xp: 0,
    birthDate: new Date().toISOString(),
    lastFed: new Date().toISOString(),
    lastPlayed: new Date().toISOString(),
    totalCommits: 0,
    totalPRs: 0,
    streak: 0,
    isAlive: true,
  };
}

export function getPersonalityMessage(pet: PetState): string {
  const { mood, name, stats, streak } = pet;
  const messages: Record<string, string[]> = {
    ecstatic: [
      `${name} is on top of the world! 🌟`,
      `${name} can't stop purring with joy! ✨`,
      `${name} is doing a happy dance! 💃`,
    ],
    happy: [
      `${name} wags their tail at you! 🐾`,
      `${name} looks content and well-fed.`,
      `${name} gives you a grateful look. 😊`,
    ],
    sad: [
      `${name} looks at you with big eyes... 🥺`,
      `${name} could use some attention.`,
      `${name} misses your commits! 📝`,
    ],
    hungry: [
      `${name}'s tummy is rumbling! 🍕`,
      `${name} stares at you expectantly...`,
      `Feed ${name} some commits! 🍞`,
    ],
    sick: [
      `${name} doesn't feel well... fix those builds! 🏥`,
      `${name} needs green CI to recover! 💊`,
      `Poor ${name} is under the weather. 🤒`,
    ],
    sleeping: [
      `Shhh... ${name} is taking a nap. 😴`,
      `${name} is recharging. Come back later! 💤`,
      `${name} fell asleep waiting for activity. 🌙`,
    ],
    dead: [
      `${name} has fainted! Quick, make some commits! 😱`,
      `${name} needs urgent care! Push some code! 🚨`,
    ],
    playing: [
      `${name} is having fun! 🎮`,
      `${name} bounces around playfully! 🎾`,
    ],
  };

  const pool = messages[mood] || messages['happy'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}
