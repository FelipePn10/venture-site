import { LegalShell, Section, P, UL, LI, Strong } from '@/components/Legal';
import { legal } from '@/lib/legal';

export const metadata = {
  title: 'Central de Privacidade (LGPD) · VentureERP',
  description:
    'Conheça seus direitos como titular de dados sob a LGPD e saiba exatamente como exercê-los junto ao VentureERP.',
};

export default function LgpdPage() {
  return (
    <LegalShell
      current="Central LGPD"
      title="Central de Privacidade"
      lead="A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) coloca você no controle dos seus dados pessoais. Aqui você encontra, em linguagem clara, todos os seus direitos e o passo a passo para exercê-los junto a nós."
    >
      <Section n="1" title="Seus direitos como titular (art. 18 da LGPD)">
        <P>
          A qualquer momento e mediante requisição, você pode exercer os seguintes direitos sobre os
          dados pessoais que tratamos:
        </P>
        <UL>
          <LI>
            <Strong>Confirmação e acesso:</Strong> saber se tratamos seus dados e obter acesso a eles.
          </LI>
          <LI>
            <Strong>Correção:</Strong> corrigir dados incompletos, inexatos ou desatualizados.
          </LI>
          <LI>
            <Strong>Anonimização, bloqueio ou eliminação:</Strong> de dados desnecessários, excessivos
            ou tratados em desconformidade com a lei.
          </LI>
          <LI>
            <Strong>Portabilidade:</Strong> solicitar a portabilidade dos dados a outro fornecedor,
            observados os segredos comercial e industrial.
          </LI>
          <LI>
            <Strong>Eliminação dos dados tratados com base no consentimento</Strong>, ressalvadas as
            hipóteses de guarda permitidas pelo art. 16.
          </LI>
          <LI>
            <Strong>Informação sobre o compartilhamento:</Strong> saber com quais entidades públicas e
            privadas compartilhamos seus dados.
          </LI>
          <LI>
            <Strong>Informação sobre a possibilidade de não consentir</Strong> e sobre as consequências
            da recusa.
          </LI>
          <LI>
            <Strong>Revogação do consentimento</Strong> a qualquer momento, de forma facilitada e
            gratuita.
          </LI>
          <LI>
            <Strong>Oposição:</Strong> opor-se a tratamento realizado com base em uma das hipóteses de
            dispensa de consentimento, em caso de descumprimento da lei.
          </LI>
        </UL>
      </Section>

      <Section n="2" title="Decisões automatizadas">
        <P>
          Não tomamos decisões unicamente automatizadas que afetem seus interesses a partir dos dados
          coletados neste site. Caso isso venha a ocorrer, você terá o direito de solicitar revisão,
          nos termos do art. 20 da LGPD.
        </P>
      </Section>

      <Section n="3" title="Como exercer seus direitos">
        <P>
          É simples e gratuito. Envie sua solicitação ao nosso Encarregado pelo e-mail abaixo,
          indicando qual direito deseja exercer:
        </P>
        <UL>
          <LI>
            <Strong>E-mail do Encarregado:</Strong>{' '}
            <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
              {legal.emailPrivacidade}
            </a>
          </LI>
          <LI>
            <Strong>Encarregado (DPO):</Strong> {legal.encarregado}
          </LI>
        </UL>
        <P>
          Para sua segurança, poderemos adotar medidas razoáveis para confirmar a sua identidade antes
          de atender ao pedido, evitando que terceiros acessem dados que não lhes pertencem.
        </P>
      </Section>

      <Section n="4" title="Prazos e custos">
        <P>
          O exercício dos direitos é <Strong>gratuito</Strong>. Responderemos às solicitações de
          confirmação de existência ou de acesso aos dados de forma imediata, em formato simplificado,
          ou em até <Strong>15 (quinze) dias</Strong>, por meio de declaração completa, conforme o
          art. 19 da LGPD. Para os demais pedidos, atuamos no menor prazo possível.
        </P>
        <P>
          Em alguns casos, poderemos deixar de atender, total ou parcialmente, a um pedido — por
          exemplo, quando houver obrigação legal de manter o dado ou necessidade de exercício de
          direitos em processo. Nesses casos, explicaremos o motivo.
        </P>
      </Section>

      <Section n="5" title="Quais dados tratamos e por quê">
        <P>
          A descrição completa de quais dados coletamos, com quais finalidades, bases legais, prazos
          de guarda e com quem compartilhamos está na nossa{' '}
          <a href="/privacidade" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Privacidade
          </a>
          . Para entender como protegemos esses dados, consulte a{' '}
          <a href="/seguranca" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Segurança
          </a>
          .
        </P>
      </Section>

      <Section n="6" title="Gerenciar cookies">
        <P>
          Cookies analíticos e de marketing só são ativados com o seu consentimento, dado no banner
          exibido ao acessar o site. Você pode revogar esse consentimento a qualquer momento limpando
          os cookies do navegador (o banner voltará a aparecer) ou ajustando as configurações de
          privacidade do seu navegador. Cookies essenciais ao funcionamento do site permanecem ativos.
        </P>
      </Section>

      <Section n="7" title="Reclamação à ANPD">
        <P>
          Se entender que seus direitos não foram adequadamente atendidos, você pode apresentar
          reclamação à Autoridade Nacional de Proteção de Dados (ANPD) pelos canais oficiais
          disponíveis em gov.br/anpd. Antes disso, ficaremos felizes em resolver diretamente com você
          — fale com o nosso Encarregado: {legal.encarregado},{' '}
          <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
            {legal.emailPrivacidade}
          </a>
          .
        </P>
      </Section>
    </LegalShell>
  );
}
