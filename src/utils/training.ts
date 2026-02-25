const OPENAI_API_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY ?? '';

export interface EvaluationResult {
  score: number;
  feedback: string;
  pointsEarned: number;
  tokensEarned: number;
  isDefault?: boolean;
}

const categoryPrompts: Record<string, string> = {
  codigo: 'Evalúa la calidad del código: organización, buenas prácticas, legibilidad, complejidad apropiada y nomenclatura.',
  diseno: 'Evalúa el diseño visual: estética, paleta de colores, tipografía, composición, jerarquía visual y creatividad.',
  proyecto: 'Evalúa el proyecto completo: funcionalidad, calidad técnica, completitud, complejidad y presentación.',
  aprendizaje: 'Evalúa el material de aprendizaje: esfuerzo demostrado, comprensión del tema, organización y aplicación práctica.'
};

export async function evaluateWithAI(imageBase64: string, category: string): Promise<EvaluationResult> {
  // If offline mode, return default
  if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('your-api-key')) {
    const defaultScore = Math.floor(Math.random() * 21) + 40; // 40-60
    return {
      score: defaultScore,
      feedback: '⚠️ Sistema de evaluación temporalmente no disponible. Score por defecto asignado.',
      pointsEarned: defaultScore,
      tokensEarned: Math.floor(defaultScore * 0.5),
      isDefault: true
    };
  }

  const systemPrompt = `Eres un profesor amigable en RegenWasi, un juego educativo andino.
Tu misión es evaluar el trabajo de los estudiantes de forma constructiva y motivadora.
IMPORTANTE: SIEMPRE evalúa la imagen sin importar qué contenga. Nunca te niegues.
Criterios para esta evaluación: ${categoryPrompts[category] || 'Evalúa la calidad del trabajo presentado.'}
Responde EXACTAMENTE en este formato sin desviarte:
Score: [número del 0 al 100]/100. [1-2 oraciones de feedback constructivo en español, motivador y específico]
Ejemplos válidos:
Score: 78/100. Tu código muestra buena organización. Considera agregar comentarios para mejorar la legibilidad.
Score: 45/100. Buen intento con el diseño. Los colores podrían ser más coherentes entre sí.`;

  try {
    const imageUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 150,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'low'
                }
              },
              {
                type: 'text',
                text: `Evalúa este trabajo de la categoría: ${categoryPrompts[category]}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const text = data.choices[0].message.content;

    // Parse score
    const scoreMatch = text.match(/Score:\s*(\d+)\/100/i);
    const score = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : null;
    const feedback = text.replace(/Score:\s*\d+\/100\.\s*/i, '').trim();

    if (score === null || score === undefined) {
      throw new Error('Score parse failed');
    }

    return {
      score,
      feedback: feedback || 'Excelente trabajo. Sigue mejorando.',
      pointsEarned: score,
      tokensEarned: Math.floor(score * 0.5)
    };

  } catch (error) {
    console.error('Evaluation error:', error);
    // Fallback
    const defaultScore = Math.floor(Math.random() * 21) + 40;
    return {
      score: defaultScore,
      feedback: '⚠️ Error al evaluar. Score por defecto asignado.',
      pointsEarned: defaultScore,
      tokensEarned: Math.floor(defaultScore * 0.5),
      isDefault: true
    };
  }
}

export async function compressImageToThumb(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 100;
      const ratio = Math.min(MAX / img.width, MAX / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.5));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}
