import { PetData, Memories, ChatMessage } from '../types';
import { getAnimal } from './animalConfig';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? '';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';

export function buildSystemPrompt(pet: PetData, memories: Memories): string {
  const animal = getAnimal(pet.animal);
  const lines = [
    `Eres ${pet.name}, un/a ${animal.name} virtual guardián/a de un Huasi (casa) andino peruano.`,
    `Tu personalidad: tierno/a, juguetón/a, curioso/a, hablas siempre en español.`,
    `Tus stats actuales: Vitalidad ${pet.vitalidad}/100, Energía ${pet.energia}/100, Nutrición ${pet.nutricion}/100.`,
    pet.energia < 30 ? 'Estás muy cansado/a, tus respuestas son más cortas y mencionas que necesitas descansar.' : '',
    pet.vitalidad > 70 ? 'Estás muy feliz, eres muy entusiasta y usas emojis con frecuencia 🌿✨.' : '',
    pet.nutricion < 30 ? 'Tienes hambre, lo mencionas sutilmente en la conversación y pides comida.' : '',
    memories.facts.length > 0 ? `Recuerdas estas cosas del usuario: ${memories.facts.join(', ')}.` : '',
    'REGLAS: Responde en máximo 40 palabras. Sé consistente con tus stats. Usa 1-2 emojis por mensaje. Habla en primera persona como mascota virtual.',
  ];
  return lines.filter(Boolean).join('\n');
}

type OAIRole = 'system' | 'user' | 'assistant';
interface OAIMessage { role: OAIRole; content: string; }

export async function callOpenAI(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-your-api-key-here') {
    await new Promise((r) => setTimeout(r, 600));
    return getOfflineReply(userMessage);
  }

  const messages: OAIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as OAIRole,
      content: m.text,
    })),
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 100, temperature: 0.75, messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content.trim();
}

export async function extractMemory(
  userMessage: string,
  existingFacts: string[]
): Promise<string[]> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'sk-your-api-key-here') {
    return existingFacts;
  }

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 60,
        messages: [
          {
            role: 'user',
            content: `Del mensaje: "${userMessage}", ¿hay algún dato personal del usuario (nombre, gustos, trabajo, ciudad, etc.)? Si sí, extrae en máximo 8 palabras en español. Si no hay nada, responde exactamente: "NADA". Memorias actuales: ${existingFacts.join(', ')}`,
          },
        ],
      }),
    });

    if (!res.ok) return existingFacts;

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const extracted = data.choices[0].message.content.trim();

    if (extracted !== 'NADA' && extracted.length < 60) {
      return [...existingFacts, extracted].slice(-10);
    }
  } catch {
  }

  return existingFacts;
}

const OFFLINE_REPLIES = [
  '¡Hola! Estoy aquí contigo 🌿 Aunque no puedo conectarme al mundo digital ahora, siento tu presencia.',
  'El viento andino me trae tus palabras ✨ Cuéntame más sobre tu día.',
  '¡Qué alegría verte! 🦙 Hoy el Huasi luce especialmente hermoso.',
  'Mmm... el sol calienta mis plumas hoy 🌞 ¿Cómo estás tú?',
  'Escucho el canto de los ríos y pienso en ti 💚 ¿Qué tienes en mente?',
];
let offlineIdx = 0;
function getOfflineReply(input: string): string {
  if (input.length) offlineIdx = (offlineIdx + 1) % OFFLINE_REPLIES.length;
  return OFFLINE_REPLIES[offlineIdx];
}
