import { useState, useRef } from "react";
import { useProfile } from "@/lib/profile-store";
import { IgClose, IgCamera, IgImage, IgPlus } from "@/components/ig-icons";

interface AddHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddHighlightModal({ isOpen, onClose }: AddHighlightModalProps) {
  const { addHighlight, profile } = useProfile();
  const [highlightTitle, setHighlightTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const title = highlightTitle.trim();
    if (!title && !coverUrl) {
      setError("Please choose a cover photo or enter a highlight title.");
      return;
    }

    const finalCover = coverUrl || profile.avatarUrl;
    const finalTitle = title || "Highlight";

    addHighlight(finalTitle, finalCover);
    setHighlightTitle("");
    setCoverUrl("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setHighlightTitle("");
    setCoverUrl("");
    setError("");
    onClose();
  };

  return (
    <div
      className="clone-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[420px] w-full flex flex-col overflow-hidden bg-white text-ink rounded-t-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="clone-modal-drag-bar" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#ededed]">
          <button
            type="button"
            className="text-sm font-medium text-subtle hover:text-ink cursor-pointer bg-transparent border-none p-1"
            onClick={handleClose}
          >
            Cancel
          </button>
          <h2 className="text-base font-bold text-center flex-1">New Highlight</h2>
          <button
            type="button"
            className="text-sm font-bold text-[#0095f6] hover:text-[#00376b] cursor-pointer bg-transparent border-none p-1"
            onClick={handleSave}
          >
            Add
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center space-y-5">
          {/* Cover Photo Preview & Selector */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full p-1 border-2 border-dashed border-[#dbdbdb] hover:border-[#0095f6] cursor-pointer transition-all flex items-center justify-center bg-gray-50 group"
            >
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Highlight cover"
                  className="w-full h-full rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-subtle group-hover:text-[#0095f6]">
                  <IgCamera size={26} />
                  <span className="text-[10px] font-semibold mt-1">Cover</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <IgImage size={20} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2.5 text-xs font-semibold text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <IgImage size={13} /> {coverUrl ? "Change cover photo" : "Choose cover photo from device"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Highlight Name */}
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-subtle text-left">
              Highlight Name
            </label>
            <input
              type="text"
              value={highlightTitle}
              onChange={(e) => setHighlightTitle(e.target.value)}
              placeholder="e.g. Moments, Travel, Vibes..."
              maxLength={30}
              className="w-full px-3.5 py-2.5 text-sm border border-[#dbdbdb] rounded-xl bg-white text-ink placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium text-center">{error}</p>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm shadow-pink-500/25 flex items-center justify-center gap-1.5"
          >
            <IgPlus size={14} /> Add to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
