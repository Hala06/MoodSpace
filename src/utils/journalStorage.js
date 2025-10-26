// Journal Storage Utilities

const JOURNAL_KEY_PREFIX = 'moodspace_journal_';

// Generate sample journal entries for demo
const generateSampleEntries = () => {
  const samples = [
    {
      id: 'sample-1',
      content: "Today was amazing! I finally finished that project I've been working on for weeks. The feeling of accomplishment is incredible. I also had a great conversation with an old friend - it reminded me how important it is to stay connected.",
      mood: '😊',
      tags: ['achievement', 'social', 'happy'],
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      aiPrompt: 'What made you feel accomplished today?'
    },
    {
      id: 'sample-2',
      content: "Feeling a bit overwhelmed with all the assignments due next week. But I made a plan and broke everything down into smaller tasks. Taking it one step at a time. Also went for a walk which helped clear my head.",
      mood: '😐',
      tags: ['study', 'stress', 'movement'],
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      aiPrompt: 'What small step can you take today to feel more in control?'
    },
    {
      id: 'sample-3',
      content: "Had a tough day. Didn't sleep well last night and it showed. But I'm grateful for my support system - talking things through with a friend really helped. Tomorrow is a new day.",
      mood: '😟',
      tags: ['tired', 'grateful', 'support'],
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      aiPrompt: 'What are you grateful for today, no matter how small?'
    },
    {
      id: 'sample-4',
      content: "Celebrated a small win today! Got positive feedback on my presentation. It's nice to be recognized for hard work. Treating myself to my favorite meal tonight. Self-care is important!",
      mood: '😊',
      tags: ['achievement', 'celebration', 'self-care'],
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      aiPrompt: 'How will you celebrate your wins today?'
    }
  ];
  return samples;
};

export const loadJournalEntries = (userId = 'default') => {
  try {
    const key = JOURNAL_KEY_PREFIX + userId;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return sample entries for first-time users
    const samples = generateSampleEntries();
    localStorage.setItem(key, JSON.stringify(samples));
    return samples;
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return [];
  }
};

export const saveJournalEntry = (entry, userId = 'default') => {
  try {
    const entries = loadJournalEntries(userId);
    const newEntry = {
      id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || [],
      timestamp: entry.timestamp || new Date().toISOString(),
      aiPrompt: entry.aiPrompt || ''
    };
    
    const updated = [newEntry, ...entries];
    const key = JOURNAL_KEY_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(updated));
    return newEntry;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const updateJournalEntry = (id, updates, userId = 'default') => {
  try {
    const entries = loadJournalEntries(userId);
    const updated = entries.map(entry => 
      entry.id === id ? { ...entry, ...updates, timestamp: new Date().toISOString() } : entry
    );
    const key = JOURNAL_KEY_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated.find(e => e.id === id);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }
};

export const deleteJournalEntry = (id, userId = 'default') => {
  try {
    const entries = loadJournalEntries(userId);
    const updated = entries.filter(entry => entry.id !== id);
    const key = JOURNAL_KEY_PREFIX + userId;
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Generate AI prompts based on mood and recent entries
export const generateAIPrompts = (mood) => {
  const moodPrompts = {
    '😊': [
      "What made today special for you?",
      "Who or what brought you joy today?",
      "What are you most grateful for right now?"
    ],
    '🙂': [
      "What went well today?",
      "What small win can you celebrate?",
      "What made you smile today?"
    ],
    '😐': [
      "What would make today better?",
      "What do you need right now?",
      "What is one thing you can control today?"
    ],
    '😟': [
      "What is weighing on your mind?",
      "Who can you reach out to for support?",
      "What self-care activity would help right now?"
    ],
    '😢': [
      "What do you need to let out?",
      "What would a compassionate friend tell you right now?",
      "What is one tiny step toward feeling better?"
    ]
  };

  const generalPrompts = [
    "What pattern do you notice in your week?",
    "If you could give your future self advice, what would it be?",
    "What emotion is asking for attention today?",
    "What boundary do you need to set?",
    "What are you learning about yourself lately?"
  ];

  const prompts = moodPrompts[mood] || generalPrompts;
  
  // Shuffle and return 3 prompts
  return [...prompts].sort(() => Math.random() - 0.5).slice(0, 3);
};
