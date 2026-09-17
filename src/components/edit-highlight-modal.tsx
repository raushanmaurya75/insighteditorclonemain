import { useState, useRef, useEffect } from "react";
import { useProfile, type ProfileHighlight } from "@/lib/profile-store";
import { IgClose, IgCamera, IgImage, IgTrash, IgEdit } from "@/components/ig-icons";

interface EditHighlightModalProps {
  highlight: ProfileHighlight | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditHighlightModal({ highlight, isOpen, onClose }: EditHighlightModalProps) {
  const { updateHighlight, deleteHighlight } = useProfile();
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (highlight) {
      setTitle(highlight.title);
      setCoverUrl(highlight.coverUrl);
      setError("");
    }
  }, [highlight]);

  if (!isOpen || !highlight) return null;

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
    const cleanTitle = title.trim();
    if (!cleanTitle && !coverUrl) {
      setError("Please enter a title or choose a cover photo.");
      return;
    }

    updateHighlight(highlight.id, cleanTitle || highlight.title, coverUrl);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Delete highlight "${highlight.title}"?`)) {
      deleteHighlight(highlight.id);
      onClose();
    }
  };

  return (
    <div
      className="clone-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            onClick={onClose}
          >
            Cancel
          </button>
          <h2 className="text-base font-bold text-center flex-1">Edit Highlight</h2>
          <button
            type="button"
            className="text-sm font-bold text-[#0095f6] hover:text-[#00376b] cursor-pointer bg-transparent border-none p-1"
            onClick={handleSave}
          >
            Done
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center space-y-5">
          {/* Cover Photo Preview & Selector */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full p-1 border-2 border-[#dbdbdb] hover:border-[#0095f6] cursor-pointer transition-all flex items-center justify-center bg-gray-50 group"
            >
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title || "Cover"}
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
              <IgImage size={13} /> Choose New Cover from Device
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Highlight Title */}
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold text-subtle text-left">
              Highlight Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Highlight title..."
              maxLength={30}
              className="w-full px-3.5 py-2.5 text-sm border border-[#dbdbdb] rounded-xl bg-white text-ink placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
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

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm shadow-pink-500/25 flex items-center justify-center gap-1.5"
            >
              <IgEdit size={14} /> Save Changes
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-red-200 bg-white flex items-center justify-center gap-1.5"
            >
              <IgTrash size={14} /> Delete Highlight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
