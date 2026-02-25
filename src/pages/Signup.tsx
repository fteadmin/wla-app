import { useState } from "react";
import { UserPlus, Shield, Eye, EyeOff, ArrowLeft, Sparkles, Mail, Lock, User } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .su-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    font-family: 'Sora', sans-serif;
    color: #ffffff;
  }

  .su-page {
    min-height: 100vh; width: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    background:
      radial-gradient(ellipse 80% 50% at 80% -10%, rgba(200,180,80,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 20% 110%, rgba(217,186,132,0.05) 0%, transparent 55%),
      #000000;
    position: relative;
  }

  .su-grid {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(217,186,132,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(217,186,132,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none; z-index: 0;
  }

  .su-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.14);
    border-radius: 24px; padding: 36px;
    box-shadow:
      0 0 0 1px rgba(217,186,132,0.06),
      0 32px 64px rgba(0,0,0,0.9),
      0 0 60px rgba(200,180,80,0.03);
    animation: suSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes suSlideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes suFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .su-animate { animation: suFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

  .su-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .su-brand-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(217,186,132,0.25); flex-shrink: 0;
  }
  .su-brand-name { font-size: 17px; font-weight: 700; letter-spacing: 0.05em; color: #ffffff; }
  .su-brand-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: #D9BA84;
    background: rgba(217,186,132,0.1);
    border: 1px solid rgba(217,186,132,0.2);
    padding: 2px 7px; border-radius: 4px; margin-left: auto;
  }

  .su-heading { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 5px; }
  .su-sub { font-size: 13px; color: #a0a0b4; margin-bottom: 24px; line-height: 1.5; }
  .su-divider { height: 1px; background: rgba(217,186,132,0.12); margin-bottom: 22px; }

  .su-role-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a0a0b4; margin-bottom: 10px; }
  .su-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .su-role-card {
    padding: 15px; border-radius: 14px;
    border: 1.5px solid rgba(217,186,132,0.14);
    background: #161616;
    cursor: pointer; transition: all 0.2s ease;
    text-align: left; display: flex; flex-direction: column; gap: 8px;
    font-family: 'Sora', sans-serif;
  }
  .su-role-card:hover { border-color: rgba(217,186,132,0.3); background: rgba(217,186,132,0.04); transform: translateY(-1px); }
  .su-role-card.sel-basic { border-color: #D9BA84; background: rgba(217,186,132,0.08); box-shadow: 0 0 0 1px rgba(217,186,132,0.12); }
  .su-role-card.sel-admin { border-color: #c8b450; background: rgba(200,180,80,0.08); box-shadow: 0 0 0 1px rgba(200,180,80,0.12); }
  .su-role-head { display: flex; align-items: flex-start; justify-content: space-between; }
  .su-role-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .su-role-ico.basic { background: rgba(217,186,132,0.15); color: #D9BA84; }
  .su-role-ico.admin { background: rgba(200,180,80,0.15); color: #c8b450; }
  .su-role-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(217,186,132,0.2); transition: all 0.2s; }
  .su-role-card.sel-basic .su-role-dot { background: #D9BA84; border-color: #D9BA84; box-shadow: 0 0 0 3px rgba(217,186,132,0.15); }
  .su-role-card.sel-admin .su-role-dot { background: #c8b450; border-color: #c8b450; box-shadow: 0 0 0 3px rgba(200,180,80,0.15); }
  .su-role-title { font-size: 13px; font-weight: 600; color: #ffffff; }
  .su-role-desc { font-size: 11px; color: #a0a0b4; line-height: 1.4; }
  .su-role-hint { text-align: center; font-size: 12px; color: #a0a0b4; }

  .su-back-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    margin-bottom: 18px; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: opacity 0.15s;
    background: none;
  }
  .su-back-badge:hover { opacity: 0.75; }
  .su-back-badge.basic { background: rgba(217,186,132,0.1); color: #D9BA84; border: 1px solid rgba(217,186,132,0.2); }
  .su-back-badge.admin { background: rgba(200,180,80,0.1); color: #c8b450; border: 1px solid rgba(200,180,80,0.2); }

  .su-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .su-field { margin-bottom: 14px; }
  .su-field-label {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12px; font-weight: 500; color: #a0a0b4; margin-bottom: 7px;
  }
  .su-input-wrap { position: relative; }
  .su-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #a0a0b4; pointer-events: none; }
  .su-input {
    width: 100%; padding: 11px 13px 11px 38px;
    background: #161616; border: 1.5px solid rgba(217,186,132,0.14);
    border-radius: 12px; color: #ffffff;
    font-family: 'Sora', sans-serif; font-size: 14px; outline: none;
    transition: all 0.2s ease;
  }
  .su-input::placeholder { color: #a0a0b4; opacity: 0.5; }
  .su-input:focus { border-color: rgba(217,186,132,0.6); background: #0d0d0d; box-shadow: 0 0 0 3px rgba(217,186,132,0.07); }
  .su-input.has-right { padding-right: 42px; }
  .su-eye {
    position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #a0a0b4;
    padding: 4px; display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: color 0.15s;
  }
  .su-eye:hover { color: #ffffff; }

  /* Admin code block */
  .su-admin-block {
    padding: 14px; border-radius: 12px;
    background: rgba(200,180,80,0.05);
    border: 1.5px solid rgba(200,180,80,0.2);
    margin-bottom: 14px;
  }
  .su-admin-block .su-input:focus { border-color: rgba(200,180,80,0.6); box-shadow: 0 0 0 3px rgba(200,180,80,0.07); }
  .su-admin-note { font-size: 11px; color: rgba(200,180,80,0.65); margin-top: 7px; line-height: 1.4; }

  /* Terms */
  .su-terms { display: flex; align-items: flex-start; gap: 9px; margin-top: 4px; }
  .su-terms input[type=checkbox] { width: 14px; height: 14px; accent-color: #D9BA84; margin-top: 2px; flex-shrink: 0; cursor: pointer; }
  .su-terms-text { font-size: 11px; color: #a0a0b4; line-height: 1.5; }
  .su-terms-text a { color: #D9BA84; text-decoration: none; }
  .su-terms-text a:hover { text-decoration: underline; }

  .su-submit {
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
  .su-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(217,186,132,0.3); filter: brightness(1.05); }
  .su-submit:active { transform: translateY(0); }

  .su-footer { text-align: center; font-size: 12px; color: #a0a0b4; margin-top: 18px; }
  .su-footer a { color: #D9BA84; text-decoration: none; font-weight: 600; }
  .su-footer a:hover { text-decoration: underline; }
`;

function PasswordField({ placeholder, id, cls }) {
  const [show, setShow] = useState(false);
  return (
    <div className="su-input-wrap">
      <Lock size={15} className="su-input-icon" />
      <input id={id} type={show ? "text" : "password"} className={`su-input has-right ${cls || ""}`} placeholder={placeholder} />
      <button type="button" className="su-eye" onClick={() => setShow(s => !s)}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function Signup() {
  const [tier, setTier] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div className="su-root">
      <style>{styles}</style>
      <div className="su-page">
        <div className="su-grid" />
        <div className="su-card">

          <div className="su-brand">
            <div className="su-brand-icon">
              <Sparkles size={18} color="#000000" />
            </div>
            <span className="su-brand-name">WLA</span>
            <span className="su-brand-badge">Community</span>
          </div>

          <h2 className="su-heading">Create your account</h2>
          <p className="su-sub">Join the WLA community and get started today.</p>
          <div className="su-divider" />

          {!tier ? (
            <div className="su-animate">
              <p className="su-role-label">I'm signing up as</p>
              <div className="su-role-grid">
                <button
                  className={`su-role-card${hovered === "basic" ? " sel-basic" : ""}`}
                  onClick={() => setTier("basic")}
                  onMouseEnter={() => setHovered("basic")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="su-role-head">
                    <div className="su-role-ico basic"><UserPlus size={15} /></div>
                    <div className="su-role-dot" />
                  </div>
                  <div className="su-role-title">Basic User</div>
                  <div className="su-role-desc">Standard community member access</div>
                </button>
                <button
                  className={`su-role-card${hovered === "admin" ? " sel-admin" : ""}`}
                  onClick={() => setTier("admin")}
                  onMouseEnter={() => setHovered("admin")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="su-role-head">
                    <div className="su-role-ico admin"><Shield size={15} /></div>
                    <div className="su-role-dot" />
                  </div>
                  <div className="su-role-title">Admin</div>
                  <div className="su-role-desc">Elevated management access</div>
                </button>
              </div>
              <p className="su-role-hint">Choose your role to begin registration.</p>
            </div>
          ) : (
            <div className="su-animate">
              <button className={`su-back-badge ${tier}`} onClick={() => setTier(null)}>
                <ArrowLeft size={11} />
                {tier === "admin" ? <><Shield size={11} /> Admin</> : <><UserPlus size={11} /> Basic User</>}
              </button>

              <div className="su-name-row">
                <div>
                  <div className="su-field-label">First name</div>
                  <div className="su-input-wrap">
                    <User size={15} className="su-input-icon" />
                    <input type="text" className="su-input" placeholder="Jane" />
                  </div>
                </div>
                <div>
                  <div className="su-field-label">Last name</div>
                  <div className="su-input-wrap">
                    <User size={15} className="su-input-icon" />
                    <input type="text" className="su-input" placeholder="Smith" />
                  </div>
                </div>
              </div>

              <div className="su-field">
                <label className="su-field-label">Email address</label>
                <div className="su-input-wrap">
                  <Mail size={15} className="su-input-icon" />
                  <input type="email" className="su-input" placeholder="you@example.com" />
                </div>
              </div>

              <div className="su-field">
                <label className="su-field-label">Password</label>
                <PasswordField placeholder="Create a strong password" id="su-pass" />
              </div>

              <div className="su-field">
                <label className="su-field-label">Confirm password</label>
                <PasswordField placeholder="Repeat your password" id="su-confirm" />
              </div>

              {tier === "admin" && (
                <div className="su-admin-block">
                  <div className="su-field-label" style={{ color: "rgba(200,180,80,0.8)", marginBottom: 7 }}>
                    Admin access code
                  </div>
                  <div className="su-input-wrap">
                    <Shield size={15} className="su-input-icon" style={{ color: "rgba(200,180,80,0.6)" }} />
                    <input type="text" className="su-input" placeholder="Enter your admin code" />
                  </div>
                  <p className="su-admin-note">Contact your organization to obtain an admin access code.</p>
                </div>
              )}

              <div className="su-terms">
                <input type="checkbox" id="su-terms" />
                <label htmlFor="su-terms" className="su-terms-text">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="su-submit">
                <Sparkles size={16} />
                Create account
              </button>

              <div className="su-footer">
                Already have an account? <a href="#">Sign in</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}