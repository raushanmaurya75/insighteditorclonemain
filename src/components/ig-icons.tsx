import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, viewBox = "0 0 24 24", ...rest }: IconProps) {
  return (
    <svg role="img" fill="currentColor" height={size} width={size} viewBox={viewBox} {...rest}>
      {children}
    </svg>
  );
}

export const IgPlus = (p: IconProps) => (
  <Svg {...p}>
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const IgCreate = (p: IconProps) => (
  <Svg {...p}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const IgMenu = (p: IconProps) => (
  <Svg {...p}>
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="3"
      x2="21"
      y1="4"
      y2="4"
    />
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="3"
      x2="21"
      y1="12"
      y2="12"
    />
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="3"
      x2="21"
      y1="20"
      y2="20"
    />
  </Svg>
);

export const IgChevronDown = ({ size = 12, ...p }: IconProps) => (
  <Svg size={size} {...p}>
    <path d="M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 15.087l8.293-8.296a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293Z" />
  </Svg>
);

export const IgVerified = ({ size = 18, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 40 40" fill="rgb(0, 149, 246)" {...p}>
    <path
      d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
      fillRule="evenodd"
    />
  </Svg>
);

export const IgLink = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M13.638 10.362a5.5 5.5 0 0 1 0 7.777l-2.121 2.122a5.5 5.5 0 0 1-7.778-7.778l2.122-2.121M10.362 13.638a5.5 5.5 0 0 1 0-7.777l2.121-2.122a5.5 5.5 0 0 1 7.778 7.778l-2.122 2.121"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Svg>
);

export const IgDashboard = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 12a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Zm8-3a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1Zm-4-2a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z" />
    <path d="M18.44 1H5.567a4.565 4.565 0 0 0-4.56 4.56v12.873a4.565 4.565 0 0 0 4.56 4.56H18.44a4.565 4.565 0 0 0 4.56-4.56V5.56A4.565 4.565 0 0 0 18.44 1ZM21 18.433a2.563 2.563 0 0 1-2.56 2.56H5.567a2.563 2.563 0 0 1-2.56-2.56V5.56A2.563 2.563 0 0 1 5.568 3H18.44A2.563 2.563 0 0 1 21 5.56v12.873Z" />
  </Svg>
);

export const IgGrid = (p: IconProps) => (
  <Svg {...p}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="9"
      y1="3"
      x2="9"
      y2="21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="15"
      y1="3"
      x2="15"
      y2="21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="15"
      x2="21"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export type NavIconProps = IconProps & { active?: boolean };

export const IgReels = ({ active = false, ...p }: NavIconProps) => (
  <Svg {...p}>
    <path
      d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.535Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z"
      fill={active ? "currentColor" : "none"}
      stroke={active ? "none" : "currentColor"}
      strokeWidth={active ? 0 : 2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

export const IgRepost = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" />
  </Svg>
);

export const IgTagged = ({ size = 24, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path
      d="M21 7.48a2 2 0 0 0-2-2h-3.046a2.002 2.002 0 0 1-1.506-.683l-1.695-1.939a1 1 0 0 0-1.506 0L9.552 4.797c-.38.434-.93.682-1.506.682H5a2 2 0 0 0-2 2V19l.01.206A2 2 0 0 0 5 21h14a2 2 0 0 0 2-2V7.48ZM23 19a4 4 0 0 1-4 4H5a4 4 0 0 1-3.995-3.794L1 19V7.48a4 4 0 0 1 4-4h3.046l1.696-1.94a3 3 0 0 1 4.516 0l1.696 1.94H19a4 4 0 0 1 4 4V19Z"
      fill="currentColor"
    />
    <path
      d="M14.5 10.419a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM12 16.003c3.511 0 6.555 1.99 8.13 4.906a1 1 0 0 1-1.76.95c-1.248-2.31-3.64-3.857-6.37-3.857S6.878 19.55 5.63 21.86a1 1 0 0 1-1.76-.951c1.575-2.915 4.618-4.906 8.13-4.906Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgHome = ({ active = false, ...p }: NavIconProps) => (
  <Svg {...p}>
    {active ? (
      <path
        d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894Z"
        fill="currentColor"
      />
    ) : (
      <path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z" />
    )}
  </Svg>
);

export const IgMessages = ({ active = false, ...p }: NavIconProps) => (
  <Svg {...p}>
    {active ? (
      <path
        d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
        fill="currentColor"
      />
    ) : (
      <>
        <path
          d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="7.488"
          x2="15.515"
          y1="12.208"
          y2="7.641"
        />
      </>
    )}
  </Svg>
);

export const IgSearch = ({ active = false, ...p }: NavIconProps) => (
  <Svg {...p}>
    <path
      d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={active ? "3" : "2"}
    />
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={active ? "3" : "2"}
      x1="16.511"
      x2="22"
      y1="16.511"
      y2="22"
    />
  </Svg>
);

export const IgPlayCount = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </Svg>
);

export const IgDiscord = (p: IconProps) => (
  <Svg {...p} viewBox="0 0 127.14 96.36">
    <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15ZM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69Zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69Z" />
  </Svg>
);

export type HeartIconProps = IconProps & { active?: boolean; filled?: boolean };

export const IgHeart = ({ active = false, filled = false, fill, color, stroke, ...p }: HeartIconProps) => {
  const isFilled = active || filled || (fill && fill !== "none") || color === "#ff2d55" || color === "#ff3040" || stroke === "#ff2d55" || stroke === "#ff3040";
  return (
    <Svg {...p}>
      {isFilled ? (
        <path
          d="M16.792 1.904A6.04 6.04 0 0 0 11.995 4.031 6.052 6.052 0 0 0 7.208 1.904A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
          fill={fill && fill !== "none" ? fill : color ?? stroke ?? "#ff3040"}
        />
      ) : (
        <path
          d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
          fill="currentColor"
        />
      )}
    </Svg>
  );
};

export const IgMusic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18.5a3.5 3.5 0 1 1-2-3.16V5.42a1 1 0 0 1 .74-.97l9-2.4A1 1 0 0 1 18 3.02V14.5a3.5 3.5 0 1 1-2-3.16V7.3l-7 1.87V18.5Z" />
  </Svg>
);

export const IgMuted = (p: IconProps) => (
  <Svg viewBox="0 0 48 48" {...p}>
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"
    />
  </Svg>
);

export const IgMore = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </Svg>
);

export const IgSignal = (p: IconProps) => (
  <Svg {...p}>
    <rect x="1" y="15" width="4" height="6" rx="1" />
    <rect x="7" y="11" width="4" height="10" rx="1" />
    <rect x="13" y="7" width="4" height="14" rx="1" />
    <rect x="19" y="3" width="4" height="18" rx="1" />
  </Svg>
);

export const IgWifi = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Zm0-8.1c1.9 0 3.7.7 5 2a1 1 0 0 0 1.4-1.4A9.1 9.1 0 0 0 12 9.4c-2.4 0-4.8.9-6.4 2.6A1 1 0 0 0 7 13.4a7.1 7.1 0 0 1 5-2Zm0-5.4c3.3 0 6.4 1.3 8.7 3.6a1 1 0 0 0 1.4-1.4A14.5 14.5 0 0 0 12 4C8.1 4 4.4 5.5 1.9 8.2a1 1 0 1 0 1.4 1.4A12.5 12.5 0 0 1 12 6Z" />
  </Svg>
);

