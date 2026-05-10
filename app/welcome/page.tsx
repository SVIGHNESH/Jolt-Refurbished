'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const styles = `
.hero-root {
  position: relative;
  z-index: 2;
  min-height: 100svh;
  padding: 20px clamp(16px, 3vw, 40px) 80px;
  color: var(--fg);
  max-width: 1280px;
  margin: 0 auto;
}

/* TOP BAR */
.hero-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border: 4px solid var(--ink);
  background: var(--bone);
  color: var(--ink);
  box-shadow: var(--hard-shadow);
  border-radius: 6px;
}
.hero-mark {
  position: relative;
  font-family: var(--display);
  font-size: clamp(20px, 2.6vw, 30px);
  letter-spacing: 1px;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
}
.hero-mark-word {
  color: var(--ink);
  text-shadow: 3px 3px 0 var(--pink);
}
.hero-mark .slash {
  font-family: var(--mono);
  font-size: 0.55em;
  letter-spacing: 2px;
  color: var(--ink);
  background: var(--yellow);
  padding: 4px 8px;
  border: 2px solid var(--ink);
  border-radius: 4px;
  align-self: center;
}

.hero-bar-cta {
  font-family: var(--display);
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--ink);
  background: var(--cyan);
  border: 3px solid var(--ink);
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: var(--hard-shadow-sm);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.hero-bar-cta:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--ink); }
.hero-bar-cta:active { transform: translate(0, 0); box-shadow: var(--hard-shadow-sm); }

.kbd {
  font-family: var(--mono);
  font-size: 11px;
  background: var(--bone);
  color: var(--ink);
  border: 2px solid var(--ink);
  padding: 2px 7px;
  border-radius: 4px;
  line-height: 1;
}

/* TICKER */
.hero-ticker {
  margin: 18px 0 40px;
  background: var(--yellow);
  color: var(--ink);
  border: 3px solid var(--ink);
  box-shadow: var(--hard-shadow);
  overflow: hidden;
  border-radius: 6px;
  transform: rotate(-0.6deg);
}
.hero-ticker-track { display: flex; width: max-content; animation: ticker 40s linear infinite; }
.hero-ticker-row { display: flex; gap: 32px; padding: 10px 16px; flex-shrink: 0; }
.hero-ticker-item {
  font-family: var(--display);
  font-size: 14px;
  letter-spacing: 2px;
  white-space: nowrap;
}

/* GRID */
.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
}
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
}

.hero-eyebrow {
  display: inline-block;
  font-family: var(--mono);
  letter-spacing: 3px;
  font-size: 12px;
  padding: 6px 10px;
  background: var(--lavender);
  color: var(--ink);
  border: 2px solid var(--ink);
  border-radius: 4px;
  box-shadow: var(--hard-shadow-sm);
}

.hero-title {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  font-family: var(--display);
  line-height: 0.92;
}
.hero-title .row {
  position: relative;
  display: inline-block;
  font-size: clamp(54px, 9vw, 132px);
  line-height: 0.92;
}
.hero-title .shade {
  position: absolute;
  left: 0; top: 0;
  font-family: var(--shade);
  color: var(--pink);
  transform: translate(6px, 6px);
  pointer-events: none;
  z-index: 0;
  white-space: nowrap;
}
.hero-title .shade.cyan { color: var(--cyan); }
.hero-title .front {
  position: relative;
  color: var(--bone);
  -webkit-text-stroke: 2px var(--ink);
  z-index: 1;
}
.hero-title .front.yellow { color: var(--yellow); }

.hero-lede {
  margin-top: 24px;
  max-width: 52ch;
  font-size: clamp(15px, 1vw + 0.4rem, 18px);
  color: var(--fg);
  line-height: 1.6;
}
.hero-lede em { font-style: italic; color: var(--yellow); }

.hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }

.hero-btn {
  font-family: var(--display);
  letter-spacing: 1.2px;
  font-size: 15px;
  padding: 14px 20px;
  border: 3px solid var(--ink);
  border-radius: 999px;
  color: var(--ink);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--bone);
  box-shadow: var(--hard-shadow);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.hero-btn.pink { background: var(--pink); color: var(--bone); }
.hero-btn.pink .kbd { background: var(--bone); }
.hero-btn:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink); }
.hero-btn:active { transform: translate(0, 0); box-shadow: var(--hard-shadow); }
.hero-btn:focus-visible { outline: 3px solid var(--yellow); outline-offset: 3px; }

.hero-meta {
  margin-top: 30px;
  list-style: none;
  padding: 0;
  display: grid;
  gap: 10px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--fg-dim);
}
.hero-meta li {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  list-style: none;
}
.hero-meta .dot {
  width: 11px; height: 11px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  display: inline-block;
}
.hero-meta .dot.pink   { background: var(--pink); }
.hero-meta .dot.cyan   { background: var(--cyan); }
.hero-meta .dot.yellow { background: var(--yellow); }

