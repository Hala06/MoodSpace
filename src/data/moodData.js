const moodOptions = [
  {
    id: 'radiant',
    emoji: '🌈',
    label: 'Radiant',
    tone: 'glowing with gratitude',
    spectrum: 'positive',
    score: 5,
    color: '#facc15',
  },
  {
    id: 'hopeful',
    emoji: '🌤️',
    label: 'Hopeful',
    tone: 'quietly optimistic',
    spectrum: 'positive',
    score: 4,
    color: '#34d399',
  },
  {
    id: 'steady',
    emoji: '🌱',
    label: 'Steady',
    tone: 'grounded and present',
    spectrum: 'neutral',
    score: 3,
    color: '#38bdf8',
  },
  {
    id: 'tender',
    emoji: '🌧️',
    label: 'Tender',
    tone: 'soft around the edges',
    spectrum: 'soft',
    score: 2,
    color: '#f472b6',
  },
  {
    id: 'stormy',
    emoji: '⛈️',
    label: 'Stormy',
    tone: 'navigating big feelings',
    spectrum: 'intense',
    score: 1,
    color: '#6366f1',
  },
  {
    id: 'numb',
    emoji: '🌫️',
    label: 'Numb',
    tone: 'needing gentle care',
    spectrum: 'intense',
    score: 1,
    color: '#94a3b8',
  },
]

const promptLibrary = {
  radiant: [
    'What went right today that you want to remember on tougher days?',
    'Who or what helped you feel supported? How can you thank them (or yourself)?',
    'Capture a sensory memory from today that you want to savour later.',
  ],
  hopeful: [
    'What small step are you proud of taking toward something meaningful?',
    'Where do you notice hope in your body right now?',
    'How can you nurture this spark of optimism tomorrow?',
  ],
  steady: [
    'What rhythms or rituals kept you steady today?',
    'Name one quiet win that deserves to be seen.',
    'Is there anything you want to release before resting tonight?',
  ],
  tender: [
    'What emotion is visiting you? If it had a voice, what would it ask for?',
    'Who or what could offer you softness tonight?',
    'Recall a moment today that reminded you you’re human—and that’s okay.',
  ],
  stormy: [
    'Which thought loop feels the loudest? Try answering it with compassion.',
    'If you could ask for help without hesitation, what would you say?',
    'Name three things keeping you safe and grounded right now.',
  ],
  numb: [
    'What do you think your body is protecting you from feeling?',
    'List tiny sensory anchors (a scent, a texture) you might explore gently.',
    'Who could hold space for you—even in silence—if you reached out?',
  ],
}

const energyLabels = ['Drained', 'Low', 'Even', 'Bright', 'Electric']

const getMoodById = (id) => moodOptions.find((option) => option.id === id) ?? null

const getRandomPrompt = (moodId) => {
  const collection = promptLibrary[moodId]?.length
    ? promptLibrary[moodId]
    : Object.values(promptLibrary).flat()
  const index = Math.floor(Math.random() * collection.length)
  return collection[index]
}

const moodScoreMap = moodOptions.reduce((acc, mood) => {
  acc[mood.id] = mood.score
  return acc
}, {})

const moodColorMap = moodOptions.reduce((acc, mood) => {
  acc[mood.id] = mood.color
  return acc
}, {})

export {
  moodOptions,
  promptLibrary,
  energyLabels,
  getMoodById,
  getRandomPrompt,
  moodScoreMap,
  moodColorMap,
}
