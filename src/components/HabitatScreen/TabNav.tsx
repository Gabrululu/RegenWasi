interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabNavProps {
  tabs?: Tab[];
  active?: string;
  onChange?: (tabId: string) => void;
}

const DEFAULT_TABS: Tab[] = [
  { id: 'wasi', label: '🏠 Wasi' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'training', label: '🎓 Entrenar' },
];

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
  const list = tabs ?? DEFAULT_TABS;
  return (
    <div className="flex gap-2 mb-4 border-b border-white/10 overflow-x-auto">
      {list.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange?.(tab.id)}
          className={`px-4 py-3 dm-sans text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
            active === tab.id
              ? 'text-niebla border-b-sol'
              : 'text-niebla/60 border-b-transparent hover:text-niebla/80'
          }`}
        >
          {tab.icon ?? ''} {tab.label}
        </button>
      ))}
    </div>
  );
}