/* STAGE */
.hero-stage {
  position: relative;
  min-height: 480px;
  height: 100%;
}
.hero-sticker {
  position: absolute;
  width: 60%;
  padding: 18px 18px 16px;
  border: 4px solid var(--ink);
  border-radius: 8px;
  color: var(--ink);
  box-shadow: var(--hard-shadow-lg);
  font-family: var(--body);
}
.hero-sticker.s1 { top: 2%;  left: 2%;  background: var(--mint); }
.hero-sticker.s2 { top: 30%; right: 0%; background: var(--lavender); }
.hero-sticker.s3 { bottom: 2%; left: 16%; background: var(--pink); color: var(--bone); }

.hero-tape {
  position: absolute;
  top: -14px; left: 50%;
  width: 90px; height: 22px;
  background: rgba(252, 244, 228, 0.78);
  border: 1px solid rgba(10,10,10,0.25);
  transform: translateX(-50%) rotate(-2deg);
}
.hero-dogear {
  position: absolute;
  top: 0; right: 0;
  width: 26px; height: 26px;
  background: var(--ink);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
.hero-folio {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 2px;
  opacity: 0.85;
}
.hero-sticker-title {
  margin-top: 6px;
  font-family: var(--display);
  font-size: clamp(18px, 2vw, 24px);
  letter-spacing: 1px;
}
.hero-sticker-body { margin-top: 10px; font-size: 14px; line-height: 1.45; }
.hero-sticker-foot {
  margin-top: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 2px dashed currentColor;
  padding-top: 10px;
}
.hero-pill {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  padding: 3px 8px;
  border: 2px solid var(--ink);
  background: var(--bone);
  color: var(--ink);
  border-radius: 999px;
}
.hero-ribbon {
  position: absolute;
  top: 18px; right: -36px;
  background: var(--yellow);
  color: var(--ink);
  font-family: var(--display);
  font-size: 11px;
  letter-spacing: 2px;
  padding: 4px 36px;
  transform: rotate(35deg);
  border-top: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
}

.hero-floater {
  position: absolute;
  font-family: var(--display);
  font-size: 30px;
  width: 56px; height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--ink);
  border-radius: 999px;
  background: var(--yellow);
  color: var(--ink);
  box-shadow: var(--hard-shadow-sm);
}
.hero-floater.plus    { top: -3%; right: 18%; background: var(--cyan); }
.hero-floater.star    { bottom: 12%; right: -3%; background: var(--tangerine); color: var(--bone); }
.hero-floater.diamond { top: 50%; left: -4%; background: var(--bone); }

@media (max-width: 900px) {
  .hero-stage { min-height: 520px; margin-top: 24px; }
  .hero-sticker { width: 70%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-ticker-track { animation: none; }
}

/* FOOTER */
.hero-foot {
  margin-top: 64px;
  padding: 18px 20px;
  background: var(--bone);
  color: var(--ink);
  border: 4px solid var(--ink);
  border-radius: 8px;
  box-shadow: var(--hard-shadow);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  transform: rotate(-0.4deg);
}
.hero-foot-stamp {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 3px;
  background: var(--ink);
  color: var(--yellow);
  padding: 4px 10px;
  border-radius: 4px;
}
.hero-foot-name {
  font-family: var(--display);
  font-size: clamp(16px, 1.6vw, 22px);
  letter-spacing: 1.5px;
  color: var(--ink);
}
.hero-foot-rule {
  flex: 1;
  min-width: 24px;
  height: 0;
  border-top: 2px dashed rgba(10, 10, 10, 0.45);
}
.hero-foot-links {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
}
.hero-foot-link {
  font-family: var(--display);
  font-size: 12px;
  letter-spacing: 1.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 3px solid var(--ink);
  border-radius: 999px;
  text-decoration: none;
  background: var(--bone);
  color: var(--ink);
  box-shadow: var(--hard-shadow-sm);
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}
.hero-foot-link.gh:hover { background: var(--lavender); }
.hero-foot-link.li:hover { background: var(--cyan); }
.hero-foot-link.x:hover  { background: var(--yellow); }
.hero-foot-link:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--ink); }
.hero-foot-link:active { transform: translate(0, 0); box-shadow: var(--hard-shadow-sm); }
.hero-foot-link:focus-visible { outline: 3px solid var(--pink); outline-offset: 3px; }
.hero-foot-link svg { display: block; }

