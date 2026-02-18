import { AnimalConfig } from '../types';

export const ANIMALS: AnimalConfig[] = [
  {
    id: 'alpaca',
    emoji: '🦙',
    name: 'Alpaca',
    description: 'Guardiana de las alturas',
    accentColor: '#C4855A',
    glowColor: 'rgba(196,133,90,0.5)',
    terrarium: {
      gradient: 'linear-gradient(180deg, #A8D8EA 0%, #d6eef6 40%, #F5EFE6 100%)',
      ambientEmoji: '❄️',
      mountainColor: '#7ca3b2',
    },
  },
  {
    id: 'condor',
    emoji: '🦅',
    name: 'Cóndor',
    description: 'Señor del viento sagrado',
    accentColor: '#6B4226',
    glowColor: 'rgba(107,66,38,0.6)',
    terrarium: {
      gradient: 'linear-gradient(180deg, #2c3e5a 0%, #4a6080 50%, #8fa0b0 100%)',
      ambientEmoji: '💨',
      mountainColor: '#3d4f62',
    },
  },
  {
    id: 'rana',
    emoji: '🐸',
    name: 'Rana Mono',
    description: 'Mensajera de la selva',
    accentColor: '#4A7C59',
    glowColor: 'rgba(74,124,89,0.5)',
    terrarium: {
      gradient: 'linear-gradient(180deg, #1a3d2b 0%, #2d6040 50%, #5a9e6a 100%)',
      ambientEmoji: '🌿',
      mountainColor: '#1e4030',
    },
  },
  {
    id: 'colibri',
    emoji: '🐦',
    name: 'Colibrí',
    description: 'Danzarina del néctar',
    accentColor: '#F2B705',
    glowColor: 'rgba(242,183,5,0.5)',
    terrarium: {
      gradient: 'linear-gradient(180deg, #e87c5a 0%, #f5b04a 50%, #fde687 100%)',
      ambientEmoji: '✨',
      mountainColor: '#c96040',
    },
  },
];

export function getAnimal(id: string): AnimalConfig {
  return ANIMALS.find((a) => a.id === id) ?? ANIMALS[0];
}
