import { Leaf } from 'lucide-react';

interface NameInputProps {
  value: string;
  onChange: (v: string) => void;
  error: string;
}

export default function NameInput({ value, onChange, error }: NameInputProps) {
  const isValid = value.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/.test(value);
  const isInvalid = error.length > 0;

  const borderColor = isInvalid
    ? 'border-accent'
    : isValid
    ? 'border-hoja'
    : 'border-white/20';

  return (
    <div className="w-full max-w-sm">
      <label className="flex items-center gap-2 mb-2 font-body text-sm font-medium text-niebla/80">
        <Leaf size={14} className="text-hoja" />
        Nombre de tu Guardián
      </label>
      <div className="relative">
        <input
          type="text"
          maxLength={15}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: Luna, Roco..."
          className={`
            w-full px-4 py-3 rounded-xl font-body text-niebla placeholder-niebla/30
            bg-white/8 border-2 ${borderColor}
            focus:outline-none focus:border-hoja focus:bg-white/12
            transition-all duration-200
            backdrop-blur-sm
            pr-12
          `}
          style={{ background: 'rgba(245,239,230,0.06)' }}
        />
        <span
          className={`
            absolute right-3 bottom-3 text-xs font-body font-medium
            ${value.length >= 13 ? 'text-accent' : 'text-niebla/40'}
          `}
        >
          {value.length}/15
        </span>
      </div>
      {isInvalid && (
        <p className="mt-2 text-xs font-body text-accent animate-slide-down">
          {error}
        </p>
      )}
    </div>
  );
}
