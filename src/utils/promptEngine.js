import { getMoodById, promptLibrary } from '../data/moodData';

const PROMPT_LIMIT = 3;

const spectrumMicroActions = {
  positive: [
    'Celebrate the moment by sharing a win with someone you trust.',
    'Capture one detail you want to remember if a harder day arrives.',
    'Channel the energy into a tiny act of kindness for yourself or another.'
  ],
  neutral: [
    'Name a simple ritual that helps you feel grounded right now.',
    'List two things you can release before the day ends.',
    'Plan a five-minute pause to check in again later tonight.'
  ],
  soft: [
    'Offer yourself one sentence of validation as if you were a close friend.',
    'Choose a comfort activity to schedule within the next hour.',
    'Reach out to someone who can sit with you — even silently.'
  ],
  intense: [
    'Practice a 4-7-8 breath cycle to reset your nervous system.',
    'Identify one safety anchor nearby (texture, scent, sound).',
    'Message the community with what support would feel good right now.'
  ],
  default: [
    'Step outside for sixty seconds and notice three things you can see.',
    'Write a sentence that starts with “Today, I am grateful for…”.',
    'Drink a glass of water while naming a hope you have for tomorrow.'
  ]
};

const trendPrompts = {
  upswing: 'You have been trending brighter. What support helped you rise, and how can you honour it?',
  downswing: 'Your recent moods dipped a little. What gentle boundary or rest might help you today?',
  steady: 'You have been steady lately. Is there a routine worth celebrating or adjusting?' 
};

const uniquePush = (collection, candidate) => {
  if (!candidate) return;
  if (collection.includes(candidate)) return;
  collection.push(candidate);
};

export const buildPromptSet = ({ moodId, history = [] }) => {
  const prompts = [];
  const mood = getMoodById(moodId);
  if (!mood) return prompts;

  const recent = history.slice(-6);
  if (recent.length >= 2) {
    const scoreFor = (entry) => getMoodById(entry?.moodId)?.score ?? 0;
    const lastScore = scoreFor(recent[recent.length - 1]);
    const previousScore = scoreFor(recent[0]);
    const delta = lastScore - previousScore;
    if (delta >= 2) {
      uniquePush(prompts, trendPrompts.upswing);
    } else if (delta <= -2) {
      uniquePush(prompts, trendPrompts.downswing);
    } else {
      uniquePush(prompts, trendPrompts.steady);
    }
  }

  const libraryPrompts = promptLibrary[moodId] ?? [];
  libraryPrompts.forEach((prompt) => uniquePush(prompts, prompt));

  if (prompts.length < PROMPT_LIMIT) {
    const allPrompts = Object.values(promptLibrary).flat();
    while (prompts.length < PROMPT_LIMIT) {
      const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
      uniquePush(prompts, randomPrompt);
    }
  }

  return prompts.slice(0, PROMPT_LIMIT);
};

export const suggestMicroActions = ({ moodId, energy = 3 }) => {
  const mood = getMoodById(moodId);
  const spectrum = mood?.spectrum ?? 'default';
  const baseActions = spectrumMicroActions[spectrum] ?? spectrumMicroActions.default;

  const energyAdjusted = energy >= 4
    ? ['Take a celebratory snapshot of today’s highlight.', 'Invest extra energy into a future-you kindness.']
    : energy <= 2
      ? ['Schedule a calming ritual within the next hour.', 'Ask for support — even if it is a simple check-in emoji.']
      : [];

  const combined = [...baseActions, ...energyAdjusted, ...spectrumMicroActions.default];
  return Array.from(new Set(combined)).slice(0, 3);
};