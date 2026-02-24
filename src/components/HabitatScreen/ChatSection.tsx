import { useState, useEffect, useCallback, useRef } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatMessage, Memories, FloatingTextItem, PetData } from '../../types';
import { loadMessages, saveMessages, loadMemories, saveMemories } from '../../utils/chat';
import { callOpenAI, buildSystemPrompt, extractMemory } from '../../utils/api';

interface ChatSectionProps {
  pet: PetData;
  memories: Memories;
  onPetUpdate: (updater: (prev: PetData) => PetData) => void;
  onMemoriesUpdate: (m: Memories) => void;
}

export default function ChatSection({ pet, memories, onPetUpdate, onMemoriesUpdate }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  const sessionCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  function addFloating(texts: string[]) {
    const now = Date.now();
    setFloatingTexts((prev) => [
      ...prev,
      ...texts.map((text, i) => ({ id: now + i, text })),
    ]);
  }

  function removeFloating(id: number) {
    setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
  }

  const applyStatEffects = useCallback(
    (count: number) => {
      onPetUpdate((prev) => {
        const extraEnergyDrain = count > 5 ? 5 : 0;
        return {
          ...prev,
          vitalidad: Math.min(100, prev.vitalidad + 5),
          energia: Math.max(0, prev.energia - 3 - extraEnergyDrain),
        };
      });
    },
    [onPetUpdate]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: Date.now(),
        role: 'user',
        text,
        timestamp: new Date().toISOString(),
      };

      const withUser = [...messages, userMsg].slice(-20);
      setMessages(withUser);
      saveMessages(withUser);

      sessionCountRef.current += 1;
      applyStatEffects(sessionCountRef.current);
      addFloating(['+5 Vitalidad 💚', '-3 Energía ⚡']);

      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

      try {
        const systemPrompt = buildSystemPrompt(pet, memories);
        const guardianText = await callOpenAI(systemPrompt, withUser, text);

        const guardianMsg: ChatMessage = {
          id: Date.now() + 1,
          role: 'guardian',
          text: guardianText,
          timestamp: new Date().toISOString(),
        };

        const final = [...withUser, guardianMsg].slice(-20);
        setMessages(final);
        saveMessages(final);

        extractMemory(text, memories.facts)
          .then((newFacts) => {
            if (newFacts.length !== memories.facts.length) {
              const updated: Memories = { facts: newFacts, lastUpdated: new Date().toISOString() };
              onMemoriesUpdate(updated);
              saveMemories(updated);
            }
          })
          .catch(() => {});
      } catch {
        const errMsg: ChatMessage = {
          id: Date.now() + 1,
          role: 'guardian',
          text: 'Uf... parece que el viento andino interrumpió nuestra conexión 🌬️',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg].slice(-20));
      } finally {
        setIsTyping(false);
      }
    },
    [messages, memories, isTyping, pet, applyStatEffects, onMemoriesUpdate]
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="glass-card overflow-hidden" style={{ borderRadius: '1.5rem' }}>
        <div
          className="flex items-center gap-2 px-4 pt-4 pb-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-base">{getChatEmoji(pet.animal)}</span>
          <span className="font-display font-semibold text-sm" style={{ color: '#7EBF8E' }}>
            {pet.name}
          </span>
          {isTyping && (
            <span className="font-body text-xs italic ml-1" style={{ color: 'rgba(126,191,142,0.5)' }}>
              escribiendo...
            </span>
          )}
        </div>

        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>

      {floatingTexts.map((item) => (
        <div
          key={item.id}
          className="animate-floatUp absolute"
          style={{
            right: item.text.includes('Energía') ? '24px' : '64px',
            top: '-8px',
            color: item.text.includes('Vitalidad') ? '#7EBF8E' : '#F2B705',
          }}
          onAnimationEnd={() => removeFloating(item.id)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

function getChatEmoji(animal: string): string {
  const map: Record<string, string> = {
    alpaca: '🦙', condor: '🦅', rana: '🐸', colibri: '🐦',
  };
  return map[animal] ?? '🌿';
}
