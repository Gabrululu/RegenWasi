import { TRAINING_CATEGORIES } from '../../utils/trainingConfig';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string) => void;
}

export default function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {TRAINING_CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="relative p-4 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-105 active:scale-95"
          style={{
            background: selectedCategory === cat.id ? cat.colorLight : 'rgba(255,255,255,0.04)',
            borderColor: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.1)',
            boxShadow: selectedCategory === cat.id
              ? `0 0 20px ${cat.color}30, inset 0 1px 0 rgba(255,255,255,0.1)`
              : 'none'
          }}
        >
          <span className="text-3xl block mb-1">{cat.emoji}</span>
          <span className="fraunces text-sm font-bold text-niebla block">{cat.label}</span>
          <span className="dm-sans text-xs text-niebla/50">{cat.sublabel}</span>
          {selectedCategory === cat.id && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: cat.color }} />
          )}
        </button>
      ))}
    </div>
  );
}
