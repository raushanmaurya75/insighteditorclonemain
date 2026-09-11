import { createFileRoute } from "@tanstack/react-router";
import {
  IgHeart,
  IgHome,
  IgMessages,
  IgMore,
  IgMusic,
  IgMuted,
  IgPlus,
  IgReels,
  IgSearch,
} from "@/components/ig-icons";
import storySelfie from "@/assets/home-story-selfie.jpg";
import storyMan from "@/assets/home-story-man.jpg";
import storyPerfume from "@/assets/home-story-perfume.jpg";
import storyPackaging from "@/assets/home-story-packaging.jpg";
import riverPost from "@/assets/home-river.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Instagram Home Feed" },
      {
        name: "description",
        content: "Instagram-style home feed with stories and reels.",
      },
      { property: "og:title", content: "Instagram Home Feed" },
      {
        property: "og:description",
        content: "Instagram-style home feed with stories and reels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeFeedPage,
});

const stories = [
  { name: "Your story", image: storySelfie, own: true },
  { name: "4276_official_b...", image: storyMan },
  { name: "scentedbyshubh", image: storyPerfume },
  { name: "rg_packaging", image: storyPackaging },
];

function InstagramMark() {
  return <span className="feed-wordmark">Instagram</span>;
}

function HomeFeedPage() {
  return (
    <main className="feed-page">
      <div className="feed-phone">
        <header className="feed-header">
          <button type="button" aria-label="Create">
            <IgPlus />
          </button>
          <InstagramMark />
          <button type="button" aria-label="Activity">
            <IgHeart />
          </button>
        </header>

        <section className="feed-stories" aria-label="Stories">
          {stories.map((story) => (
            <button type="button" className="feed-story" key={story.name}>
              <span className={story.own ? "feed-story-ring own" : "feed-story-ring"}>
                <img src={story.image} alt="" width={512} height={512} loading="lazy" />
                {story.own ? (
                  <i>
                    <IgPlus />
                  </i>
                ) : null}
              </span>
              <small>{story.name}</small>
            </button>
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
            <span className="feed-author-avatar">
              <img src={storyMan} alt="" width={512} height={512} />
            </span>
            <div>
              <strong>
                4276_official_bharat<span className="feed-follow">/21k</span>
              </strong>
              <span>
                <IgMusic /> nBeats · Sonido De Alarma Molesto
              </span>
            </div>
            <button type="button" aria-label="Post options">
              <IgMore />
            </button>
          </header>
          <div className="feed-post-copy" aria-hidden="true">
            <b>9/9/2026</b>
            <strong>पुनपुन नदी चढ़ी</strong>
          </div>
          <button type="button" aria-label="Mute video" className="feed-mute">
            <IgMuted />
          </button>
        </article>

        <nav className="feed-bottom" aria-label="Main navigation">
          <button type="button" className="current" aria-label="Home">
            <IgHome />
          </button>
          <button type="button" aria-label="Reels">
            <IgReels />
          </button>
          <button type="button" aria-label="Messages">
            <IgMessages />
          </button>
          <button type="button" aria-label="Search">
            <IgSearch />
          </button>
          <button type="button" aria-label="Profile" className="feed-bottom-avatar">
            <img src={storySelfie} alt="" width={512} height={512} />
          </button>
        </nav>
      </div>
    </main>
  );
}
