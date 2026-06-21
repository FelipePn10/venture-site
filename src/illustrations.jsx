// Decorative illustrations: hero artwork, squiggles, dashboard mockup, etc.

const Squiggle = ({ color = '#CBAB1F' }) => (
  <span className="squiggle">
    <svg viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 8 Q 30 -2, 60 6 T 120 6 T 180 6 T 218 4"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

const Asterisk = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M10 3v14" />
      <path d="M3 10h14" />
      <path d="m5 5 10 10" />
      <path d="m15 5-10 10" />
    </g>
  </svg>
);

const Sticker = ({ children, rotate = -3, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border border-moss-700 bg-moss-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-moss-700 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </span>
);

// ─── Hero artwork: layered "live dashboard" panels with custom data viz ─────
const HeroArtwork = () => (
  <div className="relative h-[560px] w-full">
    {/* radial wash */}
    <div
      className="absolute inset-0 -z-10 rounded-[40px]"
      style={{
        background:
          'radial-gradient(60% 60% at 65% 35%, rgba(220,192,59,.32), rgba(250,248,236,0) 70%), radial-gradient(50% 60% at 25% 80%, rgba(93,120,34,.22), rgba(250,248,236,0) 70%)'
      }}
    />

    {/* main dashboard card */}
    <div className="absolute right-2 top-6 w-[460px] rounded-2xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(20,32,26,0.35)] animate-float-mid">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-mustard-300" />
          <span className="h-2 w-2 rounded-full bg-moss-200" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="ml-3 font-mono text-[11px] tracking-tight text-muted">painel.venture.app/financeiro</span>
        </div>
        <span className="font-mono text-[10px] text-moss-600">● ao vivo</span>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Receita líquida · maio</p>
            <p className="mt-1 font-serif text-[44px] leading-none text-ink">R$ 2.847.290</p>
          </div>
          <span className="rounded-full bg-moss-50 px-2.5 py-1 font-mono text-[11px] text-moss-700">+18,4%</span>
        </div>

        {/* line chart */}
        <svg viewBox="0 0 420 140" className="mt-5 w-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5D7822" stopOpacity=".25" />
              <stop offset="100%" stopColor="#5D7822" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[20, 50, 80, 110].map((y, i) => (
            <line key={i} x1="0" x2="420" y1={y} y2={y} stroke="#EBE7CE" strokeDasharray="2 4" />
          ))}
          <path
            d="M0 95 L40 88 L80 92 L120 70 L160 78 L200 55 L240 60 L280 38 L320 44 L360 22 L400 30 L420 18"
            fill="none"
            stroke="#5D7822"
            strokeWidth="2.5"
          />
          <path
            d="M0 95 L40 88 L80 92 L120 70 L160 78 L200 55 L240 60 L280 38 L320 44 L360 22 L400 30 L420 18 L420 140 L0 140 Z"
            fill="url(#g1)"
          />
          <path
            d="M0 110 L40 105 L80 102 L120 95 L160 92 L200 88 L240 82 L280 78 L320 72 L360 68 L400 64 L420 62"
            fill="none"
            stroke="#CBAB1F"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <circle cx="360" cy="22" r="4" fill="#fff" stroke="#5D7822" strokeWidth="2" />
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 text-left">
          {[
            { l: 'Margem', v: '32,1%' },
            { l: 'Ticket', v: 'R$ 8.4k' },
            { l: 'CAC', v: 'R$ 612' }
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-line bg-paper px-3 py-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{s.l}</p>
              <p className="mt-1 font-serif text-2xl text-ink">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* secondary stack — module list */}
    <div
      className="absolute left-0 top-[230px] w-[280px] rounded-2xl border border-line bg-paper shadow-[0_20px_40px_-20px_rgba(20,32,26,0.25)] animate-float-slow"
      style={{ transform: 'rotate(-3.5deg)' }}
    >
      <div className="border-b border-line px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Módulos ativos</p>
      </div>
      <ul className="divide-y divide-line/70 px-4 py-1 text-sm">
        {[
          ['Financeiro', '24 fluxos', true],
          ['Estoque', '3 armazéns', true],
          ['Vendas', '1.842 leads', true],
          ['Fiscal', 'NF-e ✓', true]
        ].map(([n, m, on]) => (
          <li key={n} className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-moss-500 animate-pulse-soft" />
              <span className="text-ink">{n}</span>
            </span>
            <span className="font-mono text-[11px] text-muted">{m}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* tiny KPI bubble */}
    <div
      className="absolute left-[280px] top-[60px] flex items-center gap-3 rounded-full border border-moss-700 bg-moss-700 px-4 py-2 text-bg shadow-lg animate-float-fast"
      style={{ transform: 'rotate(2deg)' }}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-mustard-300 text-moss-800">
        <IconBolt size={18} />
      </span>
      <span className="font-serif text-base">Fechamento em 2h</span>
    </div>

    {/* annotation arrow */}
    <svg
      className="absolute left-[200px] top-[150px] animate-tick"
      width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true"
    >
      <path
        d="M5 68 C 30 40, 60 18, 110 14"
        stroke="#324512"
        strokeWidth="1.4"
        strokeDasharray="3 4"
        fill="none"
      />
      <path d="M104 8 L114 14 L106 22" stroke="#324512" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <p className="absolute left-[150px] top-[230px] max-w-[150px] font-serif text-[15px] italic leading-tight text-moss-800" style={{ transform: 'rotate(-2deg)' }}>
      dados de toda a empresa, em uma tela só.
    </p>

    {/* tiny donut card */}
    <div
      className="absolute bottom-2 right-12 flex w-[220px] items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-md animate-float-slow"
      style={{ transform: 'rotate(3deg)' }}
    >
      <svg width="56" height="56" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#EBE7CE" strokeWidth="5" />
        <circle
          cx="18" cy="18" r="14" fill="none"
          stroke="#5D7822" strokeWidth="5"
          strokeDasharray="62 100"
          transform="rotate(-90 18 18)"
          strokeLinecap="round"
        />
        <circle
          cx="18" cy="18" r="14" fill="none"
          stroke="#CBAB1F" strokeWidth="5"
          strokeDasharray="22 100"
          strokeDashoffset="-62"
          transform="rotate(-90 18 18)"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">A receber · 30d</p>
        <p className="font-serif text-2xl text-ink">R$ 412k</p>
      </div>
    </div>
  </div>
);

// ─── Module miniature illustrations (used on the modules grid) ───────────
const Mini = ({ children }) => (
  <div className="grain relative h-28 w-full overflow-hidden rounded-xl border border-line bg-paper">
    {children}
  </div>
);

const MiniFinance = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {[20, 45, 70, 95].map((y, i) => (
        <line key={i} x1="0" x2="240" y1={y} y2={y} stroke="#DCD6B8" strokeDasharray="2 4" />
      ))}
      <path d="M0 80 L30 70 L60 75 L90 55 L120 60 L150 40 L180 45 L210 25 L240 30" fill="none" stroke="#324512" strokeWidth="2" />
      <path d="M0 80 L30 70 L60 75 L90 55 L120 60 L150 40 L180 45 L210 25 L240 30 L240 110 L0 110 Z" fill="#5D7822" fillOpacity=".15" />
      <circle cx="210" cy="25" r="3.5" fill="#CBAB1F" />
    </svg>
    <span className="absolute bottom-2 left-3 font-mono text-[10px] text-moss-700">+18,4%</span>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">DRE · maio</span>
  </Mini>
);

const MiniInventory = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 18 + i * 36;
        const h = 30 + (i * 7) % 50;
        return (
          <g key={i}>
            <rect x={x} y={90 - h} width="22" height={h} fill="#5D7822" fillOpacity={i === 4 ? .9 : .55} rx="2" />
            <rect x={x} y={90 - h - 6} width="22" height="4" fill="#CBAB1F" rx="1" />
          </g>
        );
      })}
      <line x1="0" x2="240" y1="90" y2="90" stroke="#324512" />
    </svg>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">3 CDs</span>
  </Mini>
);

