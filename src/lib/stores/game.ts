import { writable } from 'svelte/store';
import { spring } from 'svelte/motion';

export type GameState = 'title' | 'character_select' | 'playing';
export type CharacterType = 'bride' | 'groom' | null;

export const gameState = writable<GameState>('title');
export const selectedCharacter = writable<CharacterType>(null);

// Spring for smooth camera movement
export const cameraX = spring(0, {
  stiffness: 0.1,
  damping: 0.8
});

// Spring for smooth character movement
export const charX = spring(0, {
  stiffness: 0.1,
  damping: 0.8
});

// Currently active modal id, null if none
export const activeModal = writable<string | null>(null);

