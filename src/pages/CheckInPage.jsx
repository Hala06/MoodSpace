import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Send, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import { moodOptions, getMoodById, energyLabels, moodColorMap } from '../data/moodData';
import { loadCheckins, persistCheckins } from '../utils/checkinStorage';
import { buildPromptSet, suggestMicroActions } from '../utils/promptEngine';
import { useAuth } from '../contexts/AuthContext.jsx';
import './check-in.css';

const focusAreas = ['Rest', 'Connection', 'Movement', 'Creativity', 'Nature', 'Support'];

const CheckInPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';

  const [history, setHistory] = useState(() => loadCheckins(userId));
  const [selectedMood, setSelectedMood] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [microActions, setMicroActions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHistory(loadCheckins(userId));
  }, [userId]);

  const selectedMoodData = useMemo(() => (selectedMood ? getMoodById(selectedMood) : null), [selectedMood]);

  const preparePrompts = useCallback((moodId, currentHistory = history, energy = energyLevel) => {
    const promptSet = buildPromptSet({ moodId, history: currentHistory });
    setPrompts(promptSet);
    setPromptIndex(0);
    setMicroActions(suggestMicroActions({ moodId, energy }));
  }, [energyLevel, history]);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setNotes('');
    setSelectedTags([]);
    preparePrompts(moodId);
  };

  const handleEnergyChange = (event) => {
    const value = Number(event.target.value);
    setEnergyLevel(value);
    if (selectedMood) {
      setMicroActions(suggestMicroActions({ moodId: selectedMood, energy: value }));
    }
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleNextPrompt = (targetIndex) => {
    if (targetIndex && typeof targetIndex.preventDefault === 'function') {
      targetIndex.preventDefault();
      targetIndex = undefined;
    }
    if (typeof targetIndex === 'number') {
      setPromptIndex(targetIndex % Math.max(prompts.length, 1));
      return;
    }
    if (!prompts.length && selectedMood) {
      preparePrompts(selectedMood);
      return;
    }
    setPromptIndex((prev) => (prev + 1) % Math.max(prompts.length, 1));
  };

  const handleBackToMoods = () => {
    setSelectedMood(null);
    setEnergyLevel(3);
    setPrompts([]);
    setPromptIndex(0);
    setMicroActions([]);
    setNotes('');
    setSelectedTags([]);
  };

  const handleSave = () => {
    if (!selectedMood) {
      toast.error('Choose a mood to get started.');
      return;
    }

    setIsSaving(true);
    const historySnapshot = loadCheckins(userId);
    const selectedPrompt = prompts[promptIndex] ?? '';
    const checkinEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}`,
      moodId: selectedMood,
      energy: energyLevel,
      tags: selectedTags,
      notes,
      prompt: selectedPrompt,
      suggestedActions: microActions,
      date: new Date().toISOString()
    };

    const updated = [...historySnapshot, checkinEntry];
    persistCheckins(userId, updated);
    setHistory(updated);

    confetti({
      particleCount: 160,
      spread: 75,
      origin: { y: 0.6 }
    });

    toast.success('Check-in saved. Thanks for showing up today.');

    setTimeout(() => {
      setIsSaving(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <Motion.div
      className="check-in-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="check-in-container">
        <AnimatePresence mode="wait">
          {!selectedMood ? (
            <MoodSelection key="mood-selection" onSelect={handleMoodSelect} history={history} />
          ) : (
            <ReflectionCard
              key="reflection-card"
              mood={selectedMoodData}
              energy={energyLevel}
              notes={notes}
              onNotesChange={setNotes}
              prompts={prompts}
              currentPromptIndex={promptIndex}
              onCyclePrompt={handleNextPrompt}
              microActions={microActions}
              onSave={handleSave}
              onBack={handleBackToMoods}
              onEnergyChange={handleEnergyChange}
              tags={selectedTags}
              onToggleTag={handleToggleTag}
              isSaving={isSaving}
            />
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
};

const MoodSelection = ({ onSelect }) => (
  <Motion.div
    className="mood-selection"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
  >
    <div className="mood-header">
      <h1>How are you landing today?</h1>
      <p>Choose the emoji that feels closest. You can always change it once you start reflecting.</p>
    </div>
    <div className="mood-grid">
      {moodOptions.map((mood, index) => (
        <Motion.button
          key={mood.id}
          className="mood-card"
          style={{ '--mood-color': moodColorMap[mood.id] }}
          onClick={() => onSelect(mood.id)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <div className="mood-card-body">
            <strong>{mood.label}</strong>
            <span>{mood.tone}</span>
          </div>
        </Motion.button>
      ))}
    </div>
  </Motion.div>
);

const ReflectionCard = ({
  mood,
  energy,
  notes,
  onNotesChange,
  prompts,
  currentPromptIndex,
  onCyclePrompt,
  microActions,
  onSave,
  onBack,
  onEnergyChange,
  tags,
  onToggleTag,
  isSaving
}) => (
  <Motion.div
    className="reflection-card"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.45 }}
  >
    <button type="button" className="back-link" onClick={onBack}>
      <ArrowLeft size={16} /> choose another mood
    </button>

    <div className="reflection-header" style={{ '--mood-accent': moodColorMap[mood.id] }}>
      <span className="reflection-emoji">{mood.emoji}</span>
      <div>
        <h2>Feeling {mood.label}</h2>
        <p>{mood.tone}</p>
      </div>
    </div>

    <div className="energy-panel">
      <div className="energy-labels">
        <span>Energy check</span>
        <span>{energyLabels[energy - 1]}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={energy}
        onChange={onEnergyChange}
      />
      <div className="energy-scale">
        {energyLabels.map((label, index) => (
          <span key={label} className={index + 1 === energy ? 'active' : ''}>{label}</span>
        ))}
      </div>
    </div>

    <div className="prompt-panel">
      <div className="prompt-header">
        <span className="prompt-chip">AI reflection prompt</span>
        <button type="button" onClick={onCyclePrompt} className="prompt-refresh">
          <RefreshCw size={16} /> Try another
        </button>
      </div>
      <p className="prompt-text">{prompts[currentPromptIndex] ?? 'Take a breath and share what is alive for you right now.'}</p>
      {prompts.length > 1 && (
        <div className="prompt-choices">
          {prompts.map((prompt, index) => (
            <button
              key={prompt}
              type="button"
              className={index === currentPromptIndex ? 'active' : ''}
              onClick={() => onCyclePrompt(index)}
            >
              {prompt.slice(0, 48)}…
            </button>
          ))}
        </div>
      )}
    </div>

    <div className="tags-panel">
      <span className="panel-title">What would feel supportive?</span>
      <div className="tag-options">
        {focusAreas.map((tag) => (
          <button
            type="button"
            key={tag}
            className={tags.includes(tag) ? 'tag active' : 'tag'}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>

    <label className="notes-label" htmlFor="reflection-notes">Let it out</label>
    <textarea
      id="reflection-notes"
      className="notes-input"
      rows={5}
      value={notes}
      onChange={(event) => onNotesChange(event.target.value)}
      placeholder="Write anything that wants to be heard. This stays private unless you later share it in the forum."
    />

    {microActions.length > 0 && (
      <div className="micro-actions">
        <span className="panel-title">Tiny next steps</span>
        <ul>
          {microActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>
    )}

    <Motion.button
      className="save-checkin"
      type="button"
      onClick={onSave}
      disabled={isSaving}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {isSaving ? 'Saving…' : 'Save check-in'}
      <Send size={18} />
    </Motion.button>
  </Motion.div>
);

export default CheckInPage;
