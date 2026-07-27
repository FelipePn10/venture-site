import Link from 'next/link';
import { MARK_COLORS, MARK_PATHS } from '@/lib/brand';

/** Só a marca, sem o texto — mesma arte do favicon (ver lib/brand.ts). */
export const LogoMark = ({
  size = 30,
  tone = 'dark',
  className,
}: {
  size?: number;
  tone?: 'dark' | 'light';
  className?: string;
}) => {
  const c = MARK_COLORS[tone];
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <path d={MARK_PATHS.light} fill={c.light} />
      <path d={MARK_PATHS.mid} fill={c.mid} />
      <path d={MARK_PATHS.deep} fill={c.deep} />
      <path d={MARK_PATHS.darkest} fill={c.darkest} />
    </svg>
  );
};

export const Logo = ({ tone = 'dark' }: { tone?: 'dark' | 'light' }) => {
  const ink = tone === 'dark' ? '#14201A' : '#FAF8EC';
  const acc = '#CBAB1F';
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="VentureERP · página inicial"
    >
      <LogoMark size={30} tone={tone} />
      <span className="font-serif text-2xl tracking-tight" style={{ color: ink }}>
        Venture<span style={{ color: acc }}>ERP</span>
      </span>
    </Link>
  );
};
