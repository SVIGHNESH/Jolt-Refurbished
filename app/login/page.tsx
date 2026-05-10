import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { limiters } from '@/lib/ratelimit';

export const metadata = { title: 'JOLT — Sign in' };

const ERROR_MESSAGES: Record<string, string> = {
  'rate-limited':         '⚠ too many tries — wait an hour and try again',
  'missing-email':        '⚠ enter an email to continue',
  Configuration:          '⚠ sign-in is mis-configured on the server. try again in a minute.',
  AccessDenied:           '⚠ access denied — your account isn’t allowed to sign in',
  Verification:           '⚠ that magic link expired or was already used. send a new one below.',
  OAuthAccountNotLinked:  '⚠ this email is already in use with a different sign-in method. use the original one (the same email but a different provider) and you’ll be linked automatically.',
  OAuthSignin:            '⚠ couldn’t start the sign-in flow with that provider. try again.',
  OAuthCallback:          '⚠ the provider rejected the sign-in mid-flow. try again.',
  OAuthCreateAccount:     '⚠ couldn’t create your account from that provider. try a different sign-in method.',
  EmailCreateAccount:     '⚠ couldn’t create your account from that email. try a different sign-in method.',
  EmailSignin:            '⚠ couldn’t send the magic link. check the address and try again.',
  Callback:               '⚠ the sign-in handshake failed. try again.',
  SessionRequired:        '⚠ please sign in to continue',
  Default:                '⚠ couldn’t sign you in — try again',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string; deleted?: string };
}) {
  const next = searchParams?.next || '/';
  const err = searchParams?.error;
  const deleted = searchParams?.deleted === '1';
  const errMsg = err ? (ERROR_MESSAGES[err] ?? ERROR_MESSAGES.Default) : null;

  async function withGoogle()  { 'use server'; await signIn('google', { redirectTo: next }); }
  async function withGitHub()  { 'use server'; await signIn('github', { redirectTo: next }); }
  async function withEmail(form: FormData) {
    'use server';
    const email = String(form.get('email') || '').trim().toLowerCase();
    if (!email) redirect(`/login?error=missing-email&next=${encodeURIComponent(next)}`);

    const h = headers();
    const ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      'unknown';

    if (limiters.magicMail) {
      const r = await limiters.magicMail.limit(email);
      if (!r.success) redirect(`/login?error=rate-limited&next=${encodeURIComponent(next)}`);
    }
    if (limiters.magicIp) {
      const r = await limiters.magicIp.limit(ip);
      if (!r.success) redirect(`/login?error=rate-limited&next=${encodeURIComponent(next)}`);
    }

    await signIn('resend', { email, redirectTo: next });
  }

  return (
    <main className="login">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="card">
        <div className="card-tape" />
        <header className="hd">
          <span className="eyebrow">★ welcome ★</span>
          <h1 className="mark">
            <span className="shade">JOLT</span>
            <span className="front">JOLT</span>
          </h1>
          <p className="sub">sign in to slap notes on the board</p>
        </header>

        {deleted && (
          <div className="info">✓ your account was deleted. you can sign back up below.</div>
        )}
        {errMsg && <div className="err">{errMsg}</div>}

        <div className="oauth">
          <form action={withGoogle}>
            <button type="submit" className="big-btn google">
              <span className="g">G</span> continue with google
            </button>
          </form>
          <form action={withGitHub}>
            <button type="submit" className="big-btn github">
              <span className="g">▲</span> continue with github
            </button>
          </form>
        </div>

        <p className="legal">pick a provider above. you'll be back here in a blink.</p>
        <p className="credit">a thing by <em>Vighnesh Shukla</em></p>
      </div>
    </main>
  );
}

