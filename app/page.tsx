'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, Category, Tag } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetchNotes();
    fetchCategories();
    fetchTags();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('jolt-theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('jolt-theme', newTheme);
  };

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const fetchTags = async () => {
    const res = await fetch('/api/tags');
    const data = await res.json();
    setTags(data);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const res = await fetch(`/api/notes?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setNotes(data);
      setIsSearching(false);
    } else {
      fetchNotes();
    }
  };

  const handleCreateNote = async (noteData: Partial<Note>) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (res.ok) {
      fetchNotes();
      setIsCreating(false);
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      fetchNotes();
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Delete this note?')) {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotes();
        setEditingNote(null);
      }
    }
  };

  const togglePin = async (note: Note) => {
    await handleUpdateNote(note.id, { isPinned: !note.isPinned });
  };

  return (
    <main className="container">
      <style>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-xl) var(--space-lg);
          min-height: 100vh;
        }

        .header {
          margin-bottom: var(--space-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-lg);
        }

        .title-section {
          flex: 1;
        }

        .theme-toggle {
          flex-shrink: 0;
          align-self: flex-start;
          margin-top: 0.5rem;
        }

        .title {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-xs);
          line-height: 0.95;
        }

        .subtitle {
          font-size: 0.875rem;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 300;
        }

        .search-bar {
          width: 100%;
          max-width: 400px;
          padding: var(--space-sm) var(--space-md);
          border: 2px solid var(--color-border);
          background: var(--color-card);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--color-text);
        }

        .search-bar::placeholder {
          color: var(--color-muted);
          opacity: 1;
        }

        .search-bar:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(204, 255, 0, 0.1);
        }

        .controls {
          display: flex;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }

        .btn {
          padding: var(--space-sm) var(--space-md);
          border: 2px solid var(--color-text);
          background: var(--color-text);
          color: var(--color-bg);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn:hover {
          background: transparent;
          color: var(--color-text);
          transform: translateY(-2px);
        }

        .btn-accent {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: var(--color-text);
          font-weight: 600;
        }

        .btn-accent:hover {
          background: var(--color-text);
          border-color: var(--color-text);
          color: var(--color-accent);
          font-weight: 600;
        }

        .btn-theme {
          background: transparent;
          border-color: var(--color-text);
          color: var(--color-text);
          font-size: 1.2rem;
          padding: var(--space-sm) var(--space-md);
          min-width: 48px;
        }

        .btn-theme:hover {
          background: var(--color-text);
          color: var(--color-bg);
          transform: translateY(-2px) rotate(180deg);
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-lg);
          position: relative;
        }

        .note-card {
          background: var(--color-card);
          border: 2px solid var(--color-border);
          padding: var(--space-lg);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .note-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--color-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .note-card:hover {
          transform: rotate(-1deg) translateY(-8px);
          box-shadow: 12px 12px 0 var(--color-shadow);
          border-color: var(--color-text);
        }

        .note-card:hover::before {
          transform: scaleX(1);
        }

        .note-card.pinned {
          border-color: var(--color-accent);
          background: linear-gradient(135deg, var(--color-card) 0%, rgba(204, 255, 0, 0.05) 100%);
        }

        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-sm);
        }

        .note-title {
          font-size: 1.5rem;
          font-family: var(--font-display);
          font-weight: 600;
          margin-bottom: var(--space-xs);
          line-height: 1.3;
        }

        .note-content {
          color: var(--color-muted);
          font-size: 0.875rem;
          line-height: 1.7;
          margin-bottom: var(--space-md);
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .note-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .note-tags {
          display: flex;
          gap: var(--space-xs);
          flex-wrap: wrap;
          margin-top: var(--space-sm);
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: var(--color-text);
          color: var(--color-bg);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pin-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.3;
          transition: all 0.2s;
          padding: 0.25rem;
        }

        .pin-btn:hover,
        .pin-btn.active {
          opacity: 1;
          transform: rotate(15deg);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-lg);
        }

        .modal {
          background: var(--color-card);
          border: 3px solid var(--color-text);
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-xl);
          box-shadow: 20px 20px 0 rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .modal-title {
          font-size: 2rem;
          font-family: var(--font-display);
          font-weight: 700;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: transform 0.2s;
          color: var(--color-text);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          transform: rotate(90deg);
          color: var(--color-accent);
        }

        .form-group {
          margin-bottom: var(--space-lg);
        }

        .label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-xs);
          color: var(--color-muted);
        }

        .input,
        .textarea {
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          border: 2px solid var(--color-border);
          background: var(--color-bg);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--color-text);
          box-sizing: border-box;
        }

        .input::placeholder,
        .textarea::placeholder {
          color: var(--color-muted);
          opacity: 1;
        }

        .input:focus,
        .textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(204, 255, 0, 0.1);
        }

        .textarea {
          min-height: 200px;
          resize: vertical;
          font-size: 1rem;
          line-height: 1.7;
          font-family: var(--font-mono);
        }

        .form-actions {
          display: flex;
          gap: var(--space-sm);
          justify-content: flex-end;
          margin-top: var(--space-lg);
          padding-top: var(--space-lg);
          border-top: 2px solid var(--color-border);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--color-accent);
        }

        .checkbox-label .label {
          margin: 0;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: var(--space-xl);
          color: var(--color-muted);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--space-md);
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .container {
            padding: var(--space-lg) var(--space-md);
          }

          .header {
            flex-direction: row;
            gap: var(--space-md);
            align-items: flex-start;
          }

          .theme-toggle {
            margin-top: 0;
          }

          .search-bar {
            max-width: 100%;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .title {
            font-size: 3rem;
          }
        }
      `}</style>

      <div className="header animate-in">
        <div className="title-section">
          <h1 className="title">JOLT</h1>
          <p className="subtitle">Editorial Notes</p>
        </div>
        <button 
          className="btn btn-theme theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '◐' : '◑'}
        </button>
      </div>

      <div className="controls animate-in-delay-1">
        <input
          type="text"
          className="search-bar"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="btn btn-accent" onClick={() => setIsCreating(true)}>
          + New Note
        </button>
      </div>

      <div className="notes-grid">
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-icon">✎</div>
              <p>No notes yet. Create your first one.</p>
            </motion.div>
          ) : (
            notes.map((note, index) => (
              <motion.div
                key={note.id}
                className={`note-card ${note.isPinned ? 'pinned' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setEditingNote(note)}
              >
                <div className="note-header">
                  <h2 className="note-title">{note.title || 'Untitled'}</h2>
                  <button
                    className={`pin-btn ${note.isPinned ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(note);
                    }}
                  >
                    📌
                  </button>
                </div>
                <p className="note-content">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="note-meta">
                  <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
                  {note.isFavorite && <span>★</span>}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {(isCreating || editingNote) && (
          <NoteModal
            key={editingNote ? `edit-${editingNote.id}` : 'create-new'}
            note={editingNote}
            onClose={() => {
              setIsCreating(false);
              setEditingNote(null);
            }}
            onSave={editingNote ? handleUpdateNote : handleCreateNote}
            onDelete={editingNote ? handleDeleteNote : undefined}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
  onSave: (idOrData: any, updates?: any) => void;
  onDelete?: (id: string) => void;
}

function NoteModal({ note, onClose, onSave, onDelete }: NoteModalProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isFavorite,
      isPinned: note?.isPinned || false,
    };

    if (note) {
      onSave(note.id, noteData);
    } else {
      onSave(noteData);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="label">Content</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="form-group">
            <label className="label">Tags (comma-separated)</label>
            <input
              type="text"
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, ideas, urgent"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
              />
              <span className="label">Favorite</span>
            </label>
          </div>

          <div className="form-actions">
            {onDelete && note && (
              <button
                type="button"
                className="btn"
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
            )}
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-accent">
              {note ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
