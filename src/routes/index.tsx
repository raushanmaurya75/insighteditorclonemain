import { createFileRoute, Link } from "@tanstack/react-router";
import { IgHeart, IgMore, IgMusic, IgMuted, IgPlus } from "@/components/ig-icons";
import { FloatingBottomNav } from "@/components/floating-bottom-nav";
import storySelfie from "@/assets/home-story-selfie.jpg";
import storyMan from "@/assets/home-story-man.jpg";
import storyPerfume from "@/assets/home-story-perfume.jpg";
import storyPackaging from "@/assets/home-story-packaging.jpg";
import riverPost from "@/assets/home-river.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instagram Home Feed" },
      {
        name: "description",
        content: "Instagram-style home feed with stories, reels and profile.",
      },
      { property: "og:title", content: "Instagram Home Feed" },
      {
        property: "og:description",
        content: "Instagram-style home feed with stories, reels and profile.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeFeedPage,
});

const stories = [
  { name: "Your story", image: storySelfie, own: true, to: "/profile" },
  { name: "4276_official_b...", image: storyMan, own: false, to: "/insight-view" },
  { name: "scentedbyshubh", image: storyPerfume, own: false, to: "/dashboard" },
  { name: "rg_packaging", image: storyPackaging, own: false, to: "/insights" },
];

function InstagramMark() {
  return <span className="feed-wordmark">Instagram</span>;
}

function HomeFeedPage() {
  return (
    <main className="feed-page">
      <div className="feed-phone">
        <header className="feed-header">
          <Link
            to="/insight-view"
            aria-label="Create reel / View Insights"
            title="Reels & Insights"
          >
            <IgPlus />
          </Link>
          <InstagramMark />
          <Link to="/insights" aria-label="Activity and Insights" title="Activity & Insights">
            <IgHeart />
          </Link>
        </header>

        <section className="feed-stories" aria-label="Stories">
          {stories.map((story) => (
            <Link
              to={story.to}
              className="feed-story text-inherit no-underline"
              key={story.name}
              title={story.name}
            >
              <span className={story.own ? "feed-story-ring own" : "feed-story-ring"}>
                <img src={story.image} alt="" width={512} height={512} loading="lazy" />
                {story.own ? (
                  <i>
                    <IgPlus />
                  </i>
                ) : null}
              </span>
              <small>{story.name}</small>
            </Link>
          ))}
        </section>

        <article className="feed-post">
          <img
            className="feed-post-image"
            src={riverPost}
            alt="River and city skyline on a hazy day"
            width={768}
            height={1365}
          />
          <div className="feed-post-shade" />
          <header className="feed-post-head">
            <Link to="/profile" className="feed-author-avatar" title="View Profile">
              <img src={storyMan} alt="" width={512} height={512} />
            </Link>
            <div>
              <Link to="/profile" className="text-inherit no-underline" title="View Profile">
                <strong>
                  4276_official_bharat<span className="feed-follow">/21k</span>
                </strong>
              </Link>
              <Link
                to="/insight-view"
                className="text-inherit no-underline"
                title="View Audio & Reel Insights"
              >
                <span>
                  <IgMusic /> nBeats · Sonido De Alarma Molesto
                </span>
              </Link>
            </div>
            <Link to="/dashboard" aria-label="Dashboard options" title="Creator Dashboard">
              <IgMore />
            </Link>
          </header>
          <div className="feed-post-copy" aria-hidden="true">
            <b>9/9/2026</b>
            <strong>पुनपुन नदी चढ़ी</strong>
          </div>
          <button type="button" aria-label="Mute video" className="feed-mute">
            <IgMuted />
          </button>
        </article>

        <FloatingBottomNav />
      </div>
    </main>
  );
}