export const IgBattery = (p: IconProps) => (
  <Svg {...p} viewBox="0 0 32 24">
    <rect
      x="1"
      y="6"
      width="26"
      height="13"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity=".5"
    />
    <rect x="3.5" y="8.5" width="14" height="8" rx="2" />
    <path d="M29 10.5v4a2.6 2.6 0 0 0 0-4Z" />
  </Svg>
);

export const IgComment = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Svg>
);

export const IgBookmark = ({ active = false, ...p }: NavIconProps) => (
  <Svg {...p}>
    <polygon
      fill={active ? "currentColor" : "none"}
      points="20 21 12 13.44 4 21 4 3 20 3 20 21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Svg>
);

export const IgTwoLines = (p: IconProps) => (
  <Svg size={20} {...p}>
    <line
      x1="4"
      y1="9"
      x2="20"
      y2="9"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="4"
      y1="15"
      x2="14"
      y2="15"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </Svg>
);

export const IgShare = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <line
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      x1="7.488"
      x2="15.515"
      y1="12.208"
      y2="7.641"
    />
  </Svg>
);

export const IgPersonTagged = (p: IconProps) => (
  <Svg size={12} viewBox="0 0 24 24" {...p}>
    <path
      d="M12 12c3.032 0 5.5-2.468 5.5-5.5S15.032 1 12 1a5.507 5.507 0 0 0-5.5 5.5C6.5 9.532 8.968 12 12 12Zm9.553 6.27C19.396 15.283 15.825 13.5 12 13.5c-3.824 0-7.396 1.782-9.552 4.768a2.317 2.317 0 0 0-.315 2.149 2.45 2.45 0 0 0 1.665 1.537C5.517 22.431 8.335 23 12 23c3.668 0 6.479-.565 8.19-1.04a2.464 2.464 0 0 0 1.678-1.544 2.312 2.312 0 0 0-.315-2.146Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <polyline
      points="12 6.5 12 12 15.5 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IgClip = ({ size = 17, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path
      d="M22.942 7.464c-.062-1.36-.306-2.143-.511-2.671a5.366 5.366 0 0 0-1.272-1.952 5.364 5.364 0 0 0-1.951-1.27c-.53-.207-1.312-.45-2.673-.513-1.2-.054-1.557-.066-4.535-.066s-3.336.012-4.536.066c-1.36.062-2.143.306-2.672.511-.769.3-1.371.692-1.951 1.272s-.973 1.182-1.27 1.951c-.207.53-.45 1.312-.513 2.673C1.004 8.665.992 9.022.992 12s.012 3.336.066 4.536c.062 1.36.306 2.143.511 2.671.298.77.69 1.373 1.272 1.952.58.581 1.182.974 1.951 1.27.53.207 1.311.45 2.673.513 1.199.054 1.557.066 4.535.066s3.336-.012 4.536-.066c1.36-.062 2.143-.306 2.671-.511a5.368 5.368 0 0 0 1.953-1.273c.58-.58.972-1.181 1.27-1.95.206-.53.45-1.312.512-2.673.054-1.2.066-1.557.066-4.535s-.012-3.336-.066-4.535Zm-7.085 6.055-5.25 3c-1.167.667-2.619-.175-2.619-1.519V9c0-1.344 1.452-2.186 2.619-1.52l5.25 3c1.175.672 1.175 2.368 0 3.04Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgCarouselIcon = ({ size = 17, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 48 48" {...p}>
    <path
      d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"
      fill="currentColor"
    />
  </Svg>
);