const MiniSales = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {['Lead','Qual','Prop','Fech'].map((l, i) => (
        <g key={l}>
          <rect x={18 + i*55} y="38" width="46" height="34" rx="6" fill="#fff" stroke="#DCD6B8"/>
          <text x={41 + i*55} y="59" fontSize="10" textAnchor="middle" fontFamily="Geist Mono" fill="#324512">{l}</text>
          {i < 3 && <path d={`M${64 + i*55} 55 L${73 + i*55} 55`} stroke="#324512" strokeWidth="1.2"/>}
        </g>
      ))}
      <circle cx="41" cy="20" r="5" fill="#CBAB1F"/>
      <circle cx="96" cy="20" r="5" fill="#CBAB1F"/>
      <circle cx="151" cy="20" r="5" fill="#5D7822"/>
      <circle cx="206" cy="90" r="5" fill="#5D7822"/>
    </svg>
  </Mini>
);

const MiniFiscal = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${30 + i*60}, ${20 + i*4})`}>
          <rect width="80" height="70" rx="4" fill="#fff" stroke="#DCD6B8"/>
          <line x1="10" x2="60" y1="14" y2="14" stroke="#DCD6B8"/>
          <line x1="10" x2="70" y1="22" y2="22" stroke="#DCD6B8"/>
          <line x1="10" x2="50" y1="30" y2="30" stroke="#DCD6B8"/>
          <line x1="10" x2="65" y1="38" y2="38" stroke="#DCD6B8"/>
          <line x1="10" x2="40" y1="46" y2="46" stroke="#DCD6B8"/>
          <circle cx="62" cy="58" r="9" fill="#5D7822"/>
          <path d="M58 58 l3 3 6-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      ))}
    </svg>
  </Mini>
);

const MiniHR = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {[
        [40, 55], [85, 40], [130, 60], [175, 35], [210, 55]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy-8} r="7" fill="#5D7822" fillOpacity={.65 + i*.07}/>
          <path d={`M${cx-12} ${cy+12} Q ${cx} ${cy+2} ${cx+12} ${cy+12}`} fill="#5D7822" fillOpacity={.65 + i*.07}/>
        </g>
      ))}
      <path d="M40 55 L85 40 L130 60 L175 35 L210 55" stroke="#CBAB1F" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
    </svg>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">eSocial ✓</span>
  </Mini>
);

const MiniBI = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      <circle cx="80" cy="55" r="34" fill="none" stroke="#EBE7CE" strokeWidth="10"/>
      <circle cx="80" cy="55" r="34" fill="none" stroke="#5D7822" strokeWidth="10"
        strokeDasharray="120 220" transform="rotate(-90 80 55)" strokeLinecap="round"/>
      <circle cx="80" cy="55" r="34" fill="none" stroke="#CBAB1F" strokeWidth="10"
        strokeDasharray="50 220" strokeDashoffset="-120" transform="rotate(-90 80 55)" strokeLinecap="round"/>
      <text x="80" y="60" fontSize="14" textAnchor="middle" fontFamily="Instrument Serif" fill="#14201A">68%</text>
      {/* mini sparkline column */}
      <g transform="translate(140, 25)">
        {[20, 12, 34, 18, 28, 8, 22].map((h, i) => (
          <rect key={i} x={i*12} y={60 - h} width="8" height={h} fill="#324512" fillOpacity=".7" rx="1.5"/>
        ))}
      </g>
    </svg>
  </Mini>
);

Object.assign(window, {
  Squiggle, Asterisk, Sticker, HeroArtwork,
  MiniFinance, MiniInventory, MiniSales, MiniFiscal, MiniHR, MiniBI
});
