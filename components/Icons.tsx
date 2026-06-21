import type { SVGProps, ReactNode } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

const Base = ({ children, size = 28, className = '', ...rest }: IconProps & { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

export const IconCoin = (p: IconProps) => (
  <Base {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M14 8.5v11" />
    <path d="M17 11c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 1.6 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
  </Base>
);

export const IconReceipt = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 3.5h14v21l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L9.3 22.9 7 24.5z" />
    <path d="M11 9h6M11 13h6M11 17h4" />
  </Base>
);

export const IconBox = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4 4.5 8.5v11L14 24l9.5-4.5v-11z" />
    <path d="M4.5 8.5 14 13l9.5-4.5" />
    <path d="M14 13v11" />
    <path d="m9 6 9.5 4.5" />
  </Base>
);

export const IconChartLine = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 22h20" />
    <path d="M5 18l5-6 4 3 5-9 4 5" />
    <circle cx="10" cy="12" r="1.2" fill="currentColor" />
    <circle cx="14" cy="15" r="1.2" fill="currentColor" />
    <circle cx="19" cy="6" r="1.2" fill="currentColor" />
  </Base>
);

export const IconUsers = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="10" r="3.5" />
    <path d="M4 23c.6-3.6 3.5-6 7-6s6.4 2.4 7 6" />
    <circle cx="20" cy="9" r="2.6" />
    <path d="M19 14c2.4.3 4.3 2 4.7 4.4" />
  </Base>
);

export const IconSpark = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3v6M14 19v6M3 14h6M19 14h6" />
    <path d="m6.5 6.5 3.4 3.4M18.1 18.1l3.4 3.4M6.5 21.5l3.4-3.4M18.1 9.9l3.4-3.4" />
    <circle cx="14" cy="14" r="2.4" />
  </Base>
);

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3 5 6.5v6.7c0 5.4 3.7 9.6 9 11.3 5.3-1.7 9-5.9 9-11.3V6.5z" />
    <path d="m10 14 3 3 5.5-6" />
  </Base>
);

export const IconBolt = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 3 6 16h7l-2 9 10-13h-7z" />
  </Base>
);

export const IconArrowOut = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 20 20 8" />
    <path d="M9 8h11v11" />
  </Base>
);

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 14 5 5L23 7" />
  </Base>
);

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 6v16M6 14h16" />
  </Base>
);

export const IconMinus = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 14h16" />
  </Base>
);

export const IconLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 17 7.5 20.5a4 4 0 0 1-5.6-5.6L5.5 11" />
    <path d="m17 11 3.5-3.5a4 4 0 1 1 5.6 5.6L22.5 17" />
    <path d="m9.5 18.5 9-9" />
  </Base>
);

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M14 8v6l4 2.5" />
  </Base>
);

export const IconGlobe = (p: IconProps) => (
  <Base {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M5 14h18M14 5c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
  </Base>
);

export const IconLeaf = (p: IconProps) => (
  <Base {...p}>
    <path d="M22 5c-9 0-16 4-16 12 0 3.5 2 6 5 7 1-9 6-13 11-13" />
    <path d="M6 24c2-7 6-11 13-13" />
  </Base>
);

export const IconArrow = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 14h18" />
    <path d="m17 8 6 6-6 6" />
  </Base>
);

export const IconQuote = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 18V12a4 4 0 0 1 4-4" />
    <path d="M5 18h6v-6H5z" />
    <path d="M15 18v-6a4 4 0 0 1 4-4" />
    <path d="M15 18h6v-6h-6z" />
  </Base>
);

export const IconStar = (p: IconProps) => (
  <Base {...p}>
    <path d="m14 3 3.3 7 7.7 1-5.6 5.4 1.4 7.6L14 20.4 7.2 24 8.6 16.4 3 11l7.7-1z" />
  </Base>
);

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 4.5h4l2 5-3 2c1.2 2.5 3 4.3 5.5 5.5l2-3 5 2v4c0 1.1-.9 2-2 2C9 22 6 9 5.5 6.5a2 2 0 0 1 1-2z" />
  </Base>
);

export const IconMail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="6" width="22" height="16" rx="2" />
    <path d="m3 6 11 9 11-9" />
  </Base>
);

export const IconMessage = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-5 5V6a2 2 0 0 1 2-2z" />
    <path d="M9 10h10M9 14h6" />
  </Base>
);

export const IconGear = (p: IconProps) => (
  <Base {...p}>
    <circle cx="14" cy="14" r="3.4" />
    <path d="M14 3v3.2M14 21.8V25M3 14h3.2M21.8 14H25M5.9 5.9l2.3 2.3M19.8 19.8l2.3 2.3M22.1 5.9l-2.3 2.3M8.2 19.8l-2.3 2.3" />
  </Base>
);

export const IconFactory = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 24V12l5 3.2v-3.2l5 3.2v-3.2l5 3.2V6h2.5v18z" />
    <path d="M8 24v-3.5M13 24v-3.5M18 24v-3.5" />
  </Base>
);

export const IconRuler = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="10" width="22" height="8" rx="1.2" />
    <path d="M7 10v3.2M11 10v4M15 10v3.2M19 10v4" />
  </Base>
);

export const IconLayers = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4 4 9l10 5 10-5z" />
    <path d="M4 14l10 5 10-5" />
    <path d="M4 19l10 5 10-5" />
  </Base>
);

export const IconScissors = (p: IconProps) => (
  <Base {...p}>
    <circle cx="7" cy="8" r="2.6" />
    <circle cx="7" cy="20" r="2.6" />
    <path d="M9.2 9.4 23 19M9.2 18.6 23 9M9.4 8.9 16 14" />
  </Base>
);

export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="6" width="20" height="18" rx="2" />
    <path d="M4 11h20M9 3v5M19 3v5" />
    <path d="M9 16h2M13 16h2M17 16h2M9 20h2M13 20h2" />
  </Base>
);

export const IconFlame = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3c1.2 4.2 5 5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.4 2.2-4.4.4 2 1.4 2.6 1.8 2.6-1.2-3.4 0-6.2 1-8.2z" />
  </Base>
);

export const IconTree = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 3 7 13h3.5l-4 6h15l-4-6H21z" />
    <path d="M14 19v5" />
  </Base>
);
