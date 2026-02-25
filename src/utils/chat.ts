import { ChatMessage, Memories } from '../types';

const CHAT_KEY = 'regenwasi_chat';
const MEMORIES_KEY = 'regenwasi_memories';

export function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-20)));
}

export function loadMemories(): Memories {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    return raw ? (JSON.parse(raw) as Memories) : { facts: [], lastUpdated: new Date().toISOString() };
  } catch {
    return { facts: [], lastUpdated: new Date().toISOString() };
  }
}

export function saveMemories(memories: Memories): void {
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function clearChat(): void {
  localStorage.removeItem(CHAT_KEY);
  localStorage.removeItem(MEMORIES_KEY);
}
