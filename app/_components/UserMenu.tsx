'use client';

import { useEffect, useRef, useState } from 'react';

type Session = { user?: { id: string; name?: string | null; email?: string | null; image?: string | null } } | null;

export default function UserMenu() {
  const [session, setSession] = useState<Session>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/session').then((r) => r.json()).then(setSession).catch(() => setSession(null));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!session?.user) return null;
  const u = session.user;
  const initials =
    (u.name || u.email || '?')
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || '?';

  return (
    <div className="usermenu" ref={ref}>
      <style>{styles}</style>
      <button className="avatar" onClick={() => setOpen((v) => !v)} aria-label="Account menu">
        {u.image ? <img src={u.image} alt="" /> : <span>{initials}</span>}
      </button>

      {open && (
        <div className="menu">
          <div className="menu-head">
            <div className="menu-name">{u.name || 'Anonymous'}</div>
            <div className="menu-email">{u.email}</div>
          </div>
          <a className="menu-item" href="/api/export">⤓ Export all notes</a>
          <a className="menu-item" href="/settings">⚙ Settings</a>
          <form action="/api/auth/signout" method="post" className="menu-form">
            <button type="submit" className="menu-item danger">↪ Sign out</button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = `
.usermenu { position: relative; }
.avatar {
  width: 44px; height: 44px;
  border-radius: 999px;
  border: 3px solid var(--ink);
  background: var(--cyan);
  color: var(--ink);
  cursor: pointer;
  font: 700 0.85rem var(--mono);
  letter-spacing: 0.05em;
  box-shadow: 4px 4px 0 var(--ink);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  transition: transform 160ms;
}
.avatar:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--ink); }
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.menu {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 240px;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  box-shadow: 6px 6px 0 var(--pink), 12px 12px 0 var(--ink);
  z-index: 50;
  padding: 0.5rem;
}
.menu-head {
  padding: 0.6rem 0.7rem 0.7rem;
  border-bottom: 2px dashed var(--ink);
  margin-bottom: 0.4rem;
}
.menu-name { font: 700 0.95rem var(--display); }
.menu-email { font: 500 0.72rem var(--mono); color: rgba(10,10,10,0.6); margin-top: 0.15rem; word-break: break-all; }
.menu-item {
  display: block; width: 100%;
  padding: 0.55rem 0.7rem;
  background: transparent; color: var(--ink);
  border: 0; text-align: left;
  font: 600 0.82rem var(--body);
  cursor: pointer;
  text-decoration: none;
  border-radius: 4px;
}
.menu-item:hover { background: var(--yellow); }
.menu-item.danger { color: var(--pink); }
.menu-item.danger:hover { background: var(--pink); color: var(--bone); }
.menu-form { display: contents; }
`;
