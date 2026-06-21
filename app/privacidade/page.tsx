import { LegalShell, Section, P, UL, LI, Strong } from '@/components/Legal';
import { legal } from '@/lib/legal';

export const metadata = {
  title: 'Política de Privacidade · VentureERP',
  description:
    'Como o VentureERP coleta, usa, compartilha e protege os dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).',
};

export default function PrivacidadePage() {
  return (
    <LegalShell
      current="Privacidade"
      title="Política de Privacidade"
      lead="Esta Política explica, de forma transparente, como tratamos os dados pessoais coletados neste site — quais dados, para quê, com quem compartilhamos e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
    >
      <Section n="1" title="Quem é o controlador dos dados">
        <P>
          O controlador responsável pelo tratamento dos dados pessoais coletados neste site é{' '}
          <Strong>{legal.razaoSocial}</Strong>, inscrita no CNPJ sob nº <Strong>{legal.cnpj}</Strong>,
          com sede em {legal.endereco} (“{legal.nomeFantasia}”, “nós”).
        </P>
        <P>
          Em conformidade com o art. 41 da LGPD, indicamos um Encarregado pelo Tratamento de Dados
          Pessoais (DPO), cujos contatos estão na seção 13.
        </P>
      </Section>

      <Section n="2" title="A quem esta Política se aplica">
        <P>
          Esta Política se aplica a qualquer pessoa que acesse {legal.site} ou interaja com nossos
          formulários — pedido de demonstração, contato comercial e agendamento de demonstração.
          Ela <Strong>não</Strong> trata do funcionamento interno do software VentureERP contratado
          por clientes, que é regido por contrato e por instrumento próprio de tratamento de dados.
        </P>
      </Section>

      <Section n="3" title="Quais dados coletamos">
        <P>
          Coletamos apenas os dados necessários às finalidades descritas nesta Política. Não
          solicitamos dados sensíveis (art. 5º, II, da LGPD) e o site não processa pagamentos.
        </P>
        <P>
          <Strong>a) Dados que você nos fornece nos formulários:</Strong>
        </P>
        <UL>
          <LI>Nome;</LI>
          <LI>E-mail;</LI>
          <LI>Telefone / WhatsApp;</LI>
          <LI>Empresa, porte da empresa e setor (metalúrgica/moveleira);</LI>
          <LI>Sistema de gestão atual (quando informado);</LI>
          <LI>
            Mensagem, observações e o dia/horário escolhidos para a demonstração (quando aplicável).
          </LI>
        </UL>
        <P>
          <Strong>b) Dados coletados automaticamente (navegação):</Strong> ao acessar o site, podem
          ser coletados endereço IP, identificadores de dispositivo, tipo de navegador, páginas
          visitadas e data/hora de acesso, por meio de registros de servidor e de cookies. Veja a
          seção 8.
        </P>
      </Section>

      <Section n="4" title="Para que usamos os dados e com qual base legal">
        <P>
          Tratamos seus dados pessoais para as seguintes finalidades, sempre amparados em uma base
          legal do art. 7º da LGPD:
        </P>
        <UL>
          <LI>
            <Strong>Responder a pedidos de demonstração, contato e agendamento</Strong> que você
            solicitar — base legal: execução de procedimentos preliminares relacionados a contrato,
            a pedido do titular (art. 7º, V).
          </LI>
          <LI>
            <Strong>Confirmar e organizar a demonstração agendada</Strong>, inclusive enviando o
            e-mail de confirmação e o link de acesso — base legal: art. 7º, V.
          </LI>
          <LI>
            <Strong>Relacionamento e contato comercial</Strong> (retorno sobre o seu interesse,
            follow-up) — base legal: legítimo interesse (art. 7º, IX), sempre respeitando suas
            expectativas e o direito de oposição.
          </LI>
          <LI>
            <Strong>Medir audiência e melhorar o site, e veicular marketing</Strong> por meio de
            cookies analíticos e de marketing — base legal: consentimento (art. 7º, I), coletado no
            banner de cookies.
          </LI>
          <LI>
            <Strong>Cumprir obrigações legais e regulatórias</Strong> e exercer direitos em processo
            — base legal: cumprimento de obrigação legal (art. 7º, II) e exercício regular de
            direitos (art. 7º, VI).
          </LI>
        </UL>
      </Section>

      <Section n="5" title="Com quem compartilhamos">
        <P>
          Não vendemos seus dados pessoais. Compartilhamos dados apenas com prestadores de serviço
          (operadores) que nos apoiam a operar o site e a responder você, e somente na medida
          necessária:
        </P>
        <UL>
          {legal.operadores.map((op) => (
            <LI key={op.nome}>
              <Strong>{op.nome}</Strong> — {op.finalidade}. ({op.local}.)
            </LI>
          ))}
        </UL>
        <P>
          Também poderemos compartilhar dados com autoridades públicas quando exigido por lei, ordem
          judicial ou requisição de autoridade competente.
        </P>
      </Section>

      <Section n="6" title="Transferência internacional de dados">
        <P>
          Nossa hospedagem e alguns operadores (como Google e Meta) podem armazenar e processar
          dados em servidores localizados fora do Brasil. Nesses casos, a transferência internacional
          observa o art. 33 da LGPD, apoiando-se em salvaguardas como cláusulas contratuais padrão,
          países com nível de proteção adequado e/ou o seu consentimento, conforme o caso.
        </P>
      </Section>

      <Section n="7" title="Por quanto tempo guardamos">
        <P>
          Mantemos os dados pessoais apenas pelo tempo necessário às finalidades para as quais foram
          coletados:
        </P>
        <UL>
          <LI>
            Dados de pedido de demonstração, contato e agendamento: mantidos durante o relacionamento
            comercial e por até <Strong>24 meses</Strong> após o último contato, salvo se você
            solicitar a exclusão antes ou se houver obrigação legal de guarda maior.
          </LI>
          <LI>
            Registros de acesso (logs): mantidos por até <Strong>6 meses</Strong>, conforme o art. 15
            do Marco Civil da Internet.
          </LI>
          <LI>
            Dados necessários ao cumprimento de obrigação legal ou ao exercício de direitos em
            processo: mantidos pelos prazos legais aplicáveis.
          </LI>
        </UL>
        <P>
          Encerrado o tratamento, os dados são eliminados de forma segura ou anonimizados, ressalvadas
          as hipóteses do art. 16 da LGPD.
        </P>
      </Section>

      <Section n="8" title="Cookies e tecnologias de rastreamento">
        <P>
          Utilizamos cookies para o funcionamento do site e, mediante o seu consentimento, para
          medir audiência e marketing:
        </P>
        <UL>
          <LI>
            <Strong>Essenciais:</Strong> necessários ao funcionamento do site e ao registro da sua
            própria escolha no banner de cookies. Não dependem de consentimento.
          </LI>
          <LI>
            <Strong>Analíticos (Google Analytics):</Strong> ajudam a entender como o site é usado,
            para melhorá-lo. Ativados somente com o seu consentimento.
          </LI>
          <LI>
            <Strong>Marketing (Meta Pixel):</Strong> mensuram e otimizam campanhas. Ativados somente
            com o seu consentimento.
          </LI>
        </UL>
        <P>
          Você pode aceitar ou recusar no banner exibido ao acessar o site e, a qualquer momento,
          alterar sua escolha limpando os cookies do navegador ou reabrindo o banner. Você também
          pode bloquear cookies nas configurações do seu navegador.
        </P>
      </Section>

      <Section n="9" title="Seus direitos como titular">
        <P>
          A LGPD garante a você, a qualquer momento e mediante requisição, os direitos de confirmação
          e acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre
          compartilhamentos, revogação do consentimento e oposição a tratamentos feitos com base no
          legítimo interesse (art. 18). Explicamos cada direito e como exercê-lo na nossa{' '}
          <a href="/lgpd" className="text-moss-700 underline-offset-2 hover:underline">
            Central de Privacidade (LGPD)
          </a>
          .
        </P>
      </Section>

      <Section n="10" title="Como protegemos seus dados">
        <P>
          Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não
          autorizados e situações de destruição, perda, alteração ou difusão indevidas — incluindo
          criptografia em trânsito (HTTPS/TLS), controle de acesso restrito e princípio da
          minimização. Os detalhes estão na nossa{' '}
          <a href="/seguranca" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Segurança da Informação
          </a>
          . Nenhum sistema é totalmente imune a incidentes; por isso, mantemos processos de resposta e
          comunicação previstos no art. 48 da LGPD.
        </P>
      </Section>

      <Section n="11" title="Dados de crianças e adolescentes">
        <P>
          Este site é destinado a profissionais e empresas (público B2B) e não se dirige a menores de
          18 anos. Não coletamos intencionalmente dados de crianças e adolescentes. Caso identifique
          esse tipo de coleta, contate o Encarregado para a devida eliminação.
        </P>
      </Section>

      <Section n="12" title="Alterações desta Política">
        <P>
          Esta Política pode ser atualizada para refletir mudanças legais, técnicas ou de negócio. A
          versão vigente é sempre a publicada nesta página, com a data de última atualização indicada
          no topo. Alterações relevantes poderão ser comunicadas pelos nossos canais.
        </P>
      </Section>

      <Section n="13" title="Contato e Encarregado (DPO)">
        <P>
          Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, fale com o nosso
          Encarregado pelo Tratamento de Dados Pessoais:
        </P>
        <UL>
          <LI>
            <Strong>Encarregado:</Strong> {legal.encarregado}
          </LI>
          <LI>
            <Strong>E-mail:</Strong>{' '}
            <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
              {legal.emailPrivacidade}
            </a>
          </LI>
          <LI>
            <Strong>Controlador:</Strong> {legal.razaoSocial} — CNPJ {legal.cnpj}
          </LI>
        </UL>
        <P>
          Você também tem o direito de peticionar à Autoridade Nacional de Proteção de Dados (ANPD)
          pelos canais oficiais em gov.br/anpd.
        </P>
      </Section>
    </LegalShell>
  );
}
