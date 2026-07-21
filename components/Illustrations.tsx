export const Squiggle = ({ color = '#CBAB1F' }: { color?: string }) => (
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

export const Asterisk = ({
  size = 18,
  className = '',
}: {
  size?: number | string;
  className?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M10 3v14" />
      <path d="M3 10h14" />
      <path d="m5 5 10 10" />
      <path d="m15 5-10 10" />
    </g>
  </svg>
);

export const HeroArtwork = () => {
  const CX = 240;
  const CY = 248;
  const R = 162;

  const nodes = [
    {
      l: 'Finanças',
      a: -90,
      stroke: '#5D7822',
      fill: '#EBE7CE',
      icon: (
        <>
          <circle cx="14" cy="14" r="9" />
          <path d="M14 8.5v11" />
          <path d="M17 11c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 1.6 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
        </>
      ),
    },
    {
      l: 'Fiscal',
      a: -30,
      stroke: '#324512',
      fill: '#F4F1DF',
      icon: (
        <>
          <path d="M7 3.5h14v21l-2.3-1.6-2.4 1.6-2.3-1.6-2.4 1.6L9.3 22.9 7 24.5z" />
          <path d="M11 9h6M11 13h6M11 17h4" />
        </>
      ),
    },
    {
      l: 'Estoque',
      a: 30,
      stroke: '#465D18',
      fill: '#EBE7CE',
      icon: (
        <>
          <path d="M14 4 4.5 8.5v11L14 24l9.5-4.5v-11z" />
          <path d="M4.5 8.5 14 13l9.5-4.5" />
          <path d="M14 13v11" />
          <path d="m9 6 9.5 4.5" />
        </>
      ),
    },
    {
      l: 'Vendas',
      a: 90,
      stroke: '#5D7822',
      fill: '#F0F2E0',
      icon: (
        <>
          <path d="M4 22h20" />
          <path d="M5 18l5-6 4 3 5-9 4 5" />
          <circle cx="10" cy="12" r="1.2" fill="currentColor" />
          <circle cx="14" cy="15" r="1.2" fill="currentColor" />
          <circle cx="19" cy="6" r="1.2" fill="currentColor" />
        </>
      ),
    },
    {
      l: 'Pessoas',
      a: 150,
      stroke: '#324512',
      fill: '#F4F1DF',
      icon: (
        <>
          <circle cx="11" cy="10" r="3.5" />
          <path d="M4 23c.6-3.6 3.5-6 7-6s6.4 2.4 7 6" />
          <circle cx="20" cy="9" r="2.6" />
          <path d="M19 14c2.4.3 4.3 2 4.7 4.4" />
        </>
      ),
    },
    {
      l: 'IA',
      a: 210,
      stroke: '#7E670F',
      fill: '#FAF4D9',
      icon: (
        <>
          <path d="M14 3v6M14 19v6M3 14h6M19 14h6" />
          <path d="m6.5 6.5 3.4 3.4M18.1 18.1l3.4 3.4M6.5 21.5l3.4-3.4M18.1 9.9l3.4-3.4" />
          <circle cx="14" cy="14" r="2.4" />
        </>
      ),
    },
  ].map((n) => ({
    ...n,
    x: CX + R * Math.cos((n.a * Math.PI) / 180),
    y: CY + R * Math.sin((n.a * Math.PI) / 180),
  }));

  return (
    <div className="relative h-[520px] w-full select-none">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 52% at 50% 48%, rgba(93,120,34,.10), transparent 72%)',
        }}
      />

      <svg viewBox="0 0 480 510" className="h-full w-full" aria-hidden="true">
        {/* Outer decorative ring */}
        <circle
          cx={CX}
          cy={CY}
          r="208"
          fill="none"
          stroke="#BCC885"
          strokeWidth="0.5"
          strokeDasharray="3 10"
          opacity="0.35"
        />

        {/* Connection lines from hub edge to node edge */}
        {nodes.map((n) => {
          const rad = (n.a * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return (
            <line
              key={n.l + '-ln'}
              x1={CX + 44 * cos}
              y1={CY + 44 * sin}
              x2={n.x - 30 * cos}
              y2={n.y - 30 * sin}
              stroke="#BCC885"
              strokeWidth="1"
              strokeDasharray="4 5"
              opacity="0.65"
            />
          );
        })}

        {/* Midpoint accent dots */}
        {nodes.map((n) => (
          <circle
            key={n.l + '-md'}
            cx={(CX + n.x) / 2}
            cy={(CY + n.y) / 2}
            r="2.5"
            fill={n.stroke}
            opacity="0.35"
          />
        ))}

        {/* Module nodes */}
        {nodes.map((n) => (
          <g key={n.l}>
            {/* Glow halo */}
            <circle cx={n.x} cy={n.y} r="40" fill={n.stroke} opacity="0.06" />
            {/* Circle */}
            <circle
              cx={n.x}
              cy={n.y}
              r="29"
              fill={n.fill}
              stroke={n.stroke}
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            {/* Icon — 28×28 viewBox scaled to 20×20, centered at node */}
            <g
              transform={`translate(${n.x - 10}, ${n.y - 10}) scale(0.714)`}
              stroke={n.stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              {n.icon}
            </g>
            {/* Label */}
            <text
              x={n.x}
              y={n.y + 44}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="8.5"
              style={{ letterSpacing: '0.14em' }}
              fill="#5F6A5C"
            >
              {n.l.toUpperCase()}
            </text>
          </g>
        ))}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r="56" fill="rgba(93,120,34,0.07)" />
        <circle cx={CX} cy={CY} r="43" fill="#14201A" />
        {/* Bolt icon centered in hub */}
        <g
          transform={`translate(${CX - 10}, ${CY - 10}) scale(0.714)`}
          stroke="#BCC885"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M15 3 6 16h7l-2 9 10-13h-7z" />
        </g>
      </svg>
    </div>
  );
};

const Mini = ({ children }: { children: React.ReactNode }) => (
  <div className="grain relative h-28 w-full overflow-hidden rounded-xl border border-line bg-paper">
    {children}
  </div>
);

export const MiniFinance = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {[20, 45, 70, 95].map((y, i) => (
        <line key={i} x1="0" x2="240" y1={y} y2={y} stroke="#DCD6B8" strokeDasharray="2 4" />
      ))}
      <path
        d="M0 80 L30 70 L60 75 L90 55 L120 60 L150 40 L180 45 L210 25 L240 30"
        fill="none"
        stroke="#324512"
        strokeWidth="2"
      />
      <path
        d="M0 80 L30 70 L60 75 L90 55 L120 60 L150 40 L180 45 L210 25 L240 30 L240 110 L0 110 Z"
        fill="#5D7822"
        fillOpacity=".15"
      />
      <circle cx="210" cy="25" r="3.5" fill="#CBAB1F" />
    </svg>
    <span className="absolute bottom-2 left-3 font-mono text-[10px] text-moss-700">+18,4%</span>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">DRE · maio</span>
  </Mini>
);

