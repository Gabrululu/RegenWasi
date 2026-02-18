import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface WakeButtonProps {
  disabled: boolean;
  disabledReason: string;
  onClick: () => void;
}

export default function WakeButton({ disabled, disabledReason, onClick }: WakeButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pressed, setPressed] = useState(false);

  function handleClick() {
    if (disabled) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    onClick();
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        className="relative px-10 py-4 rounded-full font-display font-bold text-lg transition-all duration-150"
        style={{
          background: disabled ? 'rgba(242,183,5,0.3)' : '#F2B705',
          color: disabled ? 'rgba(26,46,31,0.4)' : '#1A2E1F',
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          boxShadow: disabled
            ? 'none'
            : '0 4px 24px rgba(242,183,5,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)',
        }}
      >
        <span className="flex items-center gap-2">
          <Sprout size={20} />
          Despertar mi wasi
        </span>
      </button>

      {showTooltip && disabled && disabledReason && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-slide-down z-10">
          <div className="glass-card px-3 py-1.5 text-xs font-body text-niebla/80 whitespace-nowrap">
            {disabledReason}
          </div>
        </div>
      )}
    </div>
  );
}
