import { useState, useRef } from "react";
import {
  useProfile,
  DEFAULT_PROFILE,
  type ProfileData,
  type ProfilePost,
  type ProfileHighlight,
} from "@/lib/profile-store";
import {
  IgClose,
  IgVerified,
  IgPlus,
  IgTrash,
  IgEdit,
  IgImage,
  IgCamera,
} from "@/components/ig-icons";
import { ArrowUp, ArrowDown } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { profile, setProfile, resetProfile } = useProfile();

  // Form State
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [category, setCategory] = useState(profile.category || "Digital Creator");
  const [bio, setBio] = useState(profile.bio);
  const [externalUrl, setExternalUrl] = useState(profile.externalUrl);
  const [threadsUsername, setThreadsUsername] = useState(profile.threadsUsername || profile.username);
  const [noteText, setNoteText] = useState(profile.noteText || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [isVerified, setIsVerified] = useState(profile.isVerified);
  const [followersCount, setFollowersCount] = useState(profile.followersCount.toString());
  const [followingCount, setFollowingCount] = useState(profile.followingCount.toString());
  const [postsCount, setPostsCount] = useState(profile.postsCount.toString());
  const [monthlyViews, setMonthlyViews] = useState(profile.monthlyViews || "1.6M views in the last 30 days.");

  // Posts State
  const [posts, setPosts] = useState<ProfilePost[]>(profile.posts || []);
  // Highlights State
  const [highlights, setHighlights] = useState<ProfileHighlight[]>(profile.highlights || []);
  const [activeTab, setActiveTab] = useState<"info" | "stats" | "posts" | "highlights">("info");

  // Highlight Editing State
  const [editingHighlightIndex, setEditingHighlightIndex] = useState<number | null>(null);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightCoverUrl, setHighlightCoverUrl] = useState("");
  const [isAddHighlightOpen, setIsAddHighlightOpen] = useState(false);
  const highlightFileInputRef = useRef<HTMLInputElement>(null);

  // Post Editing State
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postLikes, setPostLikes] = useState("1200");
  const [postViews, setPostViews] = useState("24000");
  const [postComments, setPostComments] = useState("45");
  const [postThumbUrl, setPostThumbUrl] = useState("");

  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local avatar file upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
          setIsPhotoPickerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle post image file upload
  const handlePostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPostThumbUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle highlight cover file upload
  const handleHighlightFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setHighlightCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Move highlight position (reposition left/right)
  const handleMoveHighlight = (idx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= highlights.length) return;
    const updated = [...highlights];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHighlights(updated);
  };

  // Delete highlight
  const handleDeleteHighlight = (idx: number) => {
    const updated = highlights.filter((_, i) => i !== idx);
    setHighlights(updated);
  };

  // Open edit highlight
  const handleOpenEditHighlight = (idx: number) => {
    const h = highlights[idx];
    if (!h) return;
    setEditingHighlightIndex(idx);
    setHighlightTitle(h.title);
    setHighlightCoverUrl(h.coverUrl || "");
  };

  // Save edit highlight
  const handleSaveHighlightEdit = () => {
    if (editingHighlightIndex === null) return;
    const updated = [...highlights];
    updated[editingHighlightIndex] = {
      ...updated[editingHighlightIndex],
      title: highlightTitle.trim() || updated[editingHighlightIndex].title,
      coverUrl: highlightCoverUrl || updated[editingHighlightIndex].coverUrl,
    };
    setHighlights(updated);
    setEditingHighlightIndex(null);
  };

  // Add new highlight
  const handleSaveNewHighlight = () => {
    const newHl: ProfileHighlight = {
      id: `hl_${Date.now()}`,
      title: highlightTitle.trim() || "Highlight",
      coverUrl: highlightCoverUrl || avatarUrl,
    };
    setHighlights([...highlights, newHl]);
    setIsAddHighlightOpen(false);
    setHighlightTitle("");
    setHighlightCoverUrl("");
  };

  // Parse formatted numbers (e.g. 1.2M, 54K, 4,950)
  const parseNum = (str: string, fallback: number) => {
    const clean = str.replace(/,/g, "").trim().toUpperCase();
    if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1_000_000) || fallback;
    if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1_000) || fallback;
    const num = parseInt(clean, 10);
    return isNaN(num) ? fallback : num;
  };

  // Save All Changes to profile store & localStorage
  const handleSave = () => {
    const updated: Partial<ProfileData> = {
      fullName: fullName.trim(),
      username: username.trim().replace(/^@+/, ""),
      category: category.trim(),
      bio: bio.trim(),
      externalUrl: externalUrl.trim(),
      threadsUsername: threadsUsername.trim().replace(/^@+/, ""),
      noteText: noteText.trim(),
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      isVerified,
      followersCount: parseNum(followersCount, profile.followersCount),
      followingCount: parseNum(followingCount, profile.followingCount),
      postsCount: parseNum(postsCount, posts.length || profile.postsCount),
      monthlyViews: monthlyViews.trim(),
      posts: posts.length > 0 ? posts : profile.posts,
      highlights: highlights.length > 0 ? highlights : profile.highlights,
    };

    setProfile(updated);
    onClose();
  };

  // Reset to default profile
  const handleReset = () => {
    if (confirm("Reset profile to default Dorian Divizev data?")) {
      resetProfile();
      onClose();
    }
  };

  // Delete a post
  const handleDeletePost = (idx: number) => {
    const updated = posts.filter((_, i) => i !== idx);
    setPosts(updated);
    setPostsCount(updated.length.toString());
  };

  // Open Edit Single Post
  const handleOpenEditPost = (idx: number) => {
    const p = posts[idx];
    if (!p) return;
    setEditingPostIndex(idx);
    setPostCaption(p.caption || "");
    setPostLikes(p.likes.toString());
    setPostViews(p.views.toString());
    setPostComments(p.comments.toString());
    setPostThumbUrl(p.thumbnail_src || p.display_url || "");
  };

  // Save Edit Single Post
  const handleSavePostEdit = () => {
    if (editingPostIndex === null) return;
    const updated = [...posts];
    updated[editingPostIndex] = {
      ...updated[editingPostIndex],
      caption: postCaption,
      likes: parseNum(postLikes, updated[editingPostIndex].likes),
      views: parseNum(postViews, updated[editingPostIndex].views),
      comments: parseNum(postComments, updated[editingPostIndex].comments),
      thumbnail_src: postThumbUrl || updated[editingPostIndex].thumbnail_src,
      display_url: postThumbUrl || updated[editingPostIndex].display_url,
    };
    setPosts(updated);
    setEditingPostIndex(null);
  };

  // Add New Post
  const handleSaveNewPost = () => {
    const newPost: ProfilePost = {
      id: `custom_post_${Date.now()}`,
      shortcode: `custom_${Date.now()}`,
      is_video: true,
      display_url: postThumbUrl || avatarUrl,
      thumbnail_src: postThumbUrl || avatarUrl,
      likes: parseNum(postLikes, 1200),
      views: parseNum(postViews, 24000),
      comments: parseNum(postComments, 45),
      caption: postCaption.trim() || `New post by @${username}`,
      timestamp: Math.floor(Date.now() / 1000),
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    setPostsCount(updated.length.toString());
    setIsAddPostOpen(false);
    setPostCaption("");
    setPostThumbUrl("");
  };

  return (
    <div
      className="clone-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="clone-modal-dialog max-w-[500px] w-full max-h-[92vh] flex flex-col overflow-hidden bg-white text-ink rounded-t-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="clone-modal-drag-bar" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#ededed]">
          <button
            type="button"
            className="text-sm font-medium text-subtle hover:text-ink cursor-pointer bg-transparent border-none p-1"
            onClick={onClose}
          >
            Cancel
          </button>
          <h2 className="text-base font-bold text-center flex-1">Edit profile</h2>
          <button
            type="button"
            className="text-sm font-bold text-[#0095f6] hover:text-[#00376b] cursor-pointer bg-transparent border-none p-1"
            onClick={handleSave}
          >
            Done
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-[#ededed] bg-[#fbfbfb] text-xs font-semibold">
          <button
            type="button"
            className={`flex-1 py-2.5 text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === "info"
                ? "border-black text-black font-bold bg-white"
                : "border-transparent text-subtle hover:text-ink"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Profile Info
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === "stats"
                ? "border-black text-black font-bold bg-white"
                : "border-transparent text-subtle hover:text-ink"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Stats & Badge
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === "posts"
                ? "border-black text-black font-bold bg-white"
                : "border-transparent text-subtle hover:text-ink"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts ({posts.length})
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-center border-b-2 cursor-pointer transition-colors ${
              activeTab === "highlights"
                ? "border-black text-black font-bold bg-white"
                : "border-transparent text-subtle hover:text-ink"
            }`}
            onClick={() => setActiveTab("highlights")}
          >
            Highlights ({highlights.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "info" && (
            <div className="space-y-4">
              {/* Profile Avatar Section */}
              <div className="flex flex-col items-center py-2">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-20 h-20 rounded-full object-cover border border-[#e5e5e5] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPhotoPickerOpen(true)}
                    className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                    title="Change photo"
                  >
                    <IgCamera size={20} />
                    <span className="text-[10px] font-semibold mt-0.5">Change</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="mt-2 text-xs font-semibold text-[#0095f6] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Change profile photo
                </button>
              </div>

              {/* Photo Picker Drawer / Dialog */}
              {isPhotoPickerOpen && (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e5e5e5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-ink">Change Profile Photo</p>
                    <button
                      type="button"
                      onClick={() => setIsPhotoPickerOpen(false)}
                      className="text-subtle hover:text-ink bg-transparent border-none cursor-pointer p-0.5"
                    >
                      <IgClose size={14} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 bg-white border border-[#dbdbdb] rounded-lg font-semibold text-ink hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <IgImage size={15} className="text-[#0095f6]" /> Choose Photo from Device
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-subtle mb-1">Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Username</label>
                  <div className="flex items-center border border-[#dbdbdb] rounded-lg bg-white focus-within:border-black">
                    <span className="pl-3 text-subtle font-medium text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ""))}
                      placeholder="username"
                      className="w-full px-2 py-2 text-sm bg-transparent border-none focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Category / Pronouns</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Digital Creator, Public Figure, Artist"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write your bio..."
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black resize-none"
                  />
                  <p className="text-[11px] text-subtle mt-0.5 text-right">{bio.length} characters</p>
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Links / Website URL</label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Threads Username (Badge)</label>
                  <div className="flex items-center border border-[#dbdbdb] rounded-lg bg-white focus-within:border-black">
                    <span className="pl-3 text-subtle font-medium text-sm">@</span>
                    <input
                      type="text"
                      value={threadsUsername}
                      onChange={(e) => setThreadsUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ""))}
                      placeholder="threads_username"
                      className="w-full px-2 py-2 text-sm bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-subtle">Appears as the Threads pill badge beside "+ Add banners" on your profile.</span>
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Avatar Note Bubble</label>
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. Start your first note..."
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                  <span className="text-[10px] text-subtle">Appears above profile photo on your profile & stories.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATS & BADGE */}
          {activeTab === "stats" && (
            <div className="space-y-4 text-xs">
              {/* Verification Switch */}
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] rounded-xl border border-[#e5e5e5]">
                <div className="flex items-center gap-2">
                  <IgVerified size={20} className="text-[#0095f6]" />
                  <div>
                    <p className="font-bold text-ink text-sm">Verified Badge</p>
                    <p className="text-[11px] text-subtle">Display blue tick next to username</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0095f6]"></div>
                </label>
              </div>

              {/* Stats Numerical Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-subtle mb-1">Followers Count</label>
                  <input
                    type="text"
                    value={followersCount}
                    onChange={(e) => setFollowersCount(e.target.value)}
                    placeholder="e.g. 1.2M, 64200, 6253"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                  <p className="text-[11px] text-subtle mt-0.5">Accepts full numbers (6253) or compact notation (1.2M, 54K).</p>
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Following Count</label>
                  <input
                    type="text"
                    value={followingCount}
                    onChange={(e) => setFollowingCount(e.target.value)}
                    placeholder="e.g. 939"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Posts Count</label>
                  <input
                    type="text"
                    value={postsCount}
                    onChange={(e) => setPostsCount(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-subtle mb-1">Professional Dashboard Views Text</label>
                  <input
                    type="text"
                    value={monthlyViews}
                    onChange={(e) => setMonthlyViews(e.target.value)}
                    placeholder="1.6M views in the last 30 days."
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-lg text-sm bg-white focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REELS & POSTS MANAGER */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-ink">Manage Grid Posts & Reels</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPostOpen(true);
                    setPostCaption("");
                    setPostLikes("1200");
                    setPostViews("24000");
                    setPostComments("45");
                    setPostThumbUrl("");
                  }}
                  className="px-3 py-1.5 bg-[#0095f6] text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer border-none hover:bg-[#1877f2] transition-colors"
                >
                  <IgPlus size={14} /> Add Post
                </button>
              </div>

              {/* Add New Post Form */}
              {isAddPostOpen && (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e5e5e5] space-y-2.5 text-xs">
                  <p className="font-bold text-sm text-ink">New Post / Reel</p>

                  <div className="flex items-center gap-3">
                    {postThumbUrl ? (
                      <div className="relative group">
                        <img
                          src={postThumbUrl}
                          alt="Preview"
                          className="w-14 h-14 rounded-lg object-cover border border-[#dbdbdb]"
                        />
                        <button
                          type="button"
                          onClick={() => setPostThumbUrl("")}
                          className="absolute -top-1.5 -right-1.5 bg-black/70 text-white rounded-full p-0.5 border-none cursor-pointer"
                          title="Remove image"
                        >
                          <IgClose size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[#dbdbdb] flex flex-col items-center justify-center text-subtle bg-gray-50">
                        <IgImage size={18} />
                      </div>
                    )}
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => postFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-white border border-[#dbdbdb] rounded-lg font-semibold text-ink hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <IgImage size={15} className="text-[#0095f6]" /> {postThumbUrl ? "Change Image" : "Upload Image from Device"}
                      </button>
                      <input
                        type="file"
                        ref={postFileInputRef}
                        onChange={handlePostFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-subtle mb-0.5">Caption</label>
                    <textarea
                      rows={2}
                      value={postCaption}
                      onChange={(e) => setPostCaption(e.target.value)}
                      placeholder="Post caption..."
                      className="w-full px-2.5 py-1.5 border border-[#dbdbdb] rounded-lg bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Views</label>
                      <input
                        type="text"
                        value={postViews}
                        onChange={(e) => setPostViews(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Likes</label>
                      <input
                        type="text"
                        value={postLikes}
                        onChange={(e) => setPostLikes(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Comments</label>
                      <input
                        type="text"
                        value={postComments}
                        onChange={(e) => setPostComments(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddPostOpen(false)}
                      className="px-3 py-1.5 border border-[#dbdbdb] rounded-lg bg-white cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNewPost}
                      className="px-3 py-1.5 bg-[#0095f6] text-white rounded-lg cursor-pointer border-none font-semibold"
                    >
                      Add to Grid
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Post Modal */}
              {editingPostIndex !== null && (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#0095f6] space-y-2.5 text-xs">
                  <p className="font-bold text-sm text-[#0095f6]">Editing Post #{editingPostIndex + 1}</p>

                  <div className="flex items-center gap-3">
                    <img
                      src={postThumbUrl || avatarUrl}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover border border-[#dbdbdb]"
                    />
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => postFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-white border border-[#dbdbdb] rounded-lg font-semibold text-ink hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <IgImage size={15} className="text-[#0095f6]" /> Choose New Image from Device
                      </button>
                      <input
                        type="file"
                        ref={postFileInputRef}
                        onChange={handlePostFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-subtle mb-0.5">Caption</label>
                    <textarea
                      rows={2}
                      value={postCaption}
                      onChange={(e) => setPostCaption(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#dbdbdb] rounded-lg bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Views</label>
                      <input
                        type="text"
                        value={postViews}
                        onChange={(e) => setPostViews(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Likes</label>
                      <input
                        type="text"
                        value={postLikes}
                        onChange={(e) => setPostLikes(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-subtle mb-0.5">Comments</label>
                      <input
                        type="text"
                        value={postComments}
                        onChange={(e) => setPostComments(e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingPostIndex(null)}
                      className="px-3 py-1.5 border border-[#dbdbdb] rounded-lg bg-white cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePostEdit}
                      className="px-3 py-1.5 bg-[#0095f6] text-white rounded-lg cursor-pointer border-none font-semibold"
                    >
                      Save Post
                    </button>
                  </div>
                </div>
              )}

              {/* Posts List */}
              <div className="space-y-2">
                {posts.map((post, idx) => (
                  <div
                    key={post.id || `post_${idx}`}
                    className="flex items-center gap-3 p-2 bg-white border border-[#ededed] rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={post.thumbnail_src || post.display_url}
                      alt={`Post ${idx + 1}`}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-ink truncate">{post.caption || `Post #${idx + 1}`}</p>
                      <div className="flex gap-2 text-[11px] text-subtle mt-0.5">
                        <span>👁️ {(post.views || 0).toLocaleString()}</span>
                        <span>❤️ {(post.likes || 0).toLocaleString()}</span>
                        <span>💬 {(post.comments || 0).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(idx)}
                        className="p-1.5 text-subtle hover:text-[#0095f6] bg-transparent border-none cursor-pointer"
                        title="Edit post"
                      >
                        <IgEdit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(idx)}
                        className="p-1.5 text-subtle hover:text-red-500 bg-transparent border-none cursor-pointer"
                        title="Delete post"
                      >
                        <IgTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HIGHLIGHTS */}
          {activeTab === "highlights" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-ink">Story Highlights</p>
                  <p className="text-[11px] text-subtle">
                    Add, edit, reposition, or delete your highlights.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingHighlightIndex(null);
                    setHighlightTitle("");
                    setHighlightCoverUrl("");
                    setIsAddHighlightOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#0095f6] text-white rounded-lg text-xs font-semibold hover:bg-[#1877f2] transition-colors cursor-pointer border-none flex items-center gap-1"
                >
                  <IgPlus size={14} /> New Highlight
                </button>
              </div>

              {/* Add New Highlight Form */}
              {isAddHighlightOpen && (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#e5e5e5] space-y-3 text-xs">
                  <p className="font-bold text-sm text-ink">Add New Highlight</p>

                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      {highlightCoverUrl ? (
                        <img
                          src={highlightCoverUrl}
                          alt="Cover"
                          className="w-14 h-14 rounded-full object-cover border border-[#dbdbdb]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#dbdbdb] flex flex-col items-center justify-center text-subtle bg-gray-50">
                          <IgCamera size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => highlightFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-white border border-[#dbdbdb] rounded-lg font-semibold text-ink hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <IgImage size={15} className="text-[#0095f6]" />{" "}
                        {highlightCoverUrl ? "Change Cover" : "Upload Cover from Device"}
                      </button>
                      <input
                        type="file"
                        ref={highlightFileInputRef}
                        onChange={handleHighlightFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-subtle mb-0.5">Highlight Name</label>
                    <input
                      type="text"
                      value={highlightTitle}
                      onChange={(e) => setHighlightTitle(e.target.value)}
                      placeholder="e.g. Vacation, Vibes, Art..."
                      className="w-full px-2.5 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddHighlightOpen(false)}
                      className="px-3 py-1.5 border border-[#dbdbdb] rounded-lg bg-white cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNewHighlight}
                      className="px-3 py-1.5 bg-[#0095f6] text-white rounded-lg cursor-pointer border-none font-semibold"
                    >
                      Add Highlight
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Highlight Form */}
              {editingHighlightIndex !== null && (
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#0095f6] space-y-3 text-xs">
                  <p className="font-bold text-sm text-[#0095f6]">
                    Editing Highlight #{editingHighlightIndex + 1}
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={highlightCoverUrl || highlights[editingHighlightIndex]?.coverUrl || avatarUrl}
                      alt="Cover preview"
                      className="w-14 h-14 rounded-full object-cover border border-[#dbdbdb]"
                    />
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => highlightFileInputRef.current?.click()}
                        className="w-full py-2 px-3 bg-white border border-[#dbdbdb] rounded-lg font-semibold text-ink hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <IgImage size={15} className="text-[#0095f6]" /> Choose New Cover from Device
                      </button>
                      <input
                        type="file"
                        ref={highlightFileInputRef}
                        onChange={handleHighlightFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-subtle mb-0.5">Highlight Name</label>
                    <input
                      type="text"
                      value={highlightTitle}
                      onChange={(e) => setHighlightTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#dbdbdb] rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingHighlightIndex(null)}
                      className="px-3 py-1.5 border border-[#dbdbdb] rounded-lg bg-white cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveHighlightEdit}
                      className="px-3 py-1.5 bg-[#0095f6] text-white rounded-lg cursor-pointer border-none font-semibold"
                    >
                      Save Highlight
                    </button>
                  </div>
                </div>
              )}

              {/* Highlights List with Reposition Controls */}
              <div className="space-y-2">
                {highlights.length === 0 ? (
                  <p className="text-xs text-subtle text-center py-4">
                    No highlights added yet. Click &quot;New Highlight&quot; above to create one.
                  </p>
                ) : (
                  highlights.map((hl, idx) => (
                    <div
                      key={hl.id || `hl_${idx}`}
                      className="flex items-center gap-3 p-2.5 bg-white border border-[#ededed] rounded-xl hover:border-gray-300 transition-colors"
                    >
                      {hl.coverUrl ? (
                        <img
                          src={hl.coverUrl}
                          alt={hl.title}
                          className="w-12 h-12 rounded-full object-cover border border-[#dbdbdb] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-[#dbdbdb] flex items-center justify-center font-bold text-xs text-subtle flex-shrink-0">
                          {hl.title.slice(0, 1).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-ink truncate">{hl.title}</p>
                        <p className="text-[11px] text-subtle mt-0.5">Position #{idx + 1}</p>
                      </div>

                      {/* Reposition Arrows & Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveHighlight(idx, "left")}
                          disabled={idx === 0}
                          className={`p-1.5 rounded bg-transparent border-none cursor-pointer ${
                            idx === 0
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-subtle hover:text-black hover:bg-gray-100"
                          }`}
                          title="Move Up / Left"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveHighlight(idx, "right")}
                          disabled={idx === highlights.length - 1}
                          className={`p-1.5 rounded bg-transparent border-none cursor-pointer ${
                            idx === highlights.length - 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-subtle hover:text-black hover:bg-gray-100"
                          }`}
                          title="Move Down / Right"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditHighlight(idx)}
                          className="p-1.5 text-subtle hover:text-[#0095f6] hover:bg-blue-50 rounded bg-transparent border-none cursor-pointer"
                          title="Edit highlight"
                        >
                          <IgEdit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHighlight(idx)}
                          className="p-1.5 text-subtle hover:text-red-500 hover:bg-red-50 rounded bg-transparent border-none cursor-pointer"
                          title="Delete highlight"
                        >
                          <IgTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#ededed] flex items-center justify-between bg-[#fbfbfb]">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer bg-transparent border-none p-1"
          >
            Reset to default
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-[#dbdbdb] rounded-lg bg-white hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-lg hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer border-none shadow-sm shadow-pink-500/25"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
