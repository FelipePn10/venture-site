// Hand-tuned line-art icons. All 1.5px stroke, 28x28 viewBox.
// Exposed on window for use across other Babel scripts.

const Icon = ({ children, size = 28, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const IconCoin = (p) => (
  <Icon {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M14 8.5v11" />
    <path d="M17 11c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 1.6 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
  </Icon>
);

const IconReceipt = (p) => (
  <Icon {...p}>
    <path d="M7 3.5h14v21l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L9.3 22.9 7 24.5z" />
    <path d="M11 9h6M11 13h6M11 17h4" />
  </Icon>
);

const IconBox = (p) => (
  <Icon {...p}>
    <path d="M14 4 4.5 8.5v11L14 24l9.5-4.5v-11z" />
    <path d="M4.5 8.5 14 13l9.5-4.5" />
    <path d="M14 13v11" />
    <path d="m9 6 9.5 4.5" />
  </Icon>
);

const IconChartLine = (p) => (
  <Icon {...p}>
    <path d="M4 22h20" />
    <path d="M5 18l5-6 4 3 5-9 4 5" />
    <circle cx="10" cy="12" r="1.2" fill="currentColor" />
    <circle cx="14" cy="15" r="1.2" fill="currentColor" />
    <circle cx="19" cy="6" r="1.2" fill="currentColor" />
  </Icon>
);

const IconUsers = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="10" r="3.5" />
    <path d="M4 23c.6-3.6 3.5-6 7-6s6.4 2.4 7 6" />
    <circle cx="20" cy="9" r="2.6" />
    <path d="M19 14c2.4.3 4.3 2 4.7 4.4" />
  </Icon>
);

const IconSpark = (p) => (
  <Icon {...p}>
    <path d="M14 3v6M14 19v6M3 14h6M19 14h6" />
    <path d="m6.5 6.5 3.4 3.4M18.1 18.1l3.4 3.4M6.5 21.5l3.4-3.4M18.1 9.9l3.4-3.4" />
    <circle cx="14" cy="14" r="2.4" />
  </Icon>
);

const IconShield = (p) => (
  <Icon {...p}>
    <path d="M14 3 5 6.5v6.7c0 5.4 3.7 9.6 9 11.3 5.3-1.7 9-5.9 9-11.3V6.5z" />
    <path d="m10 14 3 3 5.5-6" />
  </Icon>
);

const IconBolt = (p) => (
  <Icon {...p}>
    <path d="M15 3 6 16h7l-2 9 10-13h-7z" />
  </Icon>
);

const IconArrowOut = (p) => (
  <Icon {...p}>
    <path d="M8 20 20 8" />
    <path d="M9 8h11v11" />
  </Icon>
);

const IconCheck = (p) => (
  <Icon {...p}>
    <path d="m5 14 5 5L23 7" />
  </Icon>
);

const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M14 6v16M6 14h16" />
  </Icon>
);

const IconMinus = (p) => (
  <Icon {...p}>
    <path d="M6 14h16" />
  </Icon>
);

const IconLink = (p) => (
  <Icon {...p}>
    <path d="M11 17 7.5 20.5a4 4 0 0 1-5.6-5.6L5.5 11" />
    <path d="m17 11 3.5-3.5a4 4 0 1 1 5.6 5.6L22.5 17" />
    <path d="m9.5 18.5 9-9" />
  </Icon>
);

const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M14 8v6l4 2.5" />
  </Icon>
);

const IconGlobe = (p) => (
  <Icon {...p}>
    <circle cx="14" cy="14" r="9" />
    <path d="M5 14h18M14 5c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
  </Icon>
);

const IconLeaf = (p) => (
  <Icon {...p}>
    <path d="M22 5c-9 0-16 4-16 12 0 3.5 2 6 5 7 1-9 6-13 11-13" />
    <path d="M6 24c2-7 6-11 13-13" />
  </Icon>
);

const IconArrow = (p) => (
  <Icon {...p}>
    <path d="M5 14h18" />
    <path d="m17 8 6 6-6 6" />
  </Icon>
);

const IconQuote = (p) => (
  <Icon {...p}>
    <path d="M5 18V12a4 4 0 0 1 4-4" />
    <path d="M5 18h6v-6H5z" />
    <path d="M15 18v-6a4 4 0 0 1 4-4" />
    <path d="M15 18h6v-6h-6z" />
  </Icon>
);

const IconStar = (p) => (
  <Icon {...p}>
    <path d="m14 3 3.3 7 7.7 1-5.6 5.4 1.4 7.6L14 20.4 7.2 24 8.6 16.4 3 11l7.7-1z" />
  </Icon>
);

Object.assign(window, {
  Icon,
  IconCoin, IconReceipt, IconBox, IconChartLine, IconUsers, IconSpark,
  IconShield, IconBolt, IconArrowOut, IconCheck, IconPlus, IconMinus,
  IconLink, IconClock, IconGlobe, IconLeaf, IconArrow, IconQuote, IconStar
});