export const MiniInventory = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 18 + i * 36;
        const h = 30 + (i * 7) % 50;
        return (
          <g key={i}>
            <rect
              x={x}
              y={90 - h}
              width="22"
              height={h}
              fill="#5D7822"
              fillOpacity={i === 4 ? 0.9 : 0.55}
              rx="2"
            />
            <rect x={x} y={90 - h - 6} width="22" height="4" fill="#CBAB1F" rx="1" />
          </g>
        );
      })}
      <line x1="0" x2="240" y1="90" y2="90" stroke="#324512" />
    </svg>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">3 CDs</span>
  </Mini>
);

/**
 * Chão de fábrica: as etapas reais por que passa uma peça, com o avanço de
 * cada posto. Substitui o funil de vendas que estava ilustrando o PCP por
 * engano — funil é jornada comercial, não roteiro de produção.
 */
export const MiniProduction = () => {
  const stages: [string, number][] = [
    ['Corte', 1],
    ['Dobra', 1],
    ['Solda', 0.55],
    ['Pintura', 0],
  ];
  return (
    <Mini>
      <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
        <text x="18" y="22" fontSize="9" fontFamily="Geist Mono" fill="#8A8778">
          ORDEM 4821
        </text>
        {stages.map(([label, done], i) => {
          const x = 18 + i * 55;
          const complete = done === 1;
          const active = done > 0 && done < 1;
          return (
            <g key={label}>
              <rect
                x={x}
                y="38"
                width="46"
                height="34"
                rx="6"
                fill={complete ? '#EEF1E4' : '#fff'}
                stroke={active ? '#5D7822' : '#DCD6B8'}
                strokeWidth={active ? 1.6 : 1}
              />
              <text
                x={x + 23}
                y="52"
                fontSize="8.5"
                textAnchor="middle"
                fontFamily="Geist Mono"
                fill="#324512"
              >
                {label}
              </text>
              {/* barra de avanço do posto */}
              <rect x={x + 9} y="59" width="28" height="4" rx="2" fill="#E7E3D0" />
              {done > 0 && (
                <rect
                  x={x + 9}
                  y="59"
                  width={28 * done}
                  height="4"
                  rx="2"
                  fill={complete ? '#5D7822' : '#CBAB1F'}
                />
              )}
              {i < stages.length - 1 && (
                <path
                  d={`M${x + 46} 55 L${x + 55} 55`}
                  stroke="#324512"
                  strokeWidth="1.2"
                />
              )}
            </g>
          );
        })}
        <text x="18" y="92" fontSize="9" fontFamily="Geist Mono" fill="#5D7822">
          entrega prevista · 24/07
        </text>
      </svg>
    </Mini>
  );
};

