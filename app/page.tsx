'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import UserMenu from './_components/UserMenu';

const PALETTE = ['pink', 'cyan', 'yellow', 'mint', 'lavender', 'tangerine'] as const;
type Hue = (typeof PALETTE)[number];

// Stable hash → color + rotation per note id
function stable(id: string): { hue: Hue; rot: number; tilt: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const hue = PALETTE[h % PALETTE.length];
  const rot = ((h >> 4) % 7) - 3;       // -3..+3 deg
  const tilt = ((h >> 8) % 5) - 2;      // small parallax tilt
  return { hue, rot, tilt };
}

const TICKER_LINES = [
  '★ JOLT',
  'NEW ENTRIES PINNED ABOVE',
  '✺ STAY LOUD',
  'PRESS / TO SEARCH',
  '◆ ALL THOUGHTS WELCOME',
  'WRITE IT DOWN OR LOSE IT',
  '✿ SHIFT + N FOR NEW',
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'fav'>('all');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchNotes(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      const editable = t === 'INPUT' || t === 'TEXTAREA';
      if (e.key === '/' && !editable) { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === 'N' && e.shiftKey && !editable) { e.preventDefault(); setIsCreating(true); }
      else if (e.key === 'Escape') { setIsCreating(false); setEditingNote(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    setNotes(await res.json());
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      const res = await fetch(`/api/notes?q=${encodeURIComponent(q)}`);
      setNotes(await res.json());
    } else fetchNotes();
  };

  const create = async (data: Partial<Note>) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) { fetchNotes(); setIsCreating(false); }
  };

  const update = async (id: string, updates: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) { fetchNotes(); setEditingNote(null); }
  };

  const remove = async (id: string) => {
    if (confirm('Yeet this note into the void?')) {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) { fetchNotes(); setEditingNote(null); }
    }
  };

  const togglePin = (n: Note) => update(n.id, { isPinned: !n.isPinned });
  const toggleFav = (n: Note) => update(n.id, { isFavorite: !n.isFavorite });

  const visible = useMemo(() => {
    let v = [...notes];
    if (filter === 'pinned') v = v.filter((n) => n.isPinned);
    if (filter === 'fav') v = v.filter((n) => n.isFavorite);
    v.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return v;
  }, [notes, filter]);

  return (
    <main className="canvas">
      <style>{styles}</style>

      {/* ── Ticker tape ───────────────── */}
      <div className="ticker" aria-hidden>
        <div className="ticker-track">
          {[...TICKER_LINES, ...TICKER_LINES, ...TICKER_LINES, ...TICKER_LINES].map((t, i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Floating Memphis confetti ────── */}
      <Decor />

      {/* ── Wordmark ──────────────────── */}
      <header className="head">
        <div className="head-bar">
          <div className="head-tag">
            <span className="dot pink" /> <span className="dot cyan" /> <span className="dot yellow" />
            <span className="head-tag-txt">notebook · vol.88</span>
          </div>
          <UserMenu />
        </div>
        <h1 className="wordmark">
          <span className="w-shade">JOLT</span>
          <span className="w-front">JOLT</span>
        </h1>
        <p className="head-sub">
          a loud little place to put your <em>brilliant</em> ideas
        </p>
      </header>

      {/* ── Toolbar ───────────────────── */}
      <section className="bar">
        <label className="search-pill">
          <span className="slash">/</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="search the sticker book…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </label>

        <div className="filters">
          {(['all', 'pinned', 'fav'] as const).map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'on' : ''}`}
              data-hue={f === 'all' ? 'lavender' : f === 'pinned' ? 'cyan' : 'yellow'}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '✺ all' : f === 'pinned' ? '◆ pinned' : '★ favs'}
            </button>
          ))}
        </div>

        <button className="big-btn" onClick={() => setIsCreating(true)}>
          <span className="big-btn-burst">✦</span>
          new note
          <span className="kbd">⇧N</span>
        </button>
      </section>

      {/* ── Sticker grid ──────────────── */}
      <section className="board">
        {visible.length === 0 ? (
          <div className="empty">
            <div className="empty-shape" />
            <h2 className="empty-title">no stickers yet</h2>
            <p className="empty-sub">slap a new one on the board ↑</p>
          </div>
        ) : (
          <AnimatePresence>
            {visible.map((n, i) => (
              <StickerCard
                key={n.id}
                note={n}
                index={i}
                onOpen={() => setEditingNote(n)}
                onPin={() => togglePin(n)}
                onFav={() => toggleFav(n)}
              />
            ))}
          </AnimatePresence>
        )}
      </section>

      <footer className="foot">
        <div className="foot-stripes" />
        <p>made with ♥ + ♦ + ▲ — set in <em>Bungee &amp; Familjen Grotesk</em></p>
        <p className="credit">a thing by <em>Vighnesh Shukla</em></p>
      </footer>

      <AnimatePresence mode="wait">
        {(isCreating || editingNote) && (
          <NoteModal
            key={editingNote ? `edit-${editingNote.id}` : 'create'}
            note={editingNote}
            onClose={() => { setIsCreating(false); setEditingNote(null); }}
            onSave={editingNote ? update : create}
            onDelete={editingNote ? remove : undefined}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
function Decor() {
  return (
    <svg className="decor" viewBox="0 0 1600 1200" preserveAspectRatio="none" aria-hidden>
      <g stroke="#FF3D7F" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M120 220 q40 -50 80 0 t80 0 t80 0" />
      </g>
      <g fill="#FFD23F">
        <circle cx="1450" cy="160" r="14" />
        <circle cx="1490" cy="160" r="14" />
        <circle cx="1530" cy="160" r="14" />
      </g>
      <g stroke="#3DD9EB" strokeWidth="6" fill="none">
        <path d="M1380 540 l24 24 l-24 24 l24 24 l-24 24 l24 24" />
      </g>
      <g fill="#B8A4FF">
        <path d="M180 880 l22 -38 l22 38 l-22 38 z" />
      </g>
      <g stroke="#7CE3A1" strokeWidth="7" strokeLinecap="round">
        <path d="M1500 980 v32 M1484 996 h32" />
      </g>
      <g fill="none" stroke="#FF8A3D" strokeWidth="5">
        <circle cx="100" cy="500" r="22" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────── */
function StickerCard({
  note, index, onOpen, onPin, onFav,
}: { note: Note; index: number; onOpen: () => void; onPin: () => void; onFav: () => void }) {
  const { hue, rot } = stable(note.id);
  const wc = note.content?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <motion.article
      className={`sticker hue-${hue} ${note.isPinned ? 'is-pinned' : ''}`}
      style={{ ['--rot' as any]: `${rot}deg` }}
      initial={{ opacity: 0, y: 30, scale: 0.9, rotate: rot }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
      exit={{ opacity: 0, scale: 0.85, rotate: rot }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220, damping: 18 }}
      whileHover={{ rotate: 0, scale: 1.04, y: -6 }}
      onClick={onOpen}
    >
      {note.isPinned && <div className="banner">★ PINNED ★ PINNED ★</div>}

      <div className="tape" aria-hidden />

      <div className="sticker-head">
        <span className="folio">№ {String(index + 1).padStart(2, '0')}</span>
        <div className="sticker-actions">
          <button
            className={`mini ${note.isFavorite ? 'on' : ''}`}
            onClick={(e) => { e.stopPropagation(); onFav(); }}
            aria-label="favourite"
          >★</button>
          <button
            className={`mini ${note.isPinned ? 'on' : ''}`}
            onClick={(e) => { e.stopPropagation(); onPin(); }}
            aria-label="pin"
          >◆</button>
        </div>
      </div>

      <h3 className="sticker-title">{note.title || 'untitled blip'}</h3>
      <p className="sticker-body">{note.content || <span className="ghost">…blank thought…</span>}</p>

      {note.tags?.length > 0 && (
        <div className="sticker-tags">
          {note.tags.map((t) => <span key={t} className="tag-bubble">#{t}</span>)}
        </div>
      )}

      <div className="sticker-foot">
        <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
        <span className="wc">{wc}w</span>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────── */
function NoteModal({
  note, onClose, onSave, onDelete,
}: {
  note: Note | null;
  onClose: () => void;
  onSave: (a: any, b?: any) => void;
  onDelete?: (id: string) => void;
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const wc = content.trim().split(/\s+/).filter(Boolean).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title, content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      isFavorite, isPinned,
    };
    if (note) onSave(note.id, data); else onSave(data);
  };

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="card-modal"
        initial={{ y: 50, opacity: 0, rotate: -2, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, rotate: -1, scale: 1 }}
        exit={{ y: 50, opacity: 0, rotate: -2, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-tape" />
        <div className="card-holes" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
        </div>

        <header className="modal-head">
          <span className="modal-eyebrow">{note ? '✎ EDITING' : '✦ NEW NOTE'}</span>
          <button className="x" onClick={onClose}>✕</button>
        </header>

        <form onSubmit={submit} className="modal-form">
          <input
            className="title-line"
            placeholder="give it a name…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <textarea
            className="body-line"
            placeholder="say it loud."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={11}
          />

          <div className="modal-row">
            <label className="field">
              <span>tags</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma, separated"
              />
            </label>
            <div className="bigtoggles">
              <label className={`tog ${isPinned ? 'on' : ''}`}>
                <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
                ◆ pin
              </label>
              <label className={`tog ${isFavorite ? 'on' : ''}`}>
                <input type="checkbox" checked={isFavorite} onChange={(e) => setIsFavorite(e.target.checked)} />
                ★ fav
              </label>
            </div>
          </div>

          <footer className="modal-foot">
            <span className="wc-pill">{wc} words</span>
            <div className="actions">
              {note && (
                <a
                  className="big-btn ghost"
                  href={`/api/notes/${note.id}/export`}
                  onClick={(e) => e.stopPropagation()}
                  download
                >
                  ⤓ export
                </a>
              )}
              {onDelete && note && (
                <button type="button" className="big-btn ghost danger" onClick={() => onDelete(note.id)}>
                  ✕ delete
                </button>
              )}
              <button type="button" className="big-btn ghost" onClick={onClose}>cancel</button>
              <button type="submit" className="big-btn">{note ? 'save it' : 'slap it on'}</button>
            </div>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */
const styles = `
.canvas { position: relative; z-index: 2; max-width: min(1380px, 100%); margin: 0 auto; padding: clamp(0.8rem, 2vw, 1.4rem) clamp(0.9rem, 4vw, 3rem) clamp(3rem, 6vw, 5rem); }
@media (min-width: 1600px) { .canvas { max-width: 1520px; } }

/* ── Ticker tape ─────────────────────────── */
.ticker {
  position: relative;
  height: 36px;
  background: var(--ink);
  border: 3px solid var(--ink);
  box-shadow: var(--hard-shadow-sm);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transform: rotate(-0.5deg);
}
.ticker-track {
  display: inline-flex; gap: 2.5rem;
  white-space: nowrap;
  font-family: var(--display);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  padding: 7px 0;
  color: var(--yellow);
  animation: ticker 40s linear infinite;
  width: max-content;
}
.ticker-item { padding: 0 0.5rem; }
.ticker-item:nth-child(3n) { color: var(--cyan); }
.ticker-item:nth-child(3n+1) { color: var(--pink); }
.ticker-item:nth-child(3n+2) { color: var(--mint); }

/* ── Decor (floating Memphis shapes) ─────── */
.decor {
  position: fixed; inset: 0; z-index: 1;
  width: 100%; height: 100%;
  pointer-events: none;
  opacity: 0.55;
}
@media (max-width: 720px) { .decor { opacity: 0.25; } }

/* ── Header ──────────────────────────────── */
.head { text-align: center; padding: clamp(1rem, 3vw, 1.6rem) 0 clamp(1.2rem, 3vw, 2rem); position: relative; }
@media (max-width: 520px) {
  .head-bar { flex-wrap: wrap; }
  .head-tag { font-size: 0.65rem; padding: 0.3rem 0.7rem; }
  .head-tag-txt { display: none; }
  .head-sub { font-size: 0.95rem; }
  .ticker { height: 30px; }
  .ticker-track { font-size: 0.72rem; padding: 6px 0; }
}
.head-bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 0.6rem; }
.head-tag {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  box-shadow: var(--hard-shadow-sm);
  font-family: var(--mono); font-size: 0.75rem; font-weight: 500;
  letter-spacing: 0.16em; text-transform: uppercase;
  transform: rotate(-2deg);
  margin-bottom: 1rem;
}
.head-tag .dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
.head-tag .pink { background: var(--pink); }
.head-tag .cyan { background: var(--cyan); }
.head-tag .yellow { background: var(--yellow); }

.wordmark {
  position: relative;
  font-family: var(--display);
  font-size: clamp(4.5rem, 17vw, 14rem);
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: var(--bone);
  display: inline-block;
}
.w-shade {
  position: absolute; inset: 0;
  font-family: var(--shade);
  color: var(--pink);
  transform: translate(10px, 8px);
  z-index: -1;
}
.w-front {
  position: relative;
  background: linear-gradient(180deg, var(--bone) 0%, var(--bone) 50%, var(--cyan) 50%, var(--yellow) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 3px var(--ink);
}

.head-sub {
  margin-top: 0.7rem;
  font-family: var(--body); font-size: 1.05rem; font-weight: 500;
  color: var(--fg-dim);
}
.head-sub em { font-family: var(--display); font-size: 1.15rem; font-style: normal; color: var(--yellow); padding: 0 0.25rem; }

/* ── Toolbar ─────────────────────────────── */
.bar {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.9rem;
  align-items: center;
  margin-bottom: 2rem;
}
@media (max-width: 820px) {
  .bar { grid-template-columns: 1fr; gap: 0.7rem; margin-bottom: 1.4rem; }
  .bar .big-btn { width: 100%; justify-content: center; }
  .filters { justify-content: center; }
}

.search-pill {
  display: flex; align-items: center; gap: 0.7rem;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  padding: 0 1.1rem;
  height: 56px;
  box-shadow: var(--hard-shadow);
  transition: transform 180ms;
}
.search-pill:focus-within { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink); }
.search-pill .slash {
  font-family: var(--display); color: var(--pink); font-size: 1.4rem;
  background: var(--yellow); border: 2.5px solid var(--ink);
  width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 999px;
}
.search-pill input {
  flex: 1; min-width: 0;
  background: transparent; border: 0; outline: 0;
  color: var(--ink); font: 500 1rem var(--body);
}
.search-pill input::placeholder { color: rgba(10,10,10,0.5); }

.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip {
  padding: 0 1rem; height: 44px;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font: 700 0.78rem var(--mono);
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; box-shadow: var(--hard-shadow-sm);
  transition: transform 160ms;
}
.chip:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--ink); }
.chip.on[data-hue="lavender"] { background: var(--lavender); }
.chip.on[data-hue="cyan"]     { background: var(--cyan); }
.chip.on[data-hue="yellow"]   { background: var(--yellow); }

