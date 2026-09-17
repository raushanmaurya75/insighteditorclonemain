import { useProfile, type ProfileHighlight } from "@/lib/profile-store";
import { IgClose, IgTrash, IgEdit } from "@/components/ig-icons";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HighlightViewerModalProps {
  highlight: ProfileHighlight | null;
  onClose: () => void;
  onEdit: (hl: ProfileHighlight) => void;
}

export function HighlightViewerModal({
  highlight,
  onClose,
  onEdit,
}: HighlightViewerModalProps) {
  const { profile, deleteHighlight, moveHighlight } = useProfile();

  if (!highlight) return null;

  const highlights = profile.highlights || [];
  const currentIndex = highlights.findIndex((h) => h.id === highlight.id);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === highlights.length - 1;

  const handleDelete = () => {
    if (confirm(`Delete highlight "${highlight.title}"?`)) {
      deleteHighlight(highlight.id);
      onClose();
    }
  };

  const handleMoveLeft = () => {
    moveHighlight(highlight.id, "left");
  };

  const handleMoveRight = () => {
    moveHighlight(highlight.id, "right");
  };

  return (
    <div
      className="clone-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[420px] w-full flex flex-col overflow-hidden bg-black text-white rounded-t-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="clone-modal-drag-bar bg-white/30" />

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            {highlight.coverUrl ? (
              <img
                src={highlight.coverUrl}
                alt={highlight.title}
                className="w-8 h-8 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold">
                {highlight.title.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="font-bold text-sm text-white">{highlight.title}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(highlight)}
              className="p-1.5 text-white/80 hover:text-white bg-transparent border-none cursor-pointer flex items-center gap-1 text-xs"
              title="Edit Highlight"
            >
              <IgEdit size={16} /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer"
              title="Delete Highlight"
            >
              <IgTrash size={17} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white bg-transparent border-none cursor-pointer ml-1"
              title="Close"
            >
              <IgClose size={18} />
            </button>
          </div>
        </div>

        {/* Media Preview */}
        <div className="relative w-full aspect-[9/16] max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
          {highlight.coverUrl ? (
            <img
              src={highlight.coverUrl}
              alt={highlight.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6 text-white/60">
              <p className="font-semibold text-lg">{highlight.title}</p>
              <p className="text-xs text-white/40 mt-1">Story Highlight</p>
            </div>
          )}
        </div>

        {/* Bottom Toolbar with Repositioning Controls */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between bg-neutral-900/90 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 text-[11px] mr-1">Reposition:</span>
            <button
              type="button"
              onClick={handleMoveLeft}
              disabled={isFirst}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium cursor-pointer transition-colors ${
                isFirst
                  ? "border-white/10 text-white/20 cursor-not-allowed bg-transparent"
                  : "border-white/20 text-white hover:bg-white/10 bg-black/40"
              }`}
              title="Move highlight left"
            >
              <ArrowLeft size={13} /> Left
            </button>
            <button
              type="button"
              onClick={handleMoveRight}
              disabled={isLast}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium cursor-pointer transition-colors ${
                isLast
                  ? "border-white/10 text-white/20 cursor-not-allowed bg-transparent"
                  : "border-white/20 text-white hover:bg-white/10 bg-black/40"
              }`}
              title="Move highlight right"
            >
              Right <ArrowRight size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onEdit(highlight)}
            className="px-3 py-1.5 bg-[#0095f6] text-white font-semibold rounded-lg hover:bg-[#1877f2] transition-colors cursor-pointer border-none"
          >
            Edit Cover / Name
          </button>
        </div>
      </div>
    </div>
  );
}
