// Pet type definitions and interfaces

export type PetSpecies = 'cat' | 'dog' | 'dragon' | 'octocat';

export type PetMood = 'happy' | 'sad' | 'hungry' | 'sick' | 'sleeping' | 'playing' | 'dead' | 'ecstatic';

export interface PetStats {
  hunger: number;    // 0-100, fed by commits
  health: number;    // 0-100, driven by CI status
  happiness: number; // 0-100, boosted by PRs/reviews
  energy: number;    // 0-100, affected by coding streaks
}

export interface PetState {
  name: string;
  species: PetSpecies;
  stats: PetStats;
  mood: PetMood;
  level: number;
  xp: number;
  birthDate: string;
  lastFed: string;
  lastPlayed: string;
  totalCommits: number;
  totalPRs: number;
  streak: number;
  isAlive: boolean;
}

export interface GitHubActivity {
  recentCommits: number;
  recentPRsMerged: number;
  recentPRsReviewed: number;
  ciSuccessRate: number;   // 0-1
  streakDays: number;
  totalCommitsToday: number;
  lastActivityDate: string;
}

export interface ActivityImpact {
  hungerChange: number;
  healthChange: number;
  happinessChange: number;
  energyChange: number;
  xpGained: number;
  messages: string[];
}

export const DEFAULT_STATS: PetStats = {
  hunger: 50,
  health: 70,
  happiness: 60,
  energy: 60,
};

export const XP_PER_LEVEL = 100;

export const SPECIES_NAMES: Record<PetSpecies, string> = {
  cat: '🐱 Cat',
  dog: '🐶 Dog',
  dragon: '🐉 Dragon',
  octocat: '🐙 Octocat',
};
