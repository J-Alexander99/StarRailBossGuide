export type Element = 'Fire' | 'Ice' | 'Lightning' | 'Physical' | 'Quantum' | 'Wind' | 'Imaginary' | 'All';

export type Path = 'Destruction' | 'Hunt' | 'Erudition' | 'Harmony' | 'Nihility' | 'Preservation' | 'Abundance' | 'Remembrance';

export type Role = 'Sub-DPS' | 'DPS' | 'Support' | 'Sustain';

export type Meta =
  | "DOT"
  | "Crit"
  | "Break"
  | "Follow-Up"
  | "Summon"
  | "General"
  | "Kevin"
  | "Raiden"
  | "Ultimate";

export type Character = {
  id: string;
  name: string;
  element: Element;
  path?: Path;
  role?: Role;
  meta?: Meta;
};


export const CHARACTERS: Character[] = [

  // Characters from NOTES — condensed and normalized
  { id: 'argenti', name: 'Argenti', element: 'Physical', path: 'Erudition', role: 'DPS', meta: 'Crit' },
  { id: 'boothill', name: 'Boothill', element: 'Physical', path: 'Hunt', role: 'DPS', meta: 'Break' },
  { id: 'clara', name: 'Clara', element: 'Physical', path: 'Destruction', role: 'DPS', meta: 'Follow-Up' },
  { id: 'danheng_terrae', name: 'Dan Heng • Permansor Terrae', element: 'Physical', path: 'Preservation', role: 'Sustain', meta: 'General' },
  { id: 'hanya', name: 'Hanya', element: 'Physical', path: 'Harmony', role: 'Support', meta: 'Crit' },
  { id: 'hysilens', name: 'Hysilens', element: 'Physical', path: 'Nihility', role: 'DPS', meta: 'DOT' },
  { id: 'luka', name: 'Luka', element: 'Physical', path: 'Nihility', role: 'DPS', meta: 'DOT' },
  { id: 'natasha', name: 'Natasha', element: 'Physical', path: 'Abundance', role: 'Sustain', meta: 'General' },
  { id: 'kevin', name: 'Kevin', element: 'Physical', path: 'Destruction', role: 'DPS', meta: 'Kevin' },
  { id: 'robin', name: 'Robin', element: 'Physical', path: 'Harmony', role: 'Support', meta: 'Follow-Up' },
  { id: 'sushang', name: 'Sushang', element: 'Physical', path: 'Hunt', role: 'DPS', meta: 'DOT' },
  { id: 'trail_physical', name: 'Trailblazer-Physical', element: 'Physical', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'yunli', name: 'Yunli', element: 'Physical', path: 'Destruction', role: 'DPS', meta: 'Ultimate' },

  // Fire
  { id: 'asta', name: 'Asta', element: 'Fire', path: 'Harmony', role: 'Support', meta: 'General' },
  { id: 'firefly', name: 'Firefly', element: 'Fire', path: 'Destruction', role: 'DPS', meta: 'Break' },
  { id: 'fugue', name: 'Fugue', element: 'Fire', path: 'Nihility', role: 'Support', meta: 'Break' },
  { id: 'gallagher', name: 'Gallagher', element: 'Fire', path: 'Abundance', role: 'Sustain', meta: 'General' },
  { id: 'guinaifen', name: 'Guinaifen', element: 'Fire', path: 'Nihility', role: 'DPS', meta: 'DOT' },
  { id: 'himeko', name: 'Himeko', element: 'Fire', path: 'Erudition', role: 'Sub-DPS', meta: 'Follow-Up' },
  { id: 'hook', name: 'Hook', element: 'Fire', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'jiaoqiu', name: 'Jiaoqiu', element: 'Fire', path: 'Nihility', role: 'Support', meta: 'Raiden' },
  { id: 'lingsha', name: 'Lingsha', element: 'Fire', path: 'Abundance', role: 'Sustain', meta: 'Break' },
  { id: 'topaz_numby', name: 'Topaz & Numby', element: 'Fire', path: 'Hunt', role: 'DPS', meta: 'Follow-Up' },
  { id: 'trail_fire', name: 'Trailblazer-Fire', element: 'Fire', path: 'Preservation', role: 'Sustain', meta: 'General' },

  // Ice
  { id: 'elysia', name: 'Elysia', element: 'Ice', path: 'Remembrance', role: 'Support', meta: 'Summon' },
  { id: 'evernight', name: 'Evernight', element: 'Ice', path: 'Remembrance', role: 'Support', meta: 'Summon' },
  { id: 'gepard', name: 'Gepard', element: 'Ice', path: 'Preservation', role: 'Sustain', meta: 'General' },
  { id: 'herta', name: 'Herta', element: 'Ice', path: 'Erudition', role: 'Sub-DPS', meta: 'Follow-Up' },
  { id: 'jingliu', name: 'Jingliu', element: 'Ice', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'march7th', name: 'March 7th', element: 'Ice', path: 'Preservation', role: 'Sustain', meta: 'General' },
  { id: 'misha', name: 'Misha', element: 'Ice', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'pela', name: 'Pela', element: 'Ice', path: 'Nihility', role: 'Support', meta: 'General' },
  { id: 'ruanmei', name: 'Ruan Mei', element: 'Ice', path: 'Harmony', role: 'Support', meta: 'Break' },
  { id: 'the_herta', name: 'The Herta', element: 'Ice', path: 'Erudition', role: 'DPS', meta: 'Crit' },
  { id: 'trail_ice', name: 'Trailblazer-Ice', element: 'Ice', path: 'Remembrance', role: 'Support', meta: 'Summon' },
  { id: 'yanqing', name: 'Yanqing', element: 'Ice', path: 'Hunt', role: 'DPS', meta: 'Crit' },

  // Lightning
  { id: 'raiden', name: 'Raiden', element: 'Lightning', path: 'Nihility', role: 'DPS', meta: 'Raiden' },
  { id: 'aglaea', name: 'Aglaea', element: 'Lightning', path: 'Remembrance', role: 'DPS', meta: 'Summon' },
  { id: 'arlan', name: 'Arlan', element: 'Lightning', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'bailu', name: 'Bailu', element: 'Lightning', path: 'Abundance', role: 'Sustain', meta: 'General' },
  { id: 'jingyuan', name: 'Jing Yuan', element: 'Lightning', path: 'Erudition', role: 'DPS', meta: 'Follow-Up' },
  { id: 'kafka', name: 'Kafka', element: 'Lightning', path: 'Nihility', role: 'Support', meta: 'DOT' },
  { id: 'moze', name: 'Moze', element: 'Lightning', path: 'Hunt', role: 'Sub-DPS', meta: 'Follow-Up' },
  { id: 'serval', name: 'Serval', element: 'Lightning', path: 'Erudition', role: 'Sub-DPS', meta: 'DOT' },
  { id: 'tingyun', name: 'Tingyun', element: 'Lightning', path: 'Harmony', role: 'Support', meta: 'General' },

  // Wind
  { id: 'anaxa', name: 'Anaxa', element: 'Wind', path: 'Erudition', role: 'DPS', meta: 'Crit' },
  { id: 'blackswan', name: 'Black Swan', element: 'Wind', path: 'Nihility', role: 'DPS', meta: 'DOT' },
  { id: 'blade', name: 'Blade', element: 'Wind', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'bronya', name: 'Bronya', element: 'Wind', path: 'Harmony', role: 'Support', meta: 'General' },
  { id: 'cerydra', name: 'Cerydra', element: 'Wind', path: 'Harmony', role: 'Support', meta: 'Kevin' },
  { id: 'danheng', name: 'Dan Heng', element: 'Wind', path: 'Hunt', role: 'DPS', meta: 'Crit' },
  { id: 'feixiao', name: 'Feixiao', element: 'Wind', path: 'Hunt', role: 'DPS', meta: 'Follow-Up' },
  { id: 'huohuo', name: 'Huohuo', element: 'Wind', path: 'Abundance', role: 'Sustain', meta: 'DOT' },
  { id: 'hyacine', name: 'Hyacine', element: 'Wind', path: 'Remembrance', role: 'Sustain', meta: 'Summon' },
  { id: 'saber', name: 'Saber', element: 'Wind', path: 'Destruction', role: 'DPS', meta: 'Ultimate' },
  { id: 'sampo', name: 'Sampo', element: 'Wind', path: 'Nihility', role: 'DPS', meta: 'DOT' },

  // Quantum
  { id: 'archer', name: 'Archer', element: 'Quantum', path: 'Hunt', role: 'DPS', meta: 'Crit' },
  { id: 'castorice', name: 'Castorice', element: 'Quantum', path: 'Remembrance', role: 'DPS', meta: 'Crit' },
  { id: 'cipher', name: 'Cipher', element: 'Quantum', path: 'Nihility', role: 'Support', meta: 'General' },
  { id: 'fuxuan', name: 'Fu Xuan', element: 'Quantum', path: 'Preservation', role: 'Sustain', meta: 'General' },
  { id: 'jade', name: 'Jade', element: 'Quantum', path: 'Erudition', role: 'Sub-DPS', meta: 'Follow-Up' },
  { id: 'lynx', name: 'Lynx', element: 'Quantum', path: 'Abundance', role: 'Sustain', meta: 'General' },
  { id: 'qingque', name: 'Qingque', element: 'Quantum', path: 'Erudition', role: 'DPS', meta: 'Crit' },
  { id: 'seele', name: 'Seele', element: 'Quantum', path: 'Hunt', role: 'DPS', meta: 'Crit' },
  { id: 'silverwolf', name: 'Silver Wolf', element: 'Quantum', path: 'Nihility', role: 'Support', meta: 'Raiden' },
  { id: 'sparkle', name: 'Sparkle', element: 'Quantum', path: 'Harmony', role: 'Support', meta: 'General' },
  { id: 'tribbie', name: 'Tribbie', element: 'Quantum', path: 'Harmony', role: 'Support', meta: 'General' },
  { id: 'xueyi', name: 'Xueyi', element: 'Quantum', path: 'Destruction', role: 'DPS', meta: 'Crit' },

  // Imaginary
  { id: 'aventurine', name: 'Aventurine', element: 'Imaginary', path: 'Preservation', role: 'Sustain', meta: 'Follow-Up' },
  { id: 'danheng_imaginary', name: 'Dan Heng • Imbibitor Lunae', element: 'Imaginary', path: 'Destruction', role: 'Sustain', meta: 'Summon' },
  { id: 'dr_ratio', name: 'Dr. Ratio', element: 'Imaginary', path: 'Hunt', role: 'DPS', meta: 'Follow-Up' },
  { id: 'luocha', name: 'Luocha', element: 'Imaginary', path: 'Abundance', role: 'Sustain', meta: 'General' },
  { id: 'march7_imag', name: 'March 7th', element: 'Imaginary', path: 'Hunt', role: 'Sustain', meta: 'General' },
  { id: 'mydei', name: 'Mydei', element: 'Imaginary', path: 'Destruction', role: 'DPS', meta: 'Crit' },
  { id: 'rappa', name: 'Rappa', element: 'Imaginary', path: 'Erudition', role: 'DPS', meta: 'Break' },
  { id: 'sunday', name: 'Sunday', element: 'Imaginary', path: 'Harmony', role: 'Support', meta: 'General' },
  { id: 'trail_imag', name: 'Trailblazer-Imaginary', element: 'Imaginary', path: 'Harmony', role: 'Support', meta: 'Break' },
  { id: 'welt', name: 'Welt', element: 'Imaginary', path: 'Nihility', role: 'Support', meta: 'General' },
  { id: 'yukong', name: 'Yukong', element: 'Imaginary', path: 'Harmony', role: 'Support', meta: 'Crit' }
];
