export type Boss = {
  id: string;
  name: string;
  location: string;
  weakness?: string;
  description?: string;
  image?: string;
};

export const BOSSES: Boss[] = [
  {
    id: '1',
    name: 'Ruinous Harbinger',
    location: 'Twilight Desert',
    weakness: 'Fire',
    description: 'A towering mechanical beast that uses sweeping attacks and summons minions.'
  },
  {
    id: '2',
    name: 'Abyssal Siren',
    location: 'Moonlit Coast',
    weakness: 'Lightning',
    description: 'A nimble enemy that charms players and uses water-based AoE attacks.'
  }
];
