import { Link, useLocation } from "@tanstack/react-router";
import { IgHome, IgMessages, IgReels, IgSearch } from "@/components/ig-icons";
import { useProfile } from "@/lib/profile-store";
import defaultProfilePhoto from "@/assets/profile-photo.jpg";

interface FloatingBottomNavProps {
  className?: string;
}

export function FloatingBottomNav({ className }: FloatingBottomNavProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { profile } = useProfile();

  const isHome = pathname === "/" || pathname === "/home";
  const isReels = pathname === "/reel" || pathname === "/reels";
  const isDashboard = pathname === "/dashboard";
  const isInsights = pathname === "/insights";
  const isProfile = pathname === "/profile" || pathname === "/insight-view";

  const avatarSrc = profile.avatarUrl || defaultProfilePhoto;

  return (
    <nav className={`bottom-nav ${className ?? ""}`.trim()} aria-label="Main navigation">
      <Link to="/" className={isHome ? "current" : ""} aria-label="Home Feed" title="Home Feed">
        <IgHome active={isHome} />
      </Link>
      <Link
        to="/insight-view"
        className={isReels ? "current" : ""}
        aria-label="Reels"
        title="Reels"
      >
        <IgReels active={isReels} />
      </Link>
      <Link
        to="/dashboard"
        className={isDashboard ? "current" : ""}
        aria-label="Dashboard"
        title="Dashboard"
      >
        <IgMessages active={isDashboard} />
      </Link>
      <Link
        to="/insights"
        className={isInsights ? "current" : ""}
        aria-label="Insights"
        title="Insights"
      >
        <IgSearch active={isInsights} />
      </Link>
      <Link
        to="/profile"
        className={`mini-profile ${isProfile ? "current" : ""}`}
        aria-label="Profile"
        title="Profile"
      >
        <img
          src={avatarSrc}
          alt={profile.fullName || "Profile"}
          width={512}
          height={512}
          className="object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultProfilePhoto;
          }}
        />
      </Link>
    </nav>
  );
}
