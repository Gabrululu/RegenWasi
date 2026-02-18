interface ResetModalProps {
  petName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetModal({ petName, onConfirm, onCancel }: ResetModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="glass-card p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center animate-modal-enter"
        style={{ borderRadius: '1.75rem' }}
      >
        <span className="text-5xl">😢</span>

        <div className="space-y-2">
          <h2 className="font-display font-bold text-niebla text-xl">
            ¿Liberar a tu Guardián?
          </h2>
          <p className="font-body text-sm text-niebla/60 italic">
            Tu {petName} volverá al bosque ancestral para siempre.
          </p>
        </div>

        <div className="nazca-divider w-24" />

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-2xl font-body font-medium text-sm transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(245,239,230,0.7)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-2xl font-display font-bold text-sm transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: '#E8472A',
              color: '#F5EFE6',
              boxShadow: '0 4px 16px rgba(232,71,42,0.4)',
            }}
          >
            Liberar
          </button>
        </div>
      </div>
    </div>
  );
}
