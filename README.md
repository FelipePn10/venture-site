# VentureERP — site institucional

Site institucional da VentureERP construído em **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## Stack

- **Next.js 14** — App Router, React Server Components onde possível
- **TypeScript 5** em strict mode
- **Tailwind CSS 3** com tokens custom (paleta moss/mustard)
- **Instrument Serif + Geist** via `next/font`

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Estrutura

```
app/
  layout.tsx           # fontes + meta
  page.tsx             # home
  globals.css          # reset + utilitários
  cases/page.tsx       # /cases
  status/page.tsx      # /status
  modulo/[slug]/page.tsx  # /modulo/financeiro etc.
components/
  Icons.tsx            # ícones line-art
  Illustrations.tsx    # hero artwork, mini-charts
  Nav.tsx, Hero.tsx
  Sections.tsx         # seções da home
  Extras.tsx           # CTA flutuante, cookie banner, counter
tailwind.config.ts
tsconfig.json
next.config.mjs
```

## Módulos disponíveis em `/modulo/[slug]`

- `financeiro`, `estoque`, `vendas`, `fiscal`, `rh`, `bi`

## Customização

- Cores: `tailwind.config.ts` (`moss`, `mustard`, `ink`, `bg`, `paper`)
- Tipografia: `app/layout.tsx` (next/font)
- Copy: cada componente em `components/`

## Deploy

Pronto para deploy em Vercel (`vercel deploy`), Netlify ou qualquer host Node.

---

© 2026 VentureERP Tecnologia S.A.
# venture-site
