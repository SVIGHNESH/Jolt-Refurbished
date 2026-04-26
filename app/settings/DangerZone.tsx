'use client';

import { useState } from 'react';

const PHRASE = 'DELETE my account';

export default function DangerZone({ hasNotes }: { hasNotes: boolean }) {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState(!hasNotes);
  const [phrase, setPhrase] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canDelete = exported && phrase === PHRASE;

  const onExport = () => {
    // Trigger download in a hidden tab; mark as exported once clicked.
    window.open('/api/export', '_blank');
    setExported(true);
  };

  const onDelete = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: phrase }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete account');
      }
      window.location.href = '/login?deleted=1';
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong');
      setBusy(false);
    }
  };

  return (
    <section className="card hue-pink">
      <style>{styles}</style>
      <span className="badge">⚠ danger zone</span>
      <h2 className="card-title">delete account</h2>
      <p className="card-body">
        This wipes <strong>everything</strong> — every note, tag, category, and your
        login. It cannot be undone. Download your data first.
      </p>

      {!open ? (
        <button className="big-btn ghost-danger" onClick={() => setOpen(true)}>
          ✕ delete my account
        </button>
      ) : (
        <div className="dz">
          <ol className="dz-steps">
            <li className={exported ? 'done' : ''}>
              <span className="step-n">1</span>
              <div className="step-body">
                <div className="step-title">download your data</div>
                {!hasNotes && <div className="step-hint">no notes to export — skip ahead</div>}
                {hasNotes && (
                  <button type="button" className="big-btn" onClick={onExport}>
                    {exported ? '✓ downloaded — re-download' : '⤓ export now'}
                  </button>
                )}
              </div>
            </li>
            <li className={canDelete ? 'done' : ''}>
              <span className="step-n">2</span>
              <div className="step-body">
                <div className="step-title">type <code>{PHRASE}</code> to confirm</div>
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder={PHRASE}
                  disabled={!exported}
                  className="confirm-input"
                  autoComplete="off"
                />
              </div>
            </li>
          </ol>

          {err && <div className="dz-err">⚠ {err}</div>}

          <div className="dz-actions">
            <button type="button" className="big-btn" onClick={() => { setOpen(false); setPhrase(''); setErr(null); }}>
              cancel
            </button>
            <button
              type="button"
              className="big-btn final-danger"
              disabled={!canDelete || busy}
              onClick={onDelete}
            >
              {busy ? 'deleting…' : '✕ delete forever'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = `
.big-btn.ghost-danger {
  background: var(--ink); color: var(--pink);
  box-shadow: 5px 5px 0 var(--bone);
}
.big-btn.ghost-danger:hover { background: var(--pink); color: var(--ink); box-shadow: 7px 7px 0 var(--bone); }

.dz { background: var(--ink); color: var(--bone); padding: 1.2rem; border: 3px solid var(--ink); }
.dz-steps { list-style: none; padding: 0; margin: 0 0 1rem; display: flex; flex-direction: column; gap: 1rem; }
.dz-steps li {
  display: flex; gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(252,244,228,0.06);
  border: 2px dashed rgba(252,244,228,0.25);
}
.dz-steps li.done { border-color: var(--mint); background: rgba(124,227,161,0.08); }
.step-n {
  flex-shrink: 0;
  width: 32px; height: 32px;
  background: var(--yellow); color: var(--ink);
  border: 2.5px solid var(--ink);
  border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  font: 700 0.95rem var(--display);
}
.dz-steps li.done .step-n { background: var(--mint); }
.step-body { flex: 1; min-width: 0; }
.step-title { font: 600 0.95rem var(--body); margin-bottom: 0.5rem; }
.step-title code {
  background: var(--pink); color: var(--ink);
  padding: 0.05rem 0.4rem;
  font: 700 0.85rem var(--mono);
}
.step-hint { font: 500 0.78rem var(--mono); color: rgba(252,244,228,0.6); letter-spacing: 0.06em; }

.confirm-input {
  width: 100%;
  background: var(--bone); color: var(--ink);
  border: 2.5px solid var(--ink);
  height: 40px; padding: 0 0.8rem;
  font: 500 0.9rem var(--mono);
  outline: 0;
  border-radius: 6px;
}
.confirm-input:disabled { opacity: 0.4; }

.dz-err {
  background: var(--pink); color: var(--bone);
  padding: 0.5rem 0.8rem;
  border: 2px solid var(--bone);
  font: 600 0.78rem var(--mono);
  margin-bottom: 0.8rem;
}

.dz-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.dz-actions .big-btn { background: var(--bone); color: var(--ink); height: 44px; }
.big-btn.final-danger { background: var(--pink); color: var(--ink); }
.big-btn.final-danger:hover:not(:disabled) { background: var(--bone); }
.big-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: 3px 3px 0 var(--ink); transform: none; }
`;
