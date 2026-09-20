export interface HouseData {
  id: string;
  title: string;
  x: number;
  color: string;
}

// World / entity sizing — single source of truth for game dimensions.
export const WORLD_WIDTH = 3000;
export const CHAR_WIDTH = 128;
export const CHAR_HEIGHT = 160;
export const HOUSE_WIDTH = 160;
export const HOUSE_HEIGHT = 200;
export const PROXIMITY_THRESHOLD = 200;

export const houses: HouseData[] = [
  { id: 'bride-groom', title: 'Bride & Groom', x: 320, color: '#ffb3ba' },
  { id: 'quran-quotes', title: 'Quran Quotes', x: 720, color: '#ffdfba' },
  { id: 'events', title: 'Events', x: 1120, color: '#ffffba' },
  { id: 'maps', title: 'Maps', x: 1520, color: '#baffc9' },
  { id: 'rsvp', title: 'RSVP', x: 1920, color: '#bae1ff' },
  { id: 'messages', title: 'Messages', x: 2320, color: '#e6b3ff' },
  { id: 'credits', title: 'Credits', x: 2720, color: '#ffd1dc' },
];