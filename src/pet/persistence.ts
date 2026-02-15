// Persistence layer — save/load pet state

import Conf from 'conf';
import { PetState } from './types.js';

const config = new Conf<{ pet: PetState | null; githubUsername: string | null }>({
  projectName: 'cli-pet',
  defaults: {
    pet: null,
    githubUsername: null,
  },
});

export function savePet(pet: PetState): void {
  config.set('pet', pet);
}

export function loadPet(): PetState | null {
  return config.get('pet') as PetState | null;
}

export function deletePet(): void {
  config.set('pet', null);
}

export function hasPet(): boolean {
  return config.get('pet') !== null;
}

export function saveGitHubUsername(username: string): void {
  config.set('githubUsername', username);
}

export function getGitHubUsername(): string | null {
  return config.get('githubUsername') as string | null;
}
