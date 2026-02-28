import React, { useState } from "react";
import { 
  Upload, CheckCircle, FileVideo, Image as ImageIcon, 
  History, Info, AlertCircle, ChevronRight, Zap, Cloud
} from "lucide-react";

// --- Reuse your Styles Helper ---
const styles = `
  .mb-root { font-family: 'Sora', sans-serif; }
  .mb-card {
    background: linear-gradient(160deg, #0f0f0a 0%, #0d0d0d 100%);
    border: 1.5px solid rgba(217,186,132,0.28);
    border-radius: 24px; padding: 28px;
    position: relative; overflow: hidden;
    transition: all 0.25s;
  }
  .mb-card:hover { border-color: rgba(217,186,132,0.45); }
  .mb-ico-box { width: 46px; height: 46px; border-radius: 13px; background: rgba(217,186,132,0.1); border: 1px solid rgba(217,186,132,0.3); display: flex; align-items: center; justify-content: center; color: #D9BA84; }
  .mb-divider { height: 1px; background: rgba(217,186,132,0.12); margin: 20px 0; }
  .mb-action-btn { width: 100%; padding: 13px; border-radius: 12px; background: linear-gradient(135deg, #D9BA84, #c8b450); color: #000; font-weight: 700; cursor: pointer; border: none; transition: opacity 0.2s; }
  .mb-action-btn:hover { opacity: 0.9; }
  .mb-dropzone { border: 2px dashed rgba(217,186,132,0.2); border-radius: 16px; transition: all 0.2s; cursor: pointer; }
  .mb-dropzone:hover { border-color: #D9BA84; background: rgba(217,186,132,0.03); }
`;

const GUIDELINES = [
  "High-resolution JPG/PNG only",
  "MP4/MOV for video submissions",
  "Max file size: 50MB",
  "Must own the content rights",
];

export default function ContentUploadsBasic() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center mb-root">
      <style>{styles}</style>

      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <span className="text-yellow-400 uppercase tracking-tighter text-sm font-bold">Media Portal</span>
          <h1 className="text-4xl font-black mt-2">Content Uploads</h1>
          <p className="text-gray-500 mt-2 text-sm">Submit your best captures for community showcases.</p>
        </header>

        {/* Main Upload Card */}
        <div className="mb-card mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="mb-ico-box"><Upload size={24} /></div>
            <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30 uppercase">
              Member Portal
            </span>
          </div>

          <h3 className="text-2xl font-bold">New Submission</h3>
          <p className="text-gray-400 text-sm mt-1">Select photos or videos for competitions.</p>

          <div className="mb-divider" />

          {/* Simulated Dropzone */}
          <div className="mb-dropzone p-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-3 bg-yellow-400/10 rounded-full text-yellow-400">
              <Cloud size={32} />
            </div>
            <div>
              <p className="font-bold text-sm">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-500 mt-1">Photos (JPG, PNG) or Videos (MP4)</p>
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 text-[#D9BA84]">
              <Info size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Guidelines</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GUIDELINES.map((g, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] text-gray-400">
                  <CheckCircle size={14} className="text-yellow-400 flex-shrink-0" /> {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-divider" />

          <button 
            className="mb-action-btn flex items-center justify-center gap-2"
            onClick={() => setIsUploading(true)}
          >
            Submit Content
          </button>
        </div>

        {/* Previous Uploads Section (Quick Stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-card p-5 !rounded-xl flex items-center gap-4">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Photos</p>
              <p className="font-bold">12</p>
            </div>
          </div>

          <div className="mb-card p-5 !rounded-xl flex items-center gap-4">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
              <FileVideo size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Videos</p>
              <p className="font-bold">4</p>
            </div>
          </div>

          <div className="mb-card p-5 !rounded-xl flex items-center gap-4">
            <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved</p>
              <p className="font-bold text-yellow-400">100%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}