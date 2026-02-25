import { TrainingEntry } from '../../types';
import { useState } from 'react';

interface TrainingGalleryProps {
  history: TrainingEntry[];
}

export default function TrainingGallery({ history }: TrainingGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <div className="gallery-section mt-6">
      <button
        onClick={() => setGalleryOpen(!galleryOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 dm-sans text-sm text-niebla/70 hover:bg-white/8 transition-all"
      >
        <span>🖼️ Galería de Entrenamientos ({history.length})</span>
        <span
          className={`transition-transform duration-200 ${
            galleryOpen ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          galleryOpen ? 'max-h-[600px] mt-3' : 'max-h-0'
        }`}
      >
        {history.length === 0 ? (
          <p className="text-center text-niebla/40 dm-sans text-xs py-6">
            Sin entrenamientos aún...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {history.map(entry => (
              <div
                key={entry.id}
                className="rounded-2xl overflow-hidden bg-white/5 border border-white/10"
              >
                {entry.imageThumb && (
                  <div className="h-24 overflow-hidden">
                    <img
                      src={entry.imageThumb}
                      alt="Training"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="dm-sans text-xs text-niebla/60">
                      {entry.categoryLabel}
                    </span>
                    <span
                      className={`fraunces text-sm font-bold ${
                        entry.score >= 80
                          ? 'text-sol'
                          : entry.score >= 60
                          ? 'text-cielo'
                          : entry.score >= 40
                          ? 'text-arcilla'
                          : 'text-accent'
                      }`}
                    >
                      {entry.score}/100
                    </span>
                  </div>
                  <div className="dm-sans text-xs text-niebla/40">
                    {new Date(entry.timestamp).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