.big-btn {
  display: inline-flex; align-items: center; gap: 0.6rem;
  height: 56px; padding: 0 1.4rem;
  background: var(--pink); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font: 700 0.95rem var(--display);
  letter-spacing: 0.04em; text-transform: lowercase;
  cursor: pointer; box-shadow: var(--hard-shadow);
  transition: transform 160ms, box-shadow 160ms, background 160ms;
}
.big-btn:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--ink); background: var(--yellow); }
.big-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.big-btn-burst { font-size: 1.3rem; color: var(--ink); display: inline-block; animation: hue-spin 4s linear infinite; }
.big-btn .kbd { padding: 0.15rem 0.5rem; border: 2px solid var(--ink); border-radius: 6px; font: 600 0.7rem var(--mono); margin-left: 0.3rem; }
.big-btn.ghost { background: transparent; color: var(--bone); border-color: var(--bone); box-shadow: 4px 4px 0 var(--pink); }
.big-btn.ghost:hover { background: var(--bone); color: var(--ink); }
.big-btn.ghost.danger:hover { background: var(--pink); color: var(--bone); }

/* ── Sticker board ───────────────────────── */
.board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: clamp(1rem, 2.4vw, 1.6rem);
  position: relative;
}
@media (min-width: 1600px) {
  .board { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
}

.sticker {
  position: relative;
  background: var(--card-bg, var(--pink));
  color: var(--ink);
  border: 3px solid var(--ink);
  padding: 1.4rem 1.3rem 1.1rem;
  cursor: pointer;
  box-shadow: var(--hard-shadow);
  display: flex; flex-direction: column; gap: 0.5rem;
  min-height: 220px;
  transform: rotate(var(--rot, 0deg));
  transition: box-shadow 200ms;
  overflow: hidden;
}
.sticker:hover { box-shadow: var(--hard-shadow-lg); }
.sticker:hover .tape { animation: wiggle 800ms ease-in-out infinite; }

.hue-pink      { --card-bg: var(--pink); }
.hue-cyan      { --card-bg: var(--cyan); }
.hue-yellow    { --card-bg: var(--yellow); }
.hue-mint      { --card-bg: var(--mint); }
.hue-lavender  { --card-bg: var(--lavender); }
.hue-tangerine { --card-bg: var(--tangerine); }

/* Tape strip */
.tape {
  position: absolute; top: -10px; left: 50%;
  width: 64px; height: 18px;
  background: rgba(252, 244, 228, 0.7);
  border: 1.5px solid rgba(10,10,10,0.25);
  transform: translateX(-50%) rotate(-3deg);
  box-shadow: 0 1px 0 rgba(0,0,0,0.1);
}

/* Diagonal pinned banner */
.banner {
  position: absolute; top: 16px; right: -50px;
  background: var(--ink); color: var(--yellow);
  padding: 0.3rem 3.5rem;
  font: 700 0.7rem var(--mono);
  letter-spacing: 0.18em;
  transform: rotate(35deg);
  box-shadow: 0 0 0 2px var(--ink), 0 4px 0 rgba(255,210,63,0.4);
  pointer-events: none;
}

.sticker-head {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 0.4rem;
}
.folio {
  background: var(--ink); color: var(--bone);
  padding: 0.25rem 0.6rem;
  font: 600 0.7rem var(--mono);
  letter-spacing: 0.14em;
  border-radius: 4px;
}
.sticker-actions { display: flex; gap: 0.3rem; }
.mini {
  width: 30px; height: 30px;
  background: var(--bone); color: var(--ink);
  border: 2.5px solid var(--ink);
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: transform 160ms, background 160ms;
}
.mini:hover { transform: scale(1.15) rotate(-8deg); }
.mini.on { background: var(--ink); color: var(--yellow); }

.sticker-title {
  font-family: var(--display);
  font-size: 1.4rem;
  line-height: 1.1;
  color: var(--ink);
  text-transform: lowercase;
  letter-spacing: -0.01em;
  margin-top: 0.2rem;
}
.sticker-body {
  flex: 1;
  font: 500 0.92rem/1.55 var(--body);
  color: rgba(10,10,10,0.85);
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
}
.ghost { font-style: italic; opacity: 0.55; }

.sticker-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.tag-bubble {
  background: var(--ink); color: var(--bone);
  padding: 0.2rem 0.55rem;
  font: 500 0.7rem var(--mono);
  letter-spacing: 0.06em;
  border-radius: 999px;
}

.sticker-foot {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 2.5px dashed rgba(10,10,10,0.35);
  font: 600 0.68rem var(--mono);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(10,10,10,0.7);
}
.wc {
  background: var(--ink); color: var(--bone);
  padding: 0.15rem 0.5rem; border-radius: 999px;
  letter-spacing: 0.05em;
}

/* ── Empty ───────────────────────────────── */
.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 1rem;
}
.empty-shape {
  width: 110px; height: 110px;
  margin: 0 auto 1.4rem;
  background: var(--yellow);
  border: 4px solid var(--ink);
  box-shadow: var(--hard-shadow-lg);
  transform: rotate(8deg);
  border-radius: 26% 74% 32% 68% / 56% 38% 62% 44%;
  animation: wiggle 4s ease-in-out infinite;
  --rot: 8deg;
}
.empty-title { font-family: var(--display); font-size: 2.5rem; color: var(--bone); }
.empty-sub { font-family: var(--mono); color: var(--fg-dim); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.4rem; }