@media (max-width: 600px) {
  .hero-foot { gap: 10px; }
  .hero-foot-rule { display: none; }
}
`;

export default function WelcomePage() {
  const reduce = useReducedMotion();

  const pop = (i: number, rot: number) => ({
    initial: { opacity: 0, y: 24, scale: 0.9, rotate: rot },
    animate: { opacity: 1, y: 0, scale: 1, rotate: rot },
    transition: reduce
      ? { duration: 0.01 }
      : { type: 'spring' as const, stiffness: 220, damping: 18, delay: 0.05 * i },
  });

  return (
    <main className="hero-root">
      <header className="hero-bar">
        <div className="hero-mark">
          <span className="hero-mark-word">JOLT</span>
        </div>
        <Link href="/login" className="hero-bar-cta">
          <span>SIGN IN</span>
          <span className="kbd">↵</span>
        </Link>
      </header>

      <div className="hero-ticker" aria-hidden>
        <div className="hero-ticker-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div className="hero-ticker-row" key={k}>
              {['◆ STICKY THOUGHTS', '✺ LOUD ON PURPOSE', '★ NO MINIMALISM HERE',
                '✦ CANDY ON VOID', '◆ PIN IT · TAG IT · SHIP IT', '✺ BRING SNACKS'].map((t, i) => (
                <span key={`${k}-${i}`} className="hero-ticker-item">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="hero-grid">
        <div>
          <motion.span className="hero-eyebrow" {...pop(0, 0)}>
            ✺ NEW ISSUE · VOL.88
          </motion.span>

          <h1 className="hero-title">
            <motion.span className="row" {...pop(1, -1.2)}>
              <span className="shade">NOTES</span>
              <span className="front">NOTES</span>
            </motion.span>
            <motion.span className="row" {...pop(2, 1.2)}>
              <span className="shade cyan">THAT</span>
              <span className="front yellow">THAT</span>
            </motion.span>
            <motion.span className="row" {...pop(3, -0.6)}>
              <span className="shade">SHOUT.</span>
              <span className="front">SHOUT.</span>
            </motion.span>
          </h1>

          <motion.p className="hero-lede" {...pop(4, 0)}>
            A sticker-board notebook for chaotic-good thinkers. Pin the loud
            ones, hashtag the rest, and let the Memphis grain do the rest.
            {' '}<em>No minimalism. No apologies.</em>
          </motion.p>

          <motion.div className="hero-ctas" {...pop(5, 0)}>
            <Link href="/login" className="hero-btn pink">
              <span>START SCRIBBLING</span>
              <span className="kbd">↵</span>
            </Link>
            <Link href="/login" className="hero-btn">
              <span>SIGN IN</span>
              <span className="kbd">↓</span>
            </Link>
          </motion.div>

          <motion.ul className="hero-meta" {...pop(6, 0)}>
            <li><span className="dot pink" /> PIN · FAVORITE · TAG</li>
            <li><span className="dot cyan" /> EXPORT TO MARKDOWN</li>
            <li><span className="dot yellow" /> SIGN IN WITH GOOGLE OR GITHUB</li>
          </motion.ul>
        </div>

        <div className="hero-stage" aria-hidden>
          <motion.div className="hero-sticker s1" {...pop(2, -6)}>
            <div className="hero-tape" />
            <div className="hero-folio">№ 001</div>
            <div className="hero-sticker-title">GROCERIES</div>
            <p className="hero-sticker-body">milk · ramen · ramen · ramen · highlighters (yellow only)</p>
            <div className="hero-sticker-foot">
              <span className="hero-pill">#weeknight</span>
              <span className="hero-pill">#fuel</span>
            </div>
          </motion.div>

          <motion.div className="hero-sticker s2" {...pop(3, 4)}>
            <div className="hero-tape" />
            <div className="hero-folio">№ 014</div>
            <div className="hero-sticker-title">SONG IDEA</div>
            <p className="hero-sticker-body">a synth that sounds like a vending machine confessing.</p>
            <div className="hero-sticker-foot">
              <span className="hero-pill">#demo</span>
              <span className="hero-pill">#3am</span>
            </div>
          </motion.div>

          <motion.div className="hero-sticker s3" {...pop(4, -3)}>
            <div className="hero-tape" />
            <div className="hero-dogear" />
            <div className="hero-folio">№ 088</div>
            <div className="hero-sticker-title">PIN ME</div>
            <p className="hero-sticker-body">stuff i refuse to forget. ever. seriously.</p>
            <div className="hero-sticker-foot">
              <span className="hero-pill">#pinned</span>
              <span className="hero-pill">#loud</span>
            </div>
            <div className="hero-ribbon">PINNED</div>
          </motion.div>

          <motion.div className="hero-floater plus" {...pop(5, 12)}>+</motion.div>
          <motion.div className="hero-floater star" {...pop(6, -16)}>✺</motion.div>
          <motion.div className="hero-floater diamond" {...pop(7, 24)}>◆</motion.div>
        </div>
      </section>

      <footer className="hero-foot">
        <span className="hero-foot-stamp">A THING BY</span>
        <span className="hero-foot-name">VIGHNESH SHUKLA</span>
        <span className="hero-foot-rule" aria-hidden />
        <nav className="hero-foot-links" aria-label="Creator links">
          <a
            className="hero-foot-link gh"
            href="https://github.com/SVIGHNESH"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.18 1.18a11.07 11.07 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.74.12 3.03.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span>GITHUB</span>
          </a>
          <a
            className="hero-foot-link li"
            href="https://www.linkedin.com/in/vighnesh0/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
            <span>LINKEDIN</span>
          </a>
          <a
            className="hero-foot-link x"
            href="https://x.com/vighneshshukla0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2H21.5l-7.51 8.59L23 22h-6.91l-5.41-7.07L4.4 22H1.14l8.04-9.2L1 2h7.07l4.89 6.46L18.244 2zm-2.42 18h1.91L7.27 4H5.23l10.594 16z" />
            </svg>
            <span>X</span>
          </a>
        </nav>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </main>
  );
}
