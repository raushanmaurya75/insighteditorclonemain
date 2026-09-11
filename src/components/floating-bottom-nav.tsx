import { Link, useLocation } from "@tanstack/react-router";
import { IgHome, IgMessages, IgReels, IgSearch } from "@/components/ig-icons";
import profilePhoto from "@/assets/profile-photo.jpg";

interface FloatingBottomNavProps {
  className?: string;
}

export function FloatingBottomNav({ className }: FloatingBottomNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const isHome = pathname === "/" || pathname === "/home";
  const isReels = pathname === "/insight-view";
  const isDashboard = pathname === "/dashboard";
  const isInsights = pathname === "/insights";
  const isProfile = pathname === "/profile";

  return (
    <nav className={`bottom-nav ${className ?? ""}`.trim()} aria-label="Main navigation">
      <Link to="/" className={isHome ? "current" : ""} aria-label="Home Feed" title="Home Feed">
        <IgHome />
      </Link>
      <Link
        to="/insight-view"
        className={isReels ? "current" : ""}
        aria-label="Reels"
        title="Reels"
      >
        <IgReels />
      </Link>
      <Link
        to="/dashboard"
        className={isDashboard ? "current" : ""}
        aria-label="Dashboard"
        title="Dashboard"
      >
        <IgMessages />
      </Link>
      <Link
        to="/insights"
        className={isInsights ? "current" : ""}
        aria-label="Insights"
        title="Insights"
      >
        <IgSearch />
      </Link>
      <Link
        to="/profile"
        className={`mini-profile ${isProfile ? "current" : ""}`}
        aria-label="Profile"
        title="Profile"
      >
        <img src={profilePhoto} alt="Profile" width={512} height={512} />
      </Link>
    </nav>
  );
}
