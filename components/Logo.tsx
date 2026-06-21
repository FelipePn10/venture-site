import Link from 'next/link';

export const Logo = ({ tone = 'dark' }: { tone?: 'dark' | 'light' }) => {
  const ink = tone === 'dark' ? '#14201A' : '#FAF8EC';
  const acc = '#CBAB1F';
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path d="M4 5 L15 24 L26 5" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="6" r="2.6" fill={acc} />
      </svg>
      <span className="font-serif text-2xl tracking-tight" style={{ color: ink }}>
        Venture<span style={{ color: acc }}>ERP</span>
      </span>
    </Link>
  );
};
