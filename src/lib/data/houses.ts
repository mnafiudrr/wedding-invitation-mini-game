export interface HouseData {
  id: string;
  title: string;
  x: number;
  color: string;
}

export const houses: HouseData[] = [
  { id: 'bride-groom', title: 'Bride & Groom', x: 300, color: '#ffb3ba' },
  { id: 'quran-quotes', title: 'Quran Quotes', x: 620, color: '#ffdfba' },
  { id: 'events', title: 'Events', x: 940, color: '#ffffba' },
  { id: 'maps', title: 'Maps', x: 1260, color: '#baffc9' },
  { id: 'rsvp', title: 'RSVP', x: 1580, color: '#bae1ff' },
  { id: 'messages', title: 'Messages', x: 1900, color: '#e6b3ff' },
  { id: 'credits', title: 'Credits', x: 2220, color: '#ffd1dc' },
];
