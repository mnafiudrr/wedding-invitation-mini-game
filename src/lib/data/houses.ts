export interface HouseData {
  id: string;
  title: string;
  x: number;
  color: string;
  image?: string;
}

// World / entity sizing — single source of truth for game dimensions.
export const WORLD_WIDTH = 3000;
export const CHAR_WIDTH = 128;
export const CHAR_HEIGHT = 160;
export const HOUSE_WIDTH = 160;
export const HOUSE_HEIGHT = 200;
export const PROXIMITY_THRESHOLD = 200;

export const houses: HouseData[] = [
  { id: 'bride-groom', title: 'Bride & Groom', x: 320, color: '#ffb3ba', image: 'bride-groom.png' },
  { id: 'quran-quotes', title: 'Quran Quotes', x: 720, color: '#ffdfba', image: 'quran.png' },
  { id: 'events', title: 'Events', x: 1120, color: '#ffffba', image: 'event.png' },
  { id: 'maps', title: 'Maps', x: 1520, color: '#baffc9', image: 'map.png' },
  { id: 'rsvp', title: 'RSVP', x: 1920, color: '#bae1ff', image: 'rsvp.png' },
  { id: 'messages', title: 'Messages', x: 2320, color: '#e6b3ff', image: 'message.png' },
  { id: 'credits', title: 'Credits', x: 2720, color: '#ffd1dc' }
];