# 🌿 RegenWasi

**Mascota virtual andina con glassmorphism oscuro, economía $FRUTA y autenticación Privy.**

Un ecosistema digital interactivo donde adoptas un guardián de la naturaleza (alpaca, cóndor, rana, colibrí), lo crigas, converssas con IA, y ganas/gastas monedas virtuales.

## ✨ Características

### Sesión 1 — Terrario & Stats
- 🏠 Terrario glassmorphism con background dinámico
- 📊 Stats en tiempo real: Vitalidad, Energía, Nutrición
- 🎨 Paleta tierra/musgo/sol con fuentes `Fraunces` + `DM Sans`
- 🔄 Desgaste temporal (cada 15s -1 stat)

### Sesión 2 — Chat con IA
- 💬 ChatGPT respondiendo como el Guardián (personaje)
- 🧠 Sistema de memoria: recuerda datos del usuario
- ✨ Interacciones: +5 Vitalidad, -3 Energía por mensaje
- 🎭 Animaciones y partículas

### Sesión 3 — Login + Economía 
- 🔐 **Autenticación Privy** — Google/Email login
- 💰 **Sistema $FRUTA** — Economía completa
  - Gana monedas por conversaciones (50-200 cap, dificultad creciente)
  - Gasta 10 🍊 para alimentar (+20 nutrición)
  - Historial de transacciones
- 👤 **Persistencia por usuario** — Datos sincronizados en localStorage
- 🎨 **UI mejorada** — Floating coins, toasts, activity history

### Sesión 4 — Entrenamiento & Evolución
- 🖼️ **Entrenamiento visual:** sube una foto de la actividad/creación de tu guardián (o dibujito) para evaluar su desempeño.
- 🤖 **Evaluación con IA (opcional):** la imagen se envía a la función de evaluación que usa la API de OpenAI (si `VITE_OPENAI_API_KEY` está presente) para devolver una puntuación y feedback; si no hay API, se usa un fallback mock.
- ⭐ **Puntos y recompensas:** cada entrenamiento otorga `points` y `tokens` (monedas) según la puntuación; se guarda una `trainingHistory` con miniaturas (`thumbnail`) y resultados.
- 🌱 **Evolución por etapas:** el guardián sube de `Bebé → Joven → Adulto` según `totalPoints` y se reproducen animaciones de evolución y un modal de celebración.
- 📊 **Efectos de entrenamiento:** ciertas categorías mejoran stats (vitalidad/energía/nutrición) según reglas configurables en `utils/trainingConfig.ts`.
- 🖼️ **Galería y miniaturas:** se guardan thumbs comprimidos de cada envío para mostrar un historial visual en la pestaña de entrenamiento.
- 🧭 **Navegación:** nueva pestaña `Entrenar` integrada en la navegación de `HabitatScreen` (TabNav).
- 🎨 **Animaciones:** partículas, pop, spin y efectos orbit en la evolución para mantener la estética del Wasi.
- 🔑 **Persistencia y migración:** los datos de entrenamiento persisten en `localStorage` usando el prefijo `regenwasi_*` y migran desde el guest cuando el usuario inicia sesión.

### Sesión 5 — Conexión al HUB + Sistema Social Completo (FINAL)
- 🌐 **HUB Central Público:** conexión a `https://regenmon-final.vercel.app` — todos los Guardianes viven en un mundo social compartido.
- 📱 **Registro automático:** formulario intelligente que detecta datos del pet y crea perfil público automáticamente con sprite emoji.
- 🏆 **Leaderboard Global:** ranking mundial filtrable por etapa (Bebé/Joven/Adulto), con paginación y posición personal.
- 👤 **Perfil Público:** cada Guardián tiene URL `https://app.com/regenmon/[id]` visible para visitantes, mostrando stats, etapa, fecha de registro.
- 🍎 **Interacciones Sociales:** alimentar (-10 🍊), enviar regalos (5/10/25 🍊), dejar mensajes privados (140 caracteres máx).
- 💬 **Feed de Mensajes:** sección de chat con timestampps relativo ("hace 5 min"), sin logueo necesario para leer.
- 🎁 **Celebraciones:** confetti emoji volador al recibir regalo/alimentación, animaciones smooth.
- 📊 **Actividad Reciente:** notificaciones en dashboard de interacciones recibidas (feed, gift, message) con timestamps.
- 🔄 **Sincronización Automática:** cada 5 minutos se synca pet data (stats, puntos, training history) al HUB silenciosamente.
- 🔑 **Persistencia Multi-Usuario:** localStorage con `regenwasi_hub_id` e `regenwasi_hub_registered`, migración automática `regenhuasi_*` → `regenwasi_*` al cargar.
- 🌍 **Responsive Full:** mobile-first layout (<640px, 640–1024px, desktop), tabs en navegación central (Wasi, Chat, Entrenar, Social).

---

