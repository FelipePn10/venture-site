import { LegalShell, Section, P, UL, LI, Strong } from '@/components/Legal';
import { legal } from '@/lib/legal';

export const metadata = {
  title: 'Política de Segurança da Informação · VentureERP',
  description:
    'As medidas técnicas e administrativas que adotamos para proteger os dados coletados no site VentureERP.',
};

export default function SegurancaPage() {
  return (
    <LegalShell
      current="Segurança"
      title="Política de Segurança"
      lead="A segurança dos dados que você nos confia é levada a sério. Abaixo descrevemos, de forma honesta, as medidas técnicas e administrativas que adotamos para proteger as informações coletadas neste site."
    >
      <Section n="1" title="Compromisso e escopo">
        <P>
          Adotamos medidas razoáveis e compatíveis com a natureza dos dados para protegê-los contra
          acessos não autorizados e situações de destruição, perda, alteração ou difusão indevidas,
          conforme os arts. 46 a 49 da LGPD. Esta Política trata da segurança do site{' '}
          {legal.site} e dos dados coletados em seus formulários. A segurança do software VentureERP
          contratado por clientes é tratada em instrumentos contratuais próprios.
        </P>
        <P>
          <Strong>Importante:</Strong> nenhuma tecnologia é 100% segura. Buscamos a melhoria contínua,
          mas não podemos garantir segurança absoluta. Por isso mantemos também processos de resposta
          a incidentes (seção 6).
        </P>
      </Section>

      <Section n="2" title="Proteção em trânsito">
        <P>
          Todo o tráfego entre o seu navegador e o site é protegido por criptografia HTTPS/TLS,
          dificultando a interceptação dos dados enviados pelos formulários durante a transmissão.
        </P>
      </Section>

      <Section n="3" title="Minimização e controle de acesso">
        <UL>
          <LI>
            <Strong>Minimização:</Strong> coletamos apenas os dados necessários para responder à sua
            solicitação — sem dados sensíveis e sem dados de pagamento.
          </LI>
          <LI>
            <Strong>Acesso restrito:</Strong> os dados recebidos pelos formulários ficam acessíveis
            apenas a pessoas autorizadas, por meio de painel administrativo protegido por
            autenticação. O acesso é concedido conforme a necessidade (princípio do menor privilégio).
          </LI>
          <LI>
            <Strong>Confidencialidade:</Strong> quem tem acesso aos dados está sujeito a deveres de
            sigilo e à utilização apenas para as finalidades informadas.
          </LI>
        </UL>
      </Section>

      <Section n="4" title="Infraestrutura e provedores">
        <P>
          O site é hospedado em provedores de nuvem reconhecidos, que mantêm controles físicos e
          lógicos de segurança e adotam criptografia e práticas de proteção em seus ambientes. O envio
          de e-mails de notificação e confirmação ocorre por meio de provedor de e-mail que emprega
          conexões seguras. Selecionamos prestadores que ofereçam garantias adequadas de proteção de
          dados, conforme detalhado na{' '}
          <a href="/privacidade" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Privacidade
          </a>
          .
        </P>
        <P>
          As certificações e selos eventualmente apresentados como referência de mercado pertencem aos
          respectivos provedores de infraestrutura, e não constituem certificação própria de{' '}
          {legal.nomeFantasia}, salvo quando expressamente declarado.
        </P>
      </Section>

      <Section n="5" title="Desenvolvimento e manutenção">
        <P>
          Buscamos manter o site e suas dependências atualizados, aplicando correções de segurança e
          seguindo boas práticas de desenvolvimento para reduzir vulnerabilidades conhecidas.
        </P>
      </Section>

      <Section n="6" title="Resposta a incidentes">
        <P>
          Caso ocorra um incidente de segurança que possa acarretar risco ou dano relevante aos
          titulares, atuaremos para conter e remediar a situação e cumpriremos os deveres de
          comunicação à Autoridade Nacional de Proteção de Dados (ANPD) e aos titulares afetados, em
          prazo razoável, conforme o art. 48 da LGPD.
        </P>
      </Section>

      <Section n="7" title="Sua parte na segurança">
        <P>
          A segurança também depende de você. Recomendamos não compartilhar informações sensíveis nos
          campos de mensagem, manter seu dispositivo e navegador atualizados e desconfiar de mensagens
          que solicitem dados em nome do {legal.nomeFantasia} fora dos nossos canais oficiais.
        </P>
      </Section>

      <Section n="8" title="Comunicação responsável de vulnerabilidades">
        <P>
          Se você identificar uma possível falha de segurança neste site, pedimos que nos comunique de
          forma responsável, antes de divulgá-la publicamente, pelo e-mail{' '}
          <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
            {legal.emailPrivacidade}
          </a>
          . Analisaremos e responderemos o mais rápido possível. Agradecemos a colaboração da
          comunidade de segurança.
        </P>
      </Section>

      <Section n="9" title="Contato">
        <P>
          Dúvidas sobre esta Política de Segurança ou sobre privacidade podem ser encaminhadas ao nosso
          Encarregado, {legal.encarregado}, pelo e-mail{' '}
          <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
            {legal.emailPrivacidade}
          </a>
          .
        </P>
      </Section>
    </LegalShell>
  );
}