export const MiniSales = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {['Contato', 'Cotação', 'Proposta', 'Fechado'].map((l, i) => (
        <g key={l}>
          <rect x={18 + i * 55} y="38" width="46" height="34" rx="6" fill="#fff" stroke="#DCD6B8" />
          <text
            x={41 + i * 55}
            y="58"
            fontSize="7.5"
            textAnchor="middle"
            fontFamily="Geist Mono"
            fill="#324512"
          >
            {l}
          </text>
          {i < 3 && (
            <path
              d={`M${64 + i * 55} 55 L${73 + i * 55} 55`}
              stroke="#324512"
              strokeWidth="1.2"
            />
          )}
        </g>
      ))}
      <circle cx="41" cy="20" r="5" fill="#CBAB1F" />
      <circle cx="96" cy="20" r="5" fill="#CBAB1F" />
      <circle cx="151" cy="20" r="5" fill="#5D7822" />
      <circle cx="206" cy="90" r="5" fill="#5D7822" />
    </svg>
  </Mini>
);

export const MiniFiscal = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 60}, ${20 + i * 4})`}>
          <rect width="80" height="70" rx="4" fill="#fff" stroke="#DCD6B8" />
          <line x1="10" x2="60" y1="14" y2="14" stroke="#DCD6B8" />
          <line x1="10" x2="70" y1="22" y2="22" stroke="#DCD6B8" />
          <line x1="10" x2="50" y1="30" y2="30" stroke="#DCD6B8" />
          <line x1="10" x2="65" y1="38" y2="38" stroke="#DCD6B8" />
          <line x1="10" x2="40" y1="46" y2="46" stroke="#DCD6B8" />
          <circle cx="62" cy="58" r="9" fill="#5D7822" />
          <path
            d="M58 58 l3 3 6-6"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  </Mini>
);

export const MiniHR = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      {(
        [
          [40, 55],
          [85, 40],
          [130, 60],
          [175, 35],
          [210, 55],
        ] as [number, number][]
      ).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy - 8} r="7" fill="#5D7822" fillOpacity={0.65 + i * 0.07} />
          <path
            d={`M${cx - 12} ${cy + 12} Q ${cx} ${cy + 2} ${cx + 12} ${cy + 12}`}
            fill="#5D7822"
            fillOpacity={0.65 + i * 0.07}
          />
        </g>
      ))}
      <path
        d="M40 55 L85 40 L130 60 L175 35 L210 55"
        stroke="#CBAB1F"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3 3"
      />
    </svg>
    <span className="absolute right-3 top-2 font-mono text-[10px] text-muted">eSocial ✓</span>
  </Mini>
);

export const MiniBI = () => (
  <Mini>
    <svg viewBox="0 0 240 110" className="absolute inset-0 h-full w-full">
      <circle cx="80" cy="55" r="34" fill="none" stroke="#EBE7CE" strokeWidth="10" />
      <circle
        cx="80"
        cy="55"
        r="34"
        fill="none"
        stroke="#5D7822"
        strokeWidth="10"
        strokeDasharray="120 220"
        transform="rotate(-90 80 55)"
        strokeLinecap="round"
      />
      <circle
        cx="80"
        cy="55"
        r="34"
        fill="none"
        stroke="#CBAB1F"
        strokeWidth="10"
        strokeDasharray="50 220"
        strokeDashoffset="-120"
        transform="rotate(-90 80 55)"
        strokeLinecap="round"
      />
      <text x="80" y="60" fontSize="14" textAnchor="middle" fontFamily="Instrument Serif" fill="#14201A">
        68%
      </text>
      <g transform="translate(140, 25)">
        {[20, 12, 34, 18, 28, 8, 22].map((h, i) => (
          <rect key={i} x={i * 12} y={60 - h} width="8" height={h} fill="#324312" fillOpacity="0.7" rx="1.5" />
        ))}
      </g>
    </svg>
  </Mini>
);
