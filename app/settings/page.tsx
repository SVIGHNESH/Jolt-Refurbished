import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { notes, tags, categories } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import DangerZone from './DangerZone';

export const metadata = { title: 'JOLT — Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/settings');
  const u = session.user;

  const [[noteCount], [tagCount], [catCount]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(notes).where(eq(notes.userId, u.id)),
    db.select({ n: sql<number>`count(*)::int` }).from(tags).where(eq(tags.userId, u.id)),
    db.select({ n: sql<number>`count(*)::int` }).from(categories).where(eq(categories.userId, u.id)),
  ]);

  const initials =
    (u.name || u.email || '?')
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('') || '?';

  return (
    <main className="settings">
      <style>{styles}</style>

      <header className="hd">
        <a href="/" className="back">← back to the board</a>
        <h1 className="title">
          <span className="shade">SETTINGS</span>
          <span className="front">SETTINGS</span>
        </h1>
      </header>

      {/* ── Profile ─────────────────────── */}
      <section className="card hue-cyan">
        <span className="badge">▣ profile</span>
        <div className="profile">
          <div className="avatar-big">
            {u.image ? <img src={u.image} alt="" /> : <span>{initials}</span>}
          </div>
          <div className="profile-text">
            <div className="profile-name">{u.name || 'Anonymous'}</div>
            <div className="profile-email">{u.email}</div>
          </div>
        </div>
        <div className="stats">
          <Stat label="notes"      value={noteCount?.n ?? 0} />
          <Stat label="tags"       value={tagCount?.n ?? 0}  />
          <Stat label="categories" value={catCount?.n ?? 0}  />
        </div>
      </section>

      {/* ── Export ──────────────────────── */}
      <section className="card hue-yellow">
        <span className="badge">⤓ export</span>
        <h2 className="card-title">take your stuff with you</h2>
        <p className="card-body">
          Download every note as a zip. JSON for re-importing, Markdown for reading
          in any editor (Obsidian, iA Writer, etc.).
        </p>
        <a href="/api/export" className="big-btn pink">⤓ export all notes (.zip)</a>
      </section>

      {/* ── Danger Zone ─────────────────── */}
      <DangerZone hasNotes={(noteCount?.n ?? 0) > 0} />

      <footer className="foot">
        <p>jolt — keep it loud</p>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <div className="stat-num">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

const styles = `
.settings {
  position: relative; z-index: 2;
  max-width: 760px; margin: 0 auto;
  padding: 1.5rem clamp(1rem, 4vw, 2.5rem) 5rem;
}
.hd { margin-bottom: 1.8rem; }
.back {
  display: inline-block;
  font: 700 0.78rem var(--mono);
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--bone);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  background: var(--ink);
  border: 2.5px solid var(--ink);
  box-shadow: 3px 3px 0 var(--pink);
  margin-bottom: 1rem;
  transition: transform 160ms;
}
.back:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--pink); }

.title {
  position: relative; display: inline-block;
  font-family: var(--display);
  font-size: clamp(2.6rem, 9vw, 5rem); line-height: 0.9;
}
.title .shade { position: absolute; inset: 0; font-family: var(--shade); color: var(--pink); transform: translate(7px, 6px); z-index: -1; }
.title .front {
  background: linear-gradient(180deg, var(--bone) 0%, var(--bone) 50%, var(--cyan) 50%, var(--yellow) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2.5px var(--ink);
}

.card {
  position: relative;
  background: var(--card-bg, var(--cyan));
  color: var(--ink);
  border: 4px solid var(--ink);
  padding: 1.6rem 1.5rem 1.4rem;
  box-shadow: 8px 8px 0 var(--ink);
  margin-bottom: 1.6rem;
}
.hue-cyan { --card-bg: var(--cyan); }
.hue-yellow { --card-bg: var(--yellow); }
.hue-pink { --card-bg: var(--pink); }

.badge {
  display: inline-block;
  background: var(--ink); color: var(--bone);
  padding: 0.3rem 0.7rem;
  font: 700 0.72rem var(--mono);
  letter-spacing: 0.18em;
  margin-bottom: 0.9rem;
}
.hue-pink .badge { color: var(--yellow); }

.card-title {
  font: 600 1.5rem var(--display);
  text-transform: lowercase;
  margin-bottom: 0.5rem;
  color: var(--ink);
}
.card-body {
  font: 500 0.95rem/1.6 var(--body);
  color: rgba(10,10,10,0.85);
  margin-bottom: 1.1rem;
  max-width: 56ch;
}

.profile { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.avatar-big {
  width: 64px; height: 64px;
  border: 3px solid var(--ink);
  border-radius: 999px;
  background: var(--bone);
  display: inline-flex; align-items: center; justify-content: center;
  font: 700 1.2rem var(--mono);
  overflow: hidden;
  box-shadow: 4px 4px 0 var(--ink);
}
.avatar-big img { width: 100%; height: 100%; object-fit: cover; }
.profile-name { font: 700 1.3rem var(--display); }
.profile-email { font: 500 0.85rem var(--mono); color: rgba(10,10,10,0.7); margin-top: 0.15rem; word-break: break-all; }

.stats { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.stat {
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  padding: 0.7rem 1rem;
  min-width: 90px;
  text-align: center;
}
.stat-num { font: 700 1.6rem var(--display); line-height: 1; }
.stat-lbl { font: 600 0.7rem var(--mono); letter-spacing: 0.14em; text-transform: uppercase; color: rgba(10,10,10,0.7); margin-top: 0.2rem; }

.big-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  height: 50px; padding: 0 1.2rem;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font: 700 0.9rem var(--display);
  letter-spacing: 0.02em; text-transform: lowercase;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 5px 5px 0 var(--ink);
  transition: transform 160ms, box-shadow 160ms, background 160ms;
}
.big-btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink); }
.big-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.big-btn.pink { background: var(--pink); }
.big-btn.pink:hover { background: var(--ink); color: var(--pink); }

.foot {
  text-align: center; margin-top: 3rem;
  font: 600 0.75rem var(--mono); letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(252,244,228,0.5);
}
`;
