export type AnimalType = 'alpaca' | 'condor' | 'rana' | 'colibri';

export interface PetData {
  name: string;
  animal: AnimalType;
  vitalidad: number;
  energia: number;
  nutricion: number;
  createdAt: string;
  lastSaved: string;
  totalInteractions: number;
}

export interface AnimalConfig {
  id: AnimalType;
  emoji: string;
  name: string;
  description: string;
  accentColor: string;
  glowColor: string;
  terrarium: {
    gradient: string;
    ambientEmoji: string;
    mountainColor: string;
  };
}

export type AvatarState = 'breathe' | 'bounce' | 'shake' | 'pop';
