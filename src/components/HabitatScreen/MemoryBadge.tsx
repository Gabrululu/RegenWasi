import { useState, useRef, useEffect } from 'react';
import { X, Brain } from 'lucide-react';
import { Memories } from '../../types';

interface MemoryBadgeProps {
  memories: Memories;
  onUpdate: (m: Memories) => void;
}

export default function MemoryBadge({ memories, onUpdate }: MemoryBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (memories.facts.length === 0) return null;

  function removeFact(idx: number) {
    const updated: Memories = {
      facts: memories.facts.filter((_, i) => i !== idx),
      lastUpdated: new Date().toISOString(),
    };
    onUpdate(updated);
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs font-medium transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          background: 'rgba(126,191,142,0.15)',
          border: '1px solid rgba(126,191,142,0.3)',
          color: '#7EBF8E',
        }}
        title={memories.facts.join(' | ')}
      >
        <Brain size={12} />
        {memories.facts.length}
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 glass-card p-3 z-50 animate-slide-down"
          style={{ minWidth: '200px', maxWidth: '280px', borderRadius: '1rem' }}
        >
          <p
            className="font-display font-semibold text-xs uppercase tracking-wide mb-2"
            style={{ color: 'rgba(126,191,142,0.7)' }}
          >
            🧠 Memorias del Guardián
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {memories.facts.map((fact, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <span className="font-body text-xs leading-relaxed flex-1" style={{ color: 'rgba(245,239,230,0.75)' }}>
                  {fact}
                </span>
                <button
                  onClick={() => removeFact(idx)}
                  className="flex-shrink-0 hover:opacity-100 opacity-40 transition-opacity mt-0.5"
                >
                  <X size={11} color="#E8472A" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
