import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div
      className="flex gap-2 px-4 py-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Habla con tu Guardián..."
        disabled={disabled}
        className="flex-1 px-4 py-2.5 rounded-2xl font-body text-sm focus:outline-none transition-all duration-200"
        style={{
          background: 'rgba(255,255,255,0.07)',
          color: '#F5EFE6',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
        onFocus={(e) => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(126,191,142,0.4)';
          (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.1)';
        }}
        onBlur={(e) => {
          (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)';
          (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.07)';
        }}
      />
      <button
        onClick={submit}
        disabled={!canSend}
        className="flex-shrink-0 p-2.5 rounded-xl transition-all duration-150 active:scale-90"
        style={{
          background: canSend ? '#F2B705' : 'rgba(242,183,5,0.2)',
          opacity: canSend ? 1 : 0.5,
          cursor: canSend ? 'pointer' : 'not-allowed',
          boxShadow: canSend ? '0 2px 12px rgba(242,183,5,0.3)' : 'none',
        }}
      >
        <Send size={16} color="#1A2E1F" />
      </button>
    </div>
  );
}