/* ── Footer ──────────────────────────────── */
.foot { margin-top: 4rem; text-align: center; }
.foot-stripes {
  height: 18px;
  background: repeating-linear-gradient(
    -45deg,
    var(--pink) 0 14px,
    var(--yellow) 14px 28px,
    var(--cyan) 28px 42px,
    var(--mint) 42px 56px
  );
  border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink);
  margin-bottom: 1rem;
}
.foot p { font: 500 0.85rem var(--mono); color: var(--fg-dim); letter-spacing: 0.05em; }
.foot em { font-family: var(--display); color: var(--bone); font-style: normal; }
.foot .credit { margin-top: 0.4rem; font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--pink); }
.foot .credit em { color: var(--yellow); padding: 0 0.2em; }

/* ── Modal: index card ──────────────────── */
.overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(10, 6, 32, 0.78);
  backdrop-filter: blur(8px) saturate(1.2);
  display: flex; align-items: center; justify-content: center;
  padding: clamp(1rem, 4vh, 3rem);
  overflow-y: auto;
}
.card-modal {
  position: relative;
  width: 100%; max-width: 720px;
  background: var(--bone); color: var(--ink);
  border: 4px solid var(--ink);
  box-shadow: 14px 14px 0 var(--pink), 28px 28px 0 var(--ink);
  padding: 2.2rem 2.4rem 1.6rem;
  background-image:
    linear-gradient(to right, transparent 0, transparent 64px, rgba(255,61,127,0.4) 64px, rgba(255,61,127,0.4) 65px, transparent 66px),
    repeating-linear-gradient(transparent 0, transparent 31px, rgba(61,217,235,0.35) 31px, rgba(61,217,235,0.35) 32px);
}
@media (max-width: 600px) {
  .card-modal { padding: 1.4rem 1rem 1rem; box-shadow: 8px 8px 0 var(--pink), 16px 16px 0 var(--ink); }
  .card-holes { display: none; }
  .modal-head, .modal-form { padding-left: 0; }
  .modal-foot { justify-content: stretch; }
  .actions { width: 100%; justify-content: flex-end; }
  .actions .big-btn { flex: 1 1 auto; min-width: 0; }
}
@media (max-width: 380px) {
  .actions .big-btn { font-size: 0.78rem; padding: 0 0.7rem; }
}

