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
  // Economía (sesión 3)
  frutas?: number;
  totalFrutasEarned?: number;
  totalFrutasSpent?: number;
  lastCoinEarnedAt?: string | null;
  // Historial (bonus)
  activityLog?: ActivityEntry[];
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

export interface ChatMessage {
  id: number;
  role: 'user' | 'guardian';
  text: string;
  timestamp: string;
}

export interface Memories {
  facts: string[];
  lastUpdated: string;
}

export interface FloatingTextItem {
  id: number;
  text: string;
}

export interface ActivityEntry {
  id: number;
  type: 'feed' | 'chat_earn' | 'other';
  coins: number;
  label: string;
  timestamp: string;
}
