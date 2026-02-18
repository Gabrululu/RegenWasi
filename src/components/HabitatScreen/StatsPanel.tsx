import { Heart, Zap, Apple } from 'lucide-react';
import { PetData } from '../../types';

interface StatConfig {
  key: keyof Pick<PetData, 'vitalidad' | 'energia' | 'nutricion'>;
  label: string;
  icon: React.ElementType;
  highColor: string;
  fillBase: string;
}

const STATS: StatConfig[] = [
  { key: 'vitalidad', label: 'Vitalidad', icon: Heart, highColor: '#7EBF8E', fillBase: '#7EBF8E' },
  { key: 'energia', label: 'Energía', icon: Zap, highColor: '#F2B705', fillBase: '#F2B705' },
  { key: 'nutricion', label: 'Nutrición', icon: Apple, highColor: '#E8472A', fillBase: '#E8472A' },
];

function getBarColor(value: number): string {
  if (value > 50) return '#7EBF8E';
  if (value > 25) return '#F2B705';
  return '#E8472A';
}

interface StatsPanelProps {
  pet: PetData;
}

export default function StatsPanel({ pet }: StatsPanelProps) {
  return (
    <div className="glass-card p-4 sm:p-5 space-y-4">
      {STATS.map(({ key, label, icon: Icon }) => {
        const value = pet[key];
        const barColor = getBarColor(value);
        const isLow = value <= 25;

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Icon size={14} style={{ color: barColor }} />
                <span className="font-body text-sm font-medium text-niebla/80">
                  {label}
                </span>
              </div>
              <span
                className="font-display text-sm font-semibold"
                style={{ color: barColor }}
              >
                {value}/100
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className={`h-full rounded-full stat-fill ${isLow ? 'animate-pulse' : ''}`}
                style={{
                  width: `${value}%`,
                  background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                  boxShadow: `0 0 8px ${barColor}66`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