.card-tape {
  position: absolute; top: -16px; left: 50%;
  width: 110px; height: 26px;
  background: rgba(255,210,63,0.85);
  border: 2px solid var(--ink);
  transform: translateX(-50%) rotate(-2deg);
  box-shadow: var(--hard-shadow-sm);
}

.card-holes {
  position: absolute; top: 0; bottom: 0; left: 18px;
  display: flex; flex-direction: column; justify-content: space-around;
  padding: 1.2rem 0;
}
.card-holes span {
  width: 14px; height: 14px;
  background: var(--void); border: 2px solid var(--ink);
  border-radius: 999px;
}

.modal-head {
  display: flex; justify-content: space-between; align-items: center;
  padding-left: 30px;
  margin-bottom: 0.8rem;
}
.modal-eyebrow {
  background: var(--ink); color: var(--yellow);
  padding: 0.3rem 0.8rem;
  font: 700 0.75rem var(--mono);
  letter-spacing: 0.18em;
}
.x {
  width: 38px; height: 38px;
  background: var(--pink); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font-size: 1rem; font-weight: 700;
  cursor: pointer;
  box-shadow: var(--hard-shadow-sm);
  transition: transform 200ms;
}
.x:hover { transform: rotate(90deg) scale(1.1); }

.modal-form { padding-left: 30px; display: flex; flex-direction: column; gap: 1rem; }

