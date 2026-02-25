export const TRAINING_CATEGORIES = [
  {
    id: 'codigo',
    emoji: '💻',
    label: 'Código',
    sublabel: 'Tu mejor código',
    color: '#4A7C59',
    colorLight: 'rgba(74,124,89,0.15)'
  },
  {
    id: 'diseno',
    emoji: '🎨',
    label: 'Diseño',
    sublabel: 'UI/UX o gráfico',
    color: '#A8D8EA',
    colorLight: 'rgba(168,216,234,0.15)'
  },
  {
    id: 'proyecto',
    emoji: '🚀',
    label: 'Proyecto',
    sublabel: 'Proyecto completo',
    color: '#F2B705',
    colorLight: 'rgba(242,183,5,0.15)'
  },
  {
    id: 'aprendizaje',
    emoji: '📚',
    label: 'Aprendizaje',
    sublabel: 'Notas o ejercicios',
    color: '#C4855A',
    colorLight: 'rgba(196,133,90,0.15)'
  }
];

export const EVOLUTION_STAGES = {
  1: { label: 'Bebé', emoji: '🥚', minPoints: 0, nextAt: 500 },
  2: { label: 'Joven', emoji: '🐣', minPoints: 500, nextAt: 1500 },
  3: { label: 'Adulto', emoji: '🐉', minPoints: 1500, nextAt: Infinity }
};

export const getStageFromPoints = (points: number) => {
  if (points >= 1500) return 3;
  if (points >= 500) return 2;
  return 1;
};

export const getScoreTier = (score: number) => {
  if (score >= 80) return { emoji: '🏆', label: 'Excelente', bg: 'rgba(242,183,5,0.15)', border: '#F2B705' };
  if (score >= 60) return { emoji: '⭐', label: 'Bueno', bg: 'rgba(168,216,234,0.15)', border: '#A8D8EA' };
  if (score >= 40) return { emoji: '👍', label: 'Regular', bg: 'rgba(196,133,90,0.15)', border: '#C4855A' };
  return { emoji: '💪', label: 'Sigue intentando', bg: 'rgba(232,71,42,0.15)', border: '#E8472A' };
};

export const getStatEffects = (score: number) => {
  if (score >= 80) return { vitalidad: 15, energia: -20, nutricion: 15 };
  if (score >= 60) return { vitalidad: 8, energia: -15, nutricion: 12 };
  if (score >= 40) return { vitalidad: 3, energia: -12, nutricion: 10 };
  return { vitalidad: -10, energia: -15, nutricion: 10 };
};
