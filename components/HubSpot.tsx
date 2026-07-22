'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { trackConversion } from '@/lib/track';

export const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '51662264';
export const HUBSPOT_MEETINGS_SLUG =
  process.env.NEXT_PUBLIC_HUBSPOT_MEETINGS_SLUG || 'felipe-panosso';

/**
 * Script de rastreamento do HubSpot. O HubSpot grava cookies de identificação
 * (hubspotutk), que não são essenciais — então ele segue a mesma regra do GA e
 * do Meta Pixel: só carrega depois do aceite no banner (LGPD/ANPD).
 *
 * O embed de reuniões NÃO depende disso: ele é a própria funcionalidade que o
 * usuário pediu ao abrir a agenda, e continua funcionando sem consentimento.
 */
export const HubSpotTracking = () => {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const read = () => setConsent(localStorage.getItem('venture-cookies') === 'ok');
    read();
    window.addEventListener('venture-consent', read);
    return () => window.removeEventListener('venture-consent', read);
  }, []);

  if (!consent) return null;

  return (
    <Script
      id="hs-script-loader"
      strategy="lazyOnload"
      src={`https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
    />
  );
};

/**
 * Embed do calendário de reuniões do HubSpot.
 *
 * Monta o iframe diretamente em vez de usar o MeetingsEmbedCode.js do HubSpot.
 * Aquele script varre o DOM por `.meetings-iframe-container` UMA vez, no
 * instante em que carrega: com React o container costuma não existir ainda, e
 * em navegação client-side o script já rodou e nunca mais varre — resultado,
 * calendário em branco. Aqui o iframe é do React, então sempre aparece.
 *
 * O redimensionamento replica o protocolo do HubSpot: a página de agendamento
 * envia postMessage com { height } e o pai ajusta a altura do iframe.
 */
const HUBSPOT_ORIGINS = [
  'https://meetings.hubspot.com',
  'https://meetings-eu1.hubspot.com',
  'https://app.hubspot.com',
  'https://app-eu1.hubspot.com',
];

export const HubSpotMeetings = ({
  slug = HUBSPOT_MEETINGS_SLUG,
  className = '',
}: {
  slug?: string;
  className?: string;
}) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const booked = useRef(false);
  const [failed, setFailed] = useState(false);

  // src fixo e sem dependência de cookie/location: o iframe já vem no HTML do
  // servidor, aparece no primeiro paint e não corre risco de hidratação. A
  // atribuição do agendamento ao contato acontece pelo e-mail que a pessoa
  // digita no próprio formulário do HubSpot.
  const src = `https://meetings.hubspot.com/${slug}?embed=true`;

  // Mesmo protocolo de resize do script oficial do HubSpot.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!HUBSPOT_ORIGINS.includes(e.origin)) return;
      const data = (e as MessageEvent).data;
      if (!data || typeof data !== 'object') return;

      // Reserva de demonstração concluída: dispara a conversão UMA vez.
      // O HubSpot Meetings sinaliza o sucesso via meetingBookSucceeded.
      const isBooking =
        data.meetingBookSucceeded === true ||
        data.event === 'meetingBookSucceeded';
      if (isBooking && !booked.current) {
        booked.current = true;
        trackConversion('agendamento');
      }

      const height = data.height ?? null;
      if (height && frame.current) {
        frame.current.style.height = `${height}px`;
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  if (failed) {
    return (
      <div className={`rounded-[26px] border border-line bg-bg p-8 text-center ${className}`}>
        <p className="font-serif text-2xl text-ink">Abrir a agenda</p>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          O calendário não carregou aqui dentro. Abra em uma nova aba para escolher o horário:
        </p>
        <a
          href={`https://meetings.hubspot.com/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-3 text-sm text-bg transition hover:bg-moss-800"
        >
          Escolher data e horário
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        ref={frame}
        src={src}
        title="Agenda de demonstrações do VentureERP"
        onError={() => setFailed(true)}
        className="h-[720px] w-full rounded-[20px] border-0 bg-bg"
      />

      <p className="mt-3 text-center text-[12px] text-muted">
        Problema para ver o calendário?{' '}
        <a
          href={`https://meetings.hubspot.com/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-ink"
        >
          Abra em uma nova aba
        </a>
        .
      </p>
    </div>
  );
};