export const IgPlay = ({ size = 14, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path
      d="M6 3.5a1 1 0 0 1 1.53-.848l12 7.5a1 1 0 0 1 0 1.696l-12 7.5A1 1 0 0 1 6 18.5v-15Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgClose = ({ size = 18, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const IgTrash = ({ size = 16, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <polyline points="3 6 5 6 21 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const IgEdit = ({ size = 16, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IgImage = ({ size = 16, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <polyline points="21 15 16 10 5 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IgCamera = ({ size = 18, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
  </Svg>
);

export const IgInstagramGlyph = ({ size = 72, className, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...p}
  >
    <defs>
      <linearGradient id="ig-splash-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5.5"
      stroke="url(#ig-splash-grad)"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="4.5"
      stroke="url(#ig-splash-grad)"
      strokeWidth="1.8"
    />
    <circle
      cx="17.5"
      cy="6.5"
      r="1.2"
      fill="url(#ig-splash-grad)"
    />
  </svg>
);

export const IgMetaLogo = ({ size = 20, ...p }: IconProps) => (
  <svg
    width={size}
    height={(size * 22) / 36}
    viewBox="0 0 36 22"
    fill="none"
    {...p}
  >
    <path
      d="M26.4 1.5C24.1 1.5 22 2.7 20.7 4.7C19.8 3.3 18.6 2.3 17.1 1.7C15.3 1 13.1 1.1 11.2 2.2C8 4 6.2 7.6 6.5 11.3C6.8 15 9.1 18.3 12.6 19.3C14.7 19.9 17 19.4 18.8 18.2C19.6 17.6 20.3 16.9 20.8 16.1C22.2 18.6 24.8 20.1 27.8 19.9C31.7 19.7 34.8 16.5 35 12.6C35.2 8.3 32.2 2.7 26.4 1.5ZM12 16.7C9.7 16.7 7.9 14.3 7.8 11.4C7.7 8.5 9.4 6.2 11.7 6.1C14 6 15.9 8.2 16.1 11.1C16.3 14 14.4 16.6 12 16.7ZM26.4 16.7C24.1 16.7 22.2 14.3 22.1 11.4C22 8.5 23.7 6.2 26 6.1C28.3 6 30.2 8.2 30.4 11.1C30.6 14 28.7 16.6 26.4 16.7Z"
      fill="currentColor"
    />
  </svg>
);

export const IgThreads = ({ size = 24, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 976.98 1082" {...p}>
    <path
      d="M770.347,500.347c-1.355-156.85-86.386-251.367-230.025-251.367-95.872,0-176.499,43.362-218.846,112.472l92.823,64.705c24.053-37.942,57.252-69.448,118.231-69.448,68.77,0,104.341,38.281,114.504,109.423-33.2-5.081-66.399-7.791-100.615-7.791-185.646,0-273.049,84.015-273.049,195.131,0,113.149,87.403,179.548,216.136,179.548,141.267,0,225.621-95.194,260.176-213.086,35.91,16.261,60.64,54.203,60.64,111.116,0,152.447-175.822,235.446-324.881,235.446-219.862,0-363.501-144.316-363.501-379.084,0-287.616,190.05-471.907,445.483-471.907,171.418,0,256.11,75.207,313.701,176.16l94.856-66.399C913.308,94.501,773.396,1,563.358,1,228.653,1,.999,238.478.999,583.008c0,315.057,222.911,497.992,488.507,497.992,219.523,0,441.418-128.055,441.418-347.24,0-114.504-65.721-190.389-160.577-233.413ZM485.441,718.854c-48.444,0-91.129-23.036-91.129-65.383,0-66.738,81.983-87.064,162.271-87.064,30.489,0,60.301,2.032,86.725,7.792-18.971,86.725-75.207,144.655-157.867,144.655Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgEye = ({ size = 20, ...p }: IconProps) => (
  <Svg size={size} viewBox="0 0 24 24" {...p}>
    <path
      d="M23.441 11.819C23.413 11.74 20.542 4 12 4S.587 11.74.559 11.819a1 1 0 0 0 1.881.677 10.282 10.282 0 0 1 19.12 0 1 1 0 0 0 1.881-.677Zm-7.124 2.368a3.359 3.359 0 0 1-1.54-.1 3.56 3.56 0 0 1-2.365-2.362 3.35 3.35 0 0 1-.103-1.542.99.99 0 0 0-1.134-1.107 5.427 5.427 0 0 0-3.733 2.34 5.5 5.5 0 0 0 8.446 6.97 5.402 5.402 0 0 0 1.536-3.09.983.983 0 0 0-1.107-1.109Z"
      fill="currentColor"
    />
  </Svg>
);

export const IgBackArrow = ({ size = 24, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const IgSkipRate = ({ size = 20, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M5.5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1.555.832l8-7a1 1 0 0 0 0-1.664l-8-7A1 1 0 0 0 5.5 4ZM18 4a1 1 0 0 0-1 1v14a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1Z" />
  </svg>
);






