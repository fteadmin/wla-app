import { useState } from "react";
import { LogIn, Shield, Eye, EyeOff, ArrowLeft, Sparkles, Mail, Lock } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .auth-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    font-family: 'Sora', sans-serif;
    color: #ffffff;
  }

  .auth-page {
    min-height: 100vh; width: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(217,186,132,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(200,180,80,0.05) 0%, transparent 55%),
      #000000;
    position: relative;
  }

  .auth-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(217,186,132,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(217,186,132,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.14);
    border-radius: 24px; padding: 36px;
    box-shadow:
      0 0 0 1px rgba(217,186,132,0.06),
      0 32px 64px rgba(0,0,0,0.9),
      0 0 60px rgba(217,186,132,0.03);
    animation: authSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes authSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes authFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .auth-animate { animation: authFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

  .auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .auth-brand-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(217,186,132,0.25); flex-shrink: 0;
  }
  .auth-brand-name { font-size: 17px; font-weight: 700; letter-spacing: 0.05em; color: #ffffff; }
  .auth-brand-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: #D9BA84;
    background: rgba(217,186,132,0.1);
    border: 1px solid rgba(217,186,132,0.2);
    padding: 2px 7px; border-radius: 4px; margin-left: auto;
  }

  .auth-heading { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 5px; }
  .auth-sub { font-size: 13px; color: #a0a0b4; margin-bottom: 24px; line-height: 1.5; }
  .auth-divider { height: 1px; background: rgba(217,186,132,0.12); margin-bottom: 22px; }

  .auth-role-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a0a0b4; margin-bottom: 10px; }
  .auth-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .auth-role-card {
    padding: 15px; border-radius: 14px;
    border: 1.5px solid rgba(217,186,132,0.14);
    background: #161616;
    cursor: pointer; transition: all 0.2s ease;
    text-align: left; display: flex; flex-direction: column; gap: 8px;
    font-family: 'Sora', sans-serif;
  }
  .auth-role-card:hover { border-color: rgba(217,186,132,0.3); background: rgba(217,186,132,0.04); transform: translateY(-1px); }
  .auth-role-card.sel-basic { border-color: #D9BA84; background: rgba(217,186,132,0.08); box-shadow: 0 0 0 1px rgba(217,186,132,0.12); }
  .auth-role-card.sel-admin { border-color: #c8b450; background: rgba(200,180,80,0.08); box-shadow: 0 0 0 1px rgba(200,180,80,0.12); }
  .auth-role-head { display: flex; align-items: flex-start; justify-content: space-between; }
  .auth-role-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .auth-role-ico.basic { background: rgba(217,186,132,0.15); color: #D9BA84; }
  .auth-role-ico.admin { background: rgba(200,180,80,0.15); color: #c8b450; }
  .auth-role-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(217,186,132,0.2); transition: all 0.2s; }
  .auth-role-card.sel-basic .auth-role-dot { background: #D9BA84; border-color: #D9BA84; box-shadow: 0 0 0 3px rgba(217,186,132,0.15); }
  .auth-role-card.sel-admin .auth-role-dot { background: #c8b450; border-color: #c8b450; box-shadow: 0 0 0 3px rgba(200,180,80,0.15); }
  .auth-role-title { font-size: 13px; font-weight: 600; color: #ffffff; }
  .auth-role-desc { font-size: 11px; color: #a0a0b4; line-height: 1.4; }
  .auth-role-hint { text-align: center; font-size: 12px; color: #a0a0b4; }

  .auth-back-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    margin-bottom: 18px; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: opacity 0.15s;
    background: none;
  }
  .auth-back-badge:hover { opacity: 0.75; }
  .auth-back-badge.basic { background: rgba(217,186,132,0.1); color: #D9BA84; border: 1px solid rgba(217,186,132,0.2); }
  .auth-back-badge.admin { background: rgba(200,180,80,0.1); color: #c8b450; border: 1px solid rgba(200,180,80,0.2); }

  .auth-field { margin-bottom: 14px; }
  .auth-field-label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12px; font-weight: 500; color: #a0a0b4; margin-bottom: 7px;
  }
  .auth-field-label a { color: #D9BA84; text-decoration: none; font-size: 11px; }
  .auth-field-label a:hover { text-decoration: underline; }
  .auth-input-wrap { position: relative; }
  .auth-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #a0a0b4; pointer-events: none; }
  .auth-input {
    width: 100%; padding: 11px 13px 11px 38px;
    background: #161616; border: 1.5px solid rgba(217,186,132,0.14);
    border-radius: 12px; color: #ffffff;
    font-family: 'Sora', sans-serif; font-size: 14px; outline: none;
    transition: all 0.2s ease;
  }
  .auth-input::placeholder { color: #a0a0b4; opacity: 0.5; }
  .auth-input:focus { border-color: rgba(217,186,132,0.6); background: #0d0d0d; box-shadow: 0 0 0 3px rgba(217,186,132,0.07); }
  .auth-input.has-right { padding-right: 42px; }
  .auth-eye {
    position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #a0a0b4;
    padding: 4px; display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: color 0.15s;
  }
  .auth-eye:hover { color: #ffffff; }

  .auth-submit {
    width: 100%; padding: 12px; border: none; border-radius: 12px;
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 18px;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    color: #000000;
    box-shadow: 0 4px 20px rgba(217,186,132,0.2);
    letter-spacing: 0.01em;
  }
  .auth-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(217,186,132,0.3); filter: brightness(1.05); }
  .auth-submit:active { transform: translateY(0); }

  .auth-footer { text-align: center; font-size: 12px; color: #a0a0b4; margin-top: 18px; }
  .auth-footer a { color: #D9BA84; text-decoration: none; font-weight: 600; }
  .auth-footer a:hover { text-decoration: underline; }
`;

function PasswordField({ placeholder, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="auth-input-wrap">
      <Lock size={15} className="auth-input-icon" />
      <input id={id} type={show ? "text" : "password"} className="auth-input has-right" placeholder={placeholder} />
      <button type="button" className="auth-eye" onClick={() => setShow(s => !s)}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function Login() {
  const [tier, setTier] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="auth-root">
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-grid" />
        <div className="auth-card">

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Sparkles size={18} color="#000000" />
            </div>
            <span className="auth-brand-name">WLA</span>
            <span className="auth-brand-badge">Community</span>
          </div>

          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-sub">Sign in to access your WLA community account.</p>
          <div className="auth-divider" />

          {!tier ? (
            <div className="auth-animate">
              <p className="auth-role-label">Sign in as</p>
              <div className="auth-role-grid">
                <button
                  className={`auth-role-card${hovered === "basic" ? " sel-basic" : ""}`}
                  onClick={() => setTier("basic")}
                  onMouseEnter={() => setHovered("basic")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="auth-role-head">
                    <div className="auth-role-ico basic"><LogIn size={15} /></div>
                    <div className="auth-role-dot" />
                  </div>
                  <div className="auth-role-title">Basic User</div>
                  <div className="auth-role-desc">Standard community member access</div>
                </button>
                <button
                  className={`auth-role-card${hovered === "admin" ? " sel-admin" : ""}`}
                  onClick={() => setTier("admin")}
                  onMouseEnter={() => setHovered("admin")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="auth-role-head">
                    <div className="auth-role-ico admin"><Shield size={15} /></div>
                    <div className="auth-role-dot" />
                  </div>
                  <div className="auth-role-title">Admin</div>
                  <div className="auth-role-desc">Elevated management access</div>
                </button>
              </div>
              <p className="auth-role-hint">Select your role to continue signing in.</p>
            </div>
          ) : (
            <div className="auth-animate">
              <button className={`auth-back-badge ${tier}`} onClick={() => setTier(null)}>
                <ArrowLeft size={11} />
                {tier === "admin" ? <><Shield size={11} /> Admin</> : <><LogIn size={11} /> Basic User</>}
              </button>

              <div className="auth-field">
                <label className="auth-field-label">Email address</label>
                <div className="auth-input-wrap">
                  <Mail size={15} className="auth-input-icon" />
                  <input type="email" className="auth-input" placeholder="you@example.com" />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-field-label">
                  Password
                  <a href="#">Forgot password?</a>
                </label>
                <PasswordField placeholder="Enter your password" id="login-pass" />
              </div>

              <button type="submit" className="auth-submit">
                <LogIn size={16} />
                Sign in to WLA
              </button>

              <div className="auth-footer">
                Don't have an account? <a href="#">Create one</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}