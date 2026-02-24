import { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      className="flex flex-col gap-3 overflow-y-auto px-4 py-4"
      style={{ maxHeight: 'clamp(200px, 40vh, 288px)' }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center py-6">
          <p className="font-body text-xs italic" style={{ color: 'rgba(245,239,230,0.3)' }}>
            Tu guardián espera para conversar...
          </p>
        </div>
      )}

      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        const isLast = idx === messages.length - 1 && msg.role === 'guardian';

        return (
          <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed ${isLast ? 'animate-messageIn' : ''}`}
                style={{
                  maxWidth: 'clamp(120px, 75vw, 300px)',
                  wordWrap: 'break-word',
                  background: isUser ? '#F2B705' : 'rgba(255,255,255,0.1)',
                  color: isUser ? '#1A2E1F' : '#F5EFE6',
                  border: isUser ? 'none' : '1px solid rgba(126,191,142,0.3)',
                  boxShadow: isUser
                    ? '0 2px 12px rgba(242,183,5,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.15)',
                }}
              >
                {msg.text}
              </div>
              <span
                className="font-body text-xs px-1"
                style={{ color: 'rgba(245,239,230,0.3)' }}
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex justify-start">
          <div
            className="rounded-2xl px-4 py-3 flex gap-1.5 items-center animate-messageIn"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(126,191,142,0.3)',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: '#7EBF8E', animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
