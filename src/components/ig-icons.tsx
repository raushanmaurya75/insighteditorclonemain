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
    <path
      d="M17 2l4 4-4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 11V9a4 4 0 0 1 4-4h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 22l-4-4 4-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 13v2a4 4 0 0 1-4 4H3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IgTagged = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 19.5a6 6 0 0 1 11 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
        d="M22.513 3.576C21.826 2.552 20.617 2 19.384 2H4.621c-1.474 0-2.878.818-3.46 2.173-.6 1.398-.297 2.935.784 3.997l3.359 3.295a1 1 0 0 0 1.195.156l8.522-4.849a1 1 0 1 1 .988 1.738l-8.526 4.851a1 1 0 0 0-.477 1.104l1.218 5.038c.343 1.418 1.487 2.534 2.927 2.766.208.034.412.051.616.051 1.26 0 2.401-.644 3.066-1.763l7.796-13.118a3.572 3.572 0 0 0-.116-3.863Z"
        fill="currentColor"
      />
    ) : (
      <>
        <path
          d="M22.513 3.576C21.826 2.552 20.617 2 19.384 2H4.621c-1.474 0-2.878.818-3.46 2.173-.6 1.398-.297 2.935.784 3.997l3.359 3.295c.5.5.9 1.1 1.4 1.8l1.218 5.038c.343 1.418 1.487 2.534 2.927 2.766.208.034.412.051.616.051 1.26 0 2.401-.644 3.066-1.763l7.796-13.118a3.572 3.572 0 0 0-.116-3.863Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          x1="6.3"
          y1="12.4"
          x2="15.5"
          y2="7.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
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

export const IgHeart = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M12 21.593c-1.073-.756-2.998-2.417-4.999-4.176C4.084 14.831 1.5 12.53 1.5 9.187 1.5 5.482 4.187 2.9 7.2 2.9c1.96 0 3.575 1.083 4.8 2.746C13.226 3.983 14.84 2.9 16.8 2.9c3.013 0 5.7 2.582 5.7 6.287 0 3.344-2.584 5.645-5.501 8.23-2.001 1.759-3.926 3.42-4.999 4.176Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Svg>
);

export const IgMusic = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18.5a3.5 3.5 0 1 1-2-3.16V5.42a1 1 0 0 1 .74-.97l9-2.4A1 1 0 0 1 18 3.02V14.5a3.5 3.5 0 1 1-2-3.16V7.3l-7 1.87V18.5Z" />
  </Svg>
);

export const IgMuted = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3.2a1 1 0 0 0-1.6-.8L6.7 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.7l4.7 3.6a1 1 0 0 0 1.6-.8V3.2Zm3.3 5.1a1 1 0 0 1 1.4 0L20 10.6l2.3-2.3a1 1 0 1 1 1.4 1.4L21.4 12l2.3 2.3a1 1 0 0 1-1.4 1.4L20 13.4l-2.3 2.3a1 1 0 0 1-1.4-1.4l2.3-2.3-2.3-2.3a1 1 0 0 1 0-1.4Z" />
  </Svg>
);

export const IgMore = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
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
    <line
      x1="22"
      y1="2"
      x2="11"
      y2="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polygon
      points="22 2 15 22 11 13 2 9 22 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IgPersonTagged = (p: IconProps) => (
  <Svg size={14} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </Svg>
);

