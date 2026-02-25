import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploaderProps {
  uploadState: 'idle' | 'selected' | 'evaluating' | 'done';
  imagePreview: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEvaluate: () => void;
  onCancel: () => void;
  isEvaluating: boolean;
  selectedCategory: string | null;
}

export default function ImageUploader({
  uploadState,
  imagePreview,
  onFileSelect,
  onEvaluate,
  onCancel,
  isEvaluating,
  selectedCategory
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {uploadState === 'idle' && (
        <label className="upload-zone flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-white/20 hover:border-sol/50 hover:bg-white/5 cursor-pointer transition-all duration-200">
          <Upload size={32} className="text-niebla/40 mb-2" />
          <span className="dm-sans text-sm text-niebla/60">📸 Subir Captura</span>
          <span className="dm-sans text-xs text-niebla/30 mt-1">PNG, JPG · máx 5MB</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
      )}

      {uploadState === 'selected' && imagePreview && (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-sol/50" style={{ height: '300px' }}>
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-black/30" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <span className="dm-sans text-xs text-niebla">
                {selectedCategory || '📸'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onEvaluate}
              disabled={!selectedCategory || isEvaluating}
              className="flex-1 py-3 rounded-xl font-bold fraunces transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--sol)', color: 'var(--noche)' }}
            >
              {isEvaluating ? '🔄 Evaluando...' : '✅ Evaluar'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 rounded-xl bg-white/10 text-niebla/70 hover:bg-white/15 transition-all"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