.title-line {
  width: 100%;
  background: transparent; border: 0; outline: 0;
  font: 700 clamp(1.6rem, 4vw, 2.4rem) var(--display);
  color: var(--ink);
  text-transform: lowercase;
  letter-spacing: -0.01em;
  padding: 0.2rem 0;
}
.title-line::placeholder { color: rgba(10,10,10,0.35); font-style: italic; }

.body-line {
  width: 100%;
  background: transparent; border: 0; outline: 0;
  font: 500 1rem/1.85 var(--body);
  color: var(--ink);
  resize: vertical; min-height: 220px;
}
.body-line::placeholder { color: rgba(10,10,10,0.4); }

.modal-row { display: flex; gap: 1.5rem; align-items: flex-end; flex-wrap: wrap; }
.field { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.3rem; }
.field span { font: 700 0.7rem var(--mono); letter-spacing: 0.16em; text-transform: uppercase; color: rgba(10,10,10,0.65); }
.field input {
  background: rgba(255,255,255,0.6);
  border: 2.5px solid var(--ink);
  height: 40px; padding: 0 0.7rem;
  font: 500 0.9rem var(--mono); color: var(--ink);
  outline: 0; border-radius: 8px;
}
.field input:focus { background: var(--yellow); }

.bigtoggles { display: flex; gap: 0.5rem; }
.tog {
  display: inline-flex; align-items: center; gap: 0.35rem;
  height: 40px; padding: 0 0.9rem;
  border: 2.5px solid var(--ink);
  background: var(--bone); color: var(--ink);
  border-radius: 999px;
  font: 700 0.78rem var(--mono);
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; user-select: none;
}
.tog input { display: none; }
.tog.on { background: var(--ink); color: var(--yellow); }

.modal-foot {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 0.8rem;
  padding-top: 0.6rem;
  border-top: 3px dashed var(--ink);
}
.wc-pill {
  background: var(--mint); color: var(--ink);
  padding: 0.3rem 0.7rem;
  border: 2.5px solid var(--ink);
  border-radius: 999px;
  font: 700 0.78rem var(--mono); letter-spacing: 0.08em;
}
.actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.actions .big-btn { height: 44px; padding: 0 1rem; font-size: 0.85rem; box-shadow: var(--hard-shadow-sm); }
.actions .big-btn:hover { box-shadow: 5px 5px 0 var(--ink); }
.actions .big-btn.ghost { color: var(--ink); border-color: var(--ink); box-shadow: 3px 3px 0 var(--pink); }
.actions .big-btn.ghost:hover { background: var(--ink); color: var(--bone); }
.actions .big-btn.ghost.danger { box-shadow: 3px 3px 0 var(--pink); }
.actions .big-btn.ghost.danger:hover { background: var(--pink); color: var(--bone); border-color: var(--ink); }
`;
