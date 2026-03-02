
import TopNav from "../../../src/components/dashboard/TopNav";
import { Upload, CheckCircle, Clock, Info, Lock } from "lucide-react";

const styles = `
  .mb-root { font-family: 'Sora', sans-serif; }
  .mb-card {
    background: linear-gradient(160deg, #0f0f0a 0%, #0d0d0d 100%);
    border: 1.5px solid rgba(217,186,132,0.28);
    border-radius: 24px; padding: 28px;
    position: relative; overflow: hidden;
    transition: all 0.25s;
  }
  .mb-ico-box { 
    width: 46px; height: 46px; border-radius: 13px; 
    background: rgba(217,186,132,0.1); 
    border: 1px solid rgba(217,186,132,0.3); 
    display: flex; align-items: center; justify-content: center; 
    color: #D9BA84; 
  }
  .mb-divider { height: 1px; background: rgba(217,186,132,0.12); margin: 20px 0; }
  .mb-action-btn { 
    width: 100%; padding: 13px; border-radius: 12px; 
    background: rgba(217,186,132,0.05); 
    color: #D9BA84; font-weight: 700; 
    border: 1px solid rgba(217,186,132,0.2);
    cursor: not-allowed;
  }
`;

export default function ContentUploadsBasic() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sora mb-root">
      <TopNav />
      <style>{styles}</style>
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-xl flex-1 p-6">
          {/* Header Section */}
          <header className="mb-10 text-center">
            <span className="text-yellow-400 uppercase tracking-tighter text-sm font-bold">Media Portal</span>
            <h1 className="text-4xl font-black mt-2">Content Uploads</h1>
          </header>

          {/* Feature Coming Soon Status Pill */}
          <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-xl mb-8">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-400" />
              <div>
                <p className="font-bold">Feature Coming Soon</p>
                <p className="text-xs text-yellow-400/70">Check back for the next competition</p>
              </div>
            </div>
            <div className="text-[10px] font-bold border border-yellow-400/50 px-3 py-1 rounded-lg uppercase tracking-wider">In Progress</div>
          </div>

          {/* The Card */}
          <div className="mb-card">
            <div className="flex justify-between items-start mb-6">
              <div className="mb-ico-box"><Upload size={24} /></div>
              <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30 uppercase">
              Basic User
            </span>
          </div>

          <h3 className="text-2xl font-bold">Upload Your Content</h3>
          <p className="text-gray-500 text-sm mt-2">
            This feature is currently being optimized for the WLA community.
          </p>

          <div className="mb-divider" />

          {/* Planned Features List */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <CheckCircle size={16} className="text-yellow-400" /> Upload photos or videos for competitions
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <CheckCircle size={16} className="text-yellow-400" /> Check submission guidelines
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <CheckCircle size={16} className="text-yellow-400" /> Track your uploads & approvals
            </li>
          </ul>

          {/* Locked Button */}
          <button className="mb-action-btn flex items-center justify-center gap-2">
            <Lock size={18} /> Feature Coming Soon
          </button>
        </div>

        {/* Footer info box */}
        <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4 items-start">
          <Info className="text-gray-400 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-gray-500 leading-relaxed">
            Please use the dashboard navigation to access other features. You will be notified as soon as the Media Portal is live for submissions.
          </p>
        </div>
        </div>
      </main>
    </div>
  );
}