## 🚀 Quick Start

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno (Opcional)
Copiar `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Luego editar `.env.local` para agregar tu API key de OpenAI:
```
VITE_OPENAI_API_KEY=sk-proj-tu-api-key-aqui
```

Si NO configuras OpenAI, la app usa respuestas offline (mockups).

### 3. Ejecutar Desarrollo
```bash
npm run dev
```

Acceder: **http://localhost:5173/**

### 4. Build Producción
```bash
npm run build
npm run preview
```

---

## 🎮 Cómo Jugar

### Adoptar un Guardián
1. Abre la app → LoginScreen
2. Elige **Explorar sin login** para jugar como invitado
3. O **Iniciar Sesión** con Google/Email para persistencia
4. Selecciona nombre + animal (alpaca 🦙, cóndor 🦅, rana 🐸, colibrí 🐦)
5. Presiona "Despertar Wasi"

### Interactuar
- **Abrazar** → +15 Vitalidad
- **Explorar** → +15 Energía
- **Nutrir** → Gasta 10 🍊, +20 Nutrición (si tienes monedas)

### Conversar
- Escribe mensajes en el chat
- El Guardián responde como personaje único
- **Ganas 🍊** (probabilidad según saldo)
- Stats se afectan: +5 Vitalidad, -3 Energía

### Historial
- Botón "📜 Historial de Actividad" muestra las últ. 10 transacciones

---

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── AdoptionScreen/
│   │   ├── index.tsx (adopt flow)
│   │   ├── LoginScreen.tsx (Privy auth)
│   │   ├── AnimalSelector.tsx
│   │   ├── NameInput.tsx
│   │   └── ParticleBackground.tsx
│   ├── HabitatScreen/
│   │   ├── index.tsx (main gameplay + 4 tabs: Wasi, Chat, Entrenar, Social)
│   │   ├── Header.tsx (user info + frutas)
│   │   ├── Terrarium.tsx
│   │   ├── StatsPanel.tsx
│   │   ├── ActionButtons.tsx
│   │   ├── ChatSection.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   ├── InteractionParticles.tsx
│   │   ├── ResetModal.tsx
│   │   ├── TabNav.tsx (navegación 4 tabs + Social)
│   │   ├── SocialHub.tsx (registro + dashboard social)
│   │   └── TrainingScreen/ (Sesión 4)
│   │       ├── index.tsx
│   │       ├── CategorySelector.tsx
│   │       ├── ImageUploader.tsx
│   │       └── ...otros componentes
│   └── pages/ (nuevas rutas Sesión 5)
│       ├── LeaderboardPage.tsx (​/leaderboard)
│       └── PublicProfilePage.tsx (/regenmon/[id])
├── hooks/
│   ├── usePrivyAuth.tsx (auth wrapper)
│   ├── usePersistence.ts (storage layer)
│   ├── useHub.ts (NUEVO: consumo APIs HUB)
│   ├── useHubAuth.ts (NUEVO: persistencia HUB)
│   └── useHubSync.ts (NUEVO: sincronización periódica)
├── utils/
│   ├── storage.ts (localStorage per-user, registriert)
│   ├── chat.ts (persistence de mensajes)
│   ├── api.ts (OpenAI integration)
│   ├── animalConfig.ts (pet data)
│   ├── training.ts (Sesión 4)
│   └── trainingConfig.ts (Sesión 4)
├── pages/
│   ├── LeaderboardPage.tsx
│   └── PublicProfilePage.tsx
├── types.ts (tipos unificados)
├── App.tsx (Router + auth + migración de claves)
├── main.tsx (PrivyProvider + Router setup)
└── index.css (glassmorphism + animations + confetti)
```

---

## 🔐 Autenticación (Privy)

**App ID:** `cmkyyrsbj04bck40bidlscndo`

**Flujo:**
1. Usuario abre app → ve LoginScreen si no autenticado
2. Presiona "🌿 Iniciar Sesión" → Privy modal (Google/Email)
3. Tras login:
  - Si existe `regenwasi_guest_data` → **migra a** `regenwasi_${userId}_data`
  - Carga datos del usuario desde localStorage
4. Presiona logout → vuelve a LoginScreen

**Modo Guest:** Juega sin login en `__guest__` (datos NO persisten tras cerrar navegador)

---

## 💰 Economía $FRUTA

### Ganancia por Chat
- **Balance 0 🍊:** 80% prob, +3-5 monedas
- **0-40:** 70% prob, +2-5
- **40-70:** 50% prob, +2-4
- **70-90:** 25% prob, +1-3
- **≥90:** 10% prob, +1-2
- **Cap total:** 200 monedas máximo ganables

### Gasto
- **Alimentar:** -10 🍊 → +20 Nutrición

### Persistencia
```typescript
{
  frutas: 100,
  totalFrutasEarned: 100,
  totalFrutasSpent: 0,
  lastCoinEarnedAt: "2025-01-15T14:22:00Z",
  activityLog: [ /* últimas 10 acciones */ ]
}
```

---

## 🎨 Diseño Visual

### Paleta
- `--tierra`: #6B4226
- `--musgo`: #4A7C59
- `--hoja`: #7EBF8E
- `--sol`: #F2B705
- `--niebla`: #F5EFE6
- `--noche`: #1A2E1F
- `--accent`: #E8472A

### Tipografía
- **Display:** Fraunces (títulos)
- **Body:** DM Sans (texto)

### Efectos
- Glassmorphism: blur(12px) + border semi-transparente
- Animaciones: breathe, bounce, shake, float, slide
- Partículas dinámicas en interacciones

---

## 📊 Stack Tecnológico

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS** — Styles
- **Privy** — Authentication
- **OpenAI API** — Chat IA (opcional)
- **Lucide React** — Icons

---

## 🧪 Testing

Verificar tipos:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

---

## 📝 Licencia

MIT

---

**Creado con 🌿 para el Wasi andino-amazónico digital.**
