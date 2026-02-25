import { useState, useCallback, useRef } from 'react';
import { PetData, TrainingEntry } from '../../types';
import { evaluateWithAI, compressImageToThumb } from '../../utils/training';
import { getStageFromPoints, TRAINING_CATEGORIES } from '../../utils/trainingConfig';
import { getAnimal } from '../../utils/animalConfig';
import CategorySelector from './CategorySelector';
import ImageUploader from './ImageUploader';
import RegenmonEvolutionDisplay from './RegenmonEvolutionDisplay';
import EvaluationResult from './EvaluationResult';
import EvolutionModal from './EvolutionModal';
import TrainingStats from './TrainingStats';
import TrainingGallery from './TrainingGallery';

interface TrainingScreenProps {
  pet: PetData;
  onPetUpdate: (updater: (prev: PetData) => PetData) => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
  onTriggerFloatingCoin: (amount: number, emoji: string) => void;
  onAddActivityLog: (entry: { type: 'training' | 'feed' | 'chat_earn'; coins: number; label: string }) => void;
}

export default function TrainingScreen({
  pet,
  onPetUpdate,
  onShowToast,
  onTriggerFloatingCoin,
  onAddActivityLog
}: TrainingScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'selected' | 'evaluating' | 'done'>('idle');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPoints = pet.totalPoints ?? 0;
  const stage = pet.stage ?? 1;
  const trainingHistory = pet.trainingHistory ?? [];
  const totalTrainings = pet.totalTrainings ?? 0;
  const averageScore = pet.averageScore ?? 0;
  const streakDays = pet.streakDays ?? 0;
  const lastTrainingDate = pet.lastTrainingDate;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('❌ Imagen demasiado grande. Máximo 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
      setUploadState('selected');
    };
    reader.readAsDataURL(file);
  }, [onShowToast]);

  const handleCancel = useCallback(() => {
    setSelectedCategory(null);
    setImagePreview(null);
    setImageBase64(null);
    setUploadState('idle');
    setEvaluationResult(null);
    setIsEvaluating(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastDate = lastTrainingDate ? new Date(lastTrainingDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreakDays = streakDays;
    if (lastDate !== today) {
      if (lastDate === yesterday) {
        newStreakDays = streakDays + 1;
      } else {
        newStreakDays = 1;
      }
    }

    return { newStreakDays, newLastDate: new Date().toISOString() };
  }, [streakDays, lastTrainingDate]);

  const handleEvaluate = useCallback(async () => {
    if (!selectedCategory || !imageBase64 || isEvaluating) return;

    setIsEvaluating(true);
    setUploadState('evaluating');
    onShowToast('⏳ Evaluando tu trabajo...', 'info');

    try {
      const result = await evaluateWithAI(imageBase64, selectedCategory);

      // Aplicar efectos en stats
      onPetUpdate(prev => {
        const effects = {
          vitalidad: result.score >= 80 ? 15 : result.score >= 60 ? 8 : result.score >= 40 ? 3 : -10,
          energia: result.score >= 80 ? -20 : result.score >= 60 ? -15 : result.score >= 40 ? -12 : -15,
          nutricion: result.score >= 80 ? 15 : result.score >= 60 ? 12 : result.score >= 40 ? 10 : 10
        };
        return {
          ...prev,
          vitalidad: Math.max(0, Math.min(100, prev.vitalidad + effects.vitalidad)),
          energia: Math.max(0, Math.min(100, prev.energia + effects.energia)),
          nutricion: Math.max(0, Math.min(100, prev.nutricion + effects.nutricion))
        };
      });

      const newTotalPoints = totalPoints + result.pointsEarned;
      const newStage = getStageFromPoints(newTotalPoints);
      const stageChanged = newStage > stage;

      // Actualizar puntos y monedas
      onPetUpdate(prev => {
        const streak = updateStreak();
        const newTotal = totalTrainings + 1;
        const newAverage = Math.round(((averageScore * totalTrainings) + result.score) / newTotal);

        let newFrutas = (prev.frutas ?? 0) + result.tokensEarned;
        if (stageChanged) newFrutas += 100; // bonus de evolución

        // Crear entrada de historial
        const catObj = TRAINING_CATEGORIES.find(c => c.id === selectedCategory);
        const historyEntry: TrainingEntry = {
          id: Date.now(),
          score: result.score,
          category: selectedCategory as any,
          categoryLabel: catObj?.label ?? selectedCategory,
          feedback: result.feedback,
          pointsEarned: result.pointsEarned,
          tokensEarned: result.tokensEarned,
          timestamp: new Date().toISOString(),
          imageThumb: undefined // se llena después
        };

        return {
          ...prev,
          frutas: newFrutas,
          totalFrutasEarned: (prev.totalFrutasEarned ?? 0) + result.tokensEarned + (stageChanged ? 100 : 0),
          totalPoints: newTotalPoints,
          stage: newStage,
          totalTrainings: newTotal,
          averageScore: newAverage,
          streakDays: streak.newStreakDays,
          lastTrainingDate: streak.newLastDate,
          trainingHistory: [historyEntry, ...(prev.trainingHistory ?? [])].slice(0, 20)
        };
      });

      // Comprimir y guardar thumbnail
      const thumb = await compressImageToThumb(imagePreview!);
      onPetUpdate(prev => {
        const updated = { ...prev };
        const history = updated.trainingHistory ?? [];
        if (history.length > 0) {
          history[0] = { ...history[0], imageThumb: thumb };
        }
        updated.trainingHistory = history;
        return updated;
      });

      // Registro de actividad
      onAddActivityLog({
        type: 'training',
        coins: result.tokensEarned,
        label: `Entrenamiento ${TRAINING_CATEGORIES.find(c => c.id === selectedCategory)?.label} (${result.score}/100)`
      });

      // Mostrar resultado
      setEvaluationResult(result);
      setUploadState('done');

      // Animación de monedas
      onTriggerFloatingCoin(result.tokensEarned, '🍊');

      onShowToast('✅ ¡Evaluación completada!', 'success');

      // Mostrar modal de evolución si aplica
      if (stageChanged) {
        setTimeout(() => setShowEvolutionModal(true), 800);
      }

    } catch (error) {
      console.error('Evaluation error:', error);
      onShowToast('❌ Error al evaluar. Intenta de nuevo.', 'error');
      setUploadState('selected');
    } finally {
      setIsEvaluating(false);
    }
  }, [selectedCategory, imageBase64, isEvaluating, onPetUpdate, totalPoints, stage, totalTrainings, averageScore, streakDays, lastTrainingDate, updateStreak, onShowToast, onTriggerFloatingCoin, onAddActivityLog, imagePreview]);

  const handleRetrain = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  return (
    <div className="training-screen space-y-4">
      {/* Evolution Display */}
      <RegenmonEvolutionDisplay
        petName={pet.name}
        animal={pet.animal}
        stage={stage}
        totalPoints={totalPoints}
      />

      {/* Stats */}
      <TrainingStats
        totalTrainings={totalTrainings}
        averageScore={averageScore}
        streakDays={streakDays}
      />

      {/* Category Selector */}
      {uploadState !== 'done' && <CategorySelector selectedCategory={selectedCategory} onSelect={setSelectedCategory} />}

      {/* Image Uploader */}
      {uploadState !== 'done' && (
        <ImageUploader
          uploadState={uploadState}
          imagePreview={imagePreview}
          onFileSelect={handleFileSelect}
          onEvaluate={handleEvaluate}
          onCancel={handleCancel}
          isEvaluating={isEvaluating}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Evaluation Loading State */}
      {isEvaluating && (
        <div className="evaluation-loading flex flex-col items-center py-12 space-y-4">
          <div className="relative">
            <span className="text-6xl animate-bounce">{getAnimal(pet.animal).emoji}</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sol animate-ping" />
          </div>
          <div className="w-full max-w-xs">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-musgo to-sol animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
          <p className="dm-sans text-sm text-niebla/70 text-center">🔍 Analizando tu trabajo...</p>
        </div>
      )}

      {/* Evaluation Result */}
      {evaluationResult && uploadState === 'done' && (
        <EvaluationResult
          result={evaluationResult}
          totalPoints={totalPoints}
          stage={stage}
          onRetrain={handleRetrain}
        />
      )}

      {/* Training Gallery */}
      <TrainingGallery history={trainingHistory} />

      {/* Evolution Modal */}
      {showEvolutionModal && (
        <EvolutionModal stage={stage} petName={pet.name} onClose={() => setShowEvolutionModal(false)} />
      )}
    </div>
  );
}
