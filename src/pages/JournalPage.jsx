import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Book, PlusCircle, X, Sparkles, Send, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { loadJournalEntries, saveJournalEntry, deleteJournalEntry, generateAIPrompts } from '../utils/journalStorage';
import { formatDate } from '../utils/dateHelpers';
import './journal.css';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Great' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😟', label: 'Struggling' },
  { emoji: '😢', label: 'Tough' }
];

const TAG_OPTIONS = ['happy', 'grateful', 'achievement', 'social', 'study', 'work', 'stress', 'tired', 'anxious', 'excited', 'calm', 'motivated'];

const JournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadEntries = () => {
    const loaded = loadJournalEntries(user?.id || 'default');
    setEntries(loaded);
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setShowModal(true);
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  const handleSaveEntry = (entry) => {
    try {
      saveJournalEntry(entry, user?.id || 'default');
      loadEntries();
      handleCloseModal();
      toast.success('Entry saved! 📝');
    } catch {
      toast.error('Failed to save entry');
    }
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        deleteJournalEntry(entryId, user?.id || 'default');
        loadEntries();
        handleCloseModal();
        toast.success('Entry deleted');
      } catch {
        toast.error('Failed to delete entry');
      }
    }
  };

  return (
    <Motion.div
      className="journal-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="journal-header">
        <div>
          <h1>My Journal</h1>
          <p>A private space for your thoughts and reflections</p>
        </div>
        <Motion.button
          className="create-entry-btn"
          onClick={handleCreateEntry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusCircle size={20} />
          New Entry
        </Motion.button>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <Book size={64} strokeWidth={1.5} />
          <h3>No journal entries yet</h3>
          <p>Start documenting your journey by creating your first entry</p>
          <button onClick={handleCreateEntry} className="empty-state-btn">
            <PlusCircle size={20} />
            Create First Entry
          </button>
        </div>
      ) : (
        <div className="journal-grid">
          {entries.map((entry, index) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              index={index}
              onClick={() => handleViewEntry(entry)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <JournalModal
            entry={selectedEntry}
            onClose={handleCloseModal}
            onSave={handleSaveEntry}
            onDelete={handleDeleteEntry}
          />
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

const JournalCard = ({ entry, index, onClick }) => (
  <Motion.div
    className="journal-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    onClick={onClick}
  >
    <div className="card-header">
      <span className="card-mood">{entry.mood}</span>
      <span className="card-date">
        <Calendar size={14} />
        {formatDate(entry.timestamp)}
      </span>
    </div>
    <p className="card-content">
      {entry.content.length > 150 
        ? `${entry.content.substring(0, 150)}...` 
        : entry.content}
    </p>
    {entry.tags && entry.tags.length > 0 && (
      <div className="card-tags">
        {entry.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        {entry.tags.length > 3 && (
          <span className="tag-more">+{entry.tags.length - 3} more</span>
        )}
      </div>
    )}
    <button className="read-more">Read More →</button>
  </Motion.div>
);

const JournalModal = ({ entry, onClose, onSave, onDelete }) => {
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || '😊');
  const [tags, setTags] = useState(entry?.tags || []);
  const [showPrompts, setShowPrompts] = useState(false);
  const [aiPrompts, setAiPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(entry?.aiPrompt || '');

  useEffect(() => {
    if (!entry) {
      generatePrompts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePrompts = () => {
    const prompts = generateAIPrompts(mood);
    setAiPrompts(prompts);
  };

  const handleToggleTag = (tag) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Please write something first');
      return;
    }

    onSave({
      id: entry?.id,
      content,
      mood,
      tags,
      aiPrompt: selectedPrompt,
      timestamp: entry?.timestamp || new Date().toISOString()
    });
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setShowPrompts(false);
    if (!content) {
      setContent(`Prompt: ${prompt}\n\n`);
    }
  };

  return (
    <Motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Motion.div
        className="modal-content journal-modal"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{entry ? 'View Entry' : 'New Journal Entry'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mood Selector */}
          <div className="form-section">
            <label>How are you feeling?</label>
            <div className="mood-selector">
              {MOOD_OPTIONS.map(option => (
                <button
                  key={option.emoji}
                  className={`mood-option ${mood === option.emoji ? 'active' : ''}`}
                  onClick={() => setMood(option.emoji)}
                  type="button"
                >
                  <span className="mood-emoji">{option.emoji}</span>
                  <span className="mood-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Prompts */}
          {!entry && (
            <div className="form-section">
              <button
                className="ai-prompt-btn"
                onClick={() => setShowPrompts(!showPrompts)}
                type="button"
              >
                <Sparkles size={18} />
                {showPrompts ? 'Hide' : 'Show'} AI Writing Prompts
              </button>
              
              {showPrompts && (
                <Motion.div
                  className="ai-prompts"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {aiPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="prompt-option"
                      onClick={() => handleSelectPrompt(prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </Motion.div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="form-section">
            <label htmlFor="journal-content">What's on your mind?</label>
            <textarea
              id="journal-content"
              className="journal-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing... Let your thoughts flow freely."
              rows={12}
            />
          </div>

          {/* Tags */}
          <div className="form-section">
            <label>Add tags (optional)</label>
            <div className="tag-selector">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  className={`tag-option ${tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleToggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div>
            {entry && (
              <button
                className="delete-btn"
                onClick={() => onDelete(entry.id)}
                type="button"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={onClose} type="button">
              Cancel
            </button>
            <Motion.button
              className="save-btn"
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              <Send size={18} />
              {entry ? 'Update' : 'Save'} Entry
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default JournalPage;