const styles = `
.login {
  position: relative; z-index: 2;
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem 1rem;
}
.card {
  position: relative;
  width: 100%; max-width: 460px;
  background: var(--bone); color: var(--ink);
  border: 4px solid var(--ink);
  padding: 2.4rem 2rem 1.6rem;
  box-shadow: 14px 14px 0 var(--cyan), 28px 28px 0 var(--ink);
  background-image: repeating-linear-gradient(transparent 0, transparent 31px, rgba(184,164,255,0.35) 31px, rgba(184,164,255,0.35) 32px);
}
.card-tape {
  position: absolute; top: -16px; left: 50%;
  width: 110px; height: 26px;
  background: rgba(255,210,63,0.85);
  border: 2px solid var(--ink);
  transform: translateX(-50%) rotate(-2deg);
  box-shadow: 3px 3px 0 var(--ink);
}
.hd { text-align: center; margin-bottom: 1.4rem; }
.eyebrow {
  display: inline-block;
  background: var(--ink); color: var(--yellow);
  padding: 0.3rem 0.8rem;
  font: 700 0.7rem var(--mono);
  letter-spacing: 0.18em;
}
.mark { position: relative; font-family: var(--display); font-size: clamp(3rem, 12vw, 5rem); line-height: 0.9; margin: 0.6rem 0 0.3rem; display: inline-block; }
.mark .shade { position: absolute; inset: 0; font-family: var(--shade); color: var(--pink); transform: translate(6px, 5px); z-index: -1; }
.mark .front {
  background: linear-gradient(180deg, var(--ink) 0%, var(--ink) 50%, var(--cyan) 50%, var(--tangerine) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 2.5px var(--ink);
}
.sub { font: 500 0.95rem var(--body); color: rgba(10,10,10,0.7); }

.err {
  background: var(--pink); color: var(--bone);
  padding: 0.6rem 0.8rem; border: 2.5px solid var(--ink);
  font: 600 0.8rem/1.45 var(--body); letter-spacing: 0.01em;
  margin-bottom: 1rem; box-shadow: 3px 3px 0 var(--ink);
}
.info {
  background: var(--mint); color: var(--ink);
  padding: 0.6rem 0.8rem; border: 2.5px solid var(--ink);
  font: 600 0.82rem/1.45 var(--body);
  margin-bottom: 1rem; box-shadow: 3px 3px 0 var(--ink);
}

.oauth { display: flex; flex-direction: column; gap: 0.6rem; }
.oauth form { display: contents; }
.big-btn {
  width: 100%;
  display: inline-flex; align-items: center; justify-content: center; gap: 0.7rem;
  height: 52px; padding: 0 1rem;
  background: var(--bone); color: var(--ink);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font: 700 0.9rem var(--display);
  letter-spacing: 0.02em; text-transform: lowercase;
  cursor: pointer;
  box-shadow: 5px 5px 0 var(--ink);
  transition: transform 160ms, box-shadow 160ms, background 160ms;
}
.big-btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink); }
.big-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.big-btn.google:hover { background: var(--mint); }
.big-btn.github:hover { background: var(--lavender); }
.big-btn.pink { background: var(--pink); }
.big-btn.pink:hover { background: var(--yellow); }
.big-btn .g {
  width: 28px; height: 28px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 2px solid var(--ink); border-radius: 999px;
  font-family: var(--display); font-size: 0.9rem;
  background: var(--yellow);
}
.big-btn.github .g { background: var(--cyan); }
.big-btn.pink .g { background: var(--bone); }

.or {
  position: relative;
  text-align: center;
  margin: 1.2rem 0;
  font: 700 0.7rem var(--mono);
  letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(10,10,10,0.5);
}
.or::before, .or::after {
  content: ''; position: absolute; top: 50%;
  width: 38%; height: 2px; background: var(--ink); opacity: 0.5;
}
.or::before { left: 0; }
.or::after { right: 0; }
.or span { background: var(--bone); padding: 0 0.6rem; position: relative; }

.email { display: flex; flex-direction: column; gap: 0.5rem; }
.email input {
  height: 48px; padding: 0 1rem;
  background: rgba(255,255,255,0.7);
  border: 3px solid var(--ink);
  border-radius: 999px;
  font: 500 0.95rem var(--body);
  color: var(--ink);
  outline: 0;
  box-shadow: 4px 4px 0 var(--pink);
}
.email input:focus { background: var(--yellow); box-shadow: 4px 4px 0 var(--ink); }
.email input::placeholder { color: rgba(10,10,10,0.4); }

.legal {
  margin-top: 1.1rem; text-align: center;
  font: 500 0.72rem var(--mono); letter-spacing: 0.08em;
  color: rgba(10,10,10,0.55);
}
.credit {
  margin-top: 1.2rem; text-align: center;
  padding-top: 0.9rem;
  border-top: 2px dashed rgba(10,10,10,0.2);
  font: 700 0.7rem var(--mono);
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--pink);
}
.credit em {
  font-family: var(--display);
  font-style: normal;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: var(--yellow);
  padding: 0.05rem 0.4rem;
  margin-left: 0.3em;
  border: 2px solid var(--ink);
  display: inline-block;
  transform: rotate(-1deg);
}
`;
