import { LegalShell, Section, P, UL, LI, Strong } from '@/components/Legal';
import { legal } from '@/lib/legal';

export const metadata = {
  title: 'Termos de Uso · VentureERP',
  description:
    'Condições de uso do site VentureERP, incluindo o agendamento de demonstrações e o envio de solicitações de contato.',
};

export default function TermosPage() {
  return (
    <LegalShell
      current="Termos de Uso"
      title="Termos de Uso"
      lead="Estes Termos regem o uso do site VentureERP e dos seus formulários de contato, pedido de demonstração e agendamento. Ao navegar e utilizar o site, você concorda com as condições abaixo."
    >
      <Section n="1" title="Aceitação dos Termos">
        <P>
          Estes Termos de Uso constituem um acordo entre você (“usuário”) e{' '}
          <Strong>{legal.razaoSocial}</Strong>, CNPJ {legal.cnpj}, com sede em {legal.endereco}{' '}
          (“{legal.nomeFantasia}”). Ao acessar {legal.site}, enviar um formulário ou agendar uma
          demonstração, você declara ter lido, compreendido e aceitado estes Termos. Se não concordar,
          não utilize o site.
        </P>
      </Section>

      <Section n="2" title="O que este site oferece">
        <P>
          Este é um site institucional cujo objetivo é apresentar o software VentureERP — voltado a
          metalúrgicas e moveleiras — e permitir que você solicite contato, assista a demonstrações
          gravadas e agende uma demonstração ao vivo, gratuitamente e sem compromisso.
        </P>
        <P>
          O site <Strong>não</Strong> realiza vendas, pagamentos ou contratação do software online. A
          eventual contratação do VentureERP é objeto de proposta e contrato próprios, com termos
          específicos, que não se confundem com estes Termos de Uso.
        </P>
      </Section>

      <Section n="3" title="Informações fornecidas por você">
        <P>
          Ao preencher os formulários, você se compromete a fornecer informações verdadeiras, exatas e
          atualizadas, e a não se passar por terceiros. Você é responsável pelos dados que informa. O
          tratamento desses dados é descrito na nossa{' '}
          <a href="/privacidade" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Privacidade
          </a>
          .
        </P>
      </Section>

      <Section n="4" title="Uso permitido e condutas vedadas">
        <P>Você concorda em utilizar o site de forma lícita e, em especial, a não:</P>
        <UL>
          <LI>Violar leis, regulamentos ou direitos de terceiros;</LI>
          <LI>
            Tentar acessar áreas restritas, contas ou sistemas sem autorização, ou burlar medidas de
            segurança;
          </LI>
          <LI>
            Introduzir vírus, malware ou qualquer código capaz de comprometer o site ou seus usuários;
          </LI>
          <LI>
            Realizar coleta automatizada de dados (scraping), sobrecarregar a infraestrutura ou
            praticar engenharia reversa;
          </LI>
          <LI>
            Enviar conteúdo ilícito, ofensivo, fraudulento, spam ou que infrinja direitos de
            propriedade intelectual.
          </LI>
        </UL>
      </Section>

      <Section n="5" title="Propriedade intelectual">
        <P>
          A marca VentureERP, o logotipo, os textos, layout, imagens, ilustrações e demais elementos
          do site são protegidos por direitos de propriedade intelectual e pertencem a{' '}
          {legal.razaoSocial} ou a seus licenciadores. É vedada a reprodução, distribuição ou uso sem
          autorização prévia e por escrito, ressalvado o uso pessoal e não comercial inerente à
          navegação.
        </P>
      </Section>

      <Section n="6" title="Disponibilidade e ausência de garantias">
        <P>
          Empregamos esforços razoáveis para manter o site disponível e correto, mas ele é oferecido
          “no estado em que se encontra”. Não garantimos disponibilidade ininterrupta, ausência de
          erros ou que as informações estejam sempre completas e atualizadas. Poderemos, a qualquer
          tempo, alterar, suspender ou descontinuar o site, no todo ou em parte, sem aviso prévio.
        </P>
      </Section>

      <Section n="7" title="Links e serviços de terceiros">
        <P>
          O site pode conter links ou integrações com serviços de terceiros (por exemplo, provedores
          de e-mail, vídeo, analytics e mídias sociais). Não nos responsabilizamos pelo conteúdo,
          práticas de privacidade ou disponibilidade desses serviços, que possuem seus próprios termos
          e políticas.
        </P>
      </Section>

      <Section n="8" title="Limitação de responsabilidade">
        <P>
          Na máxima extensão permitida pela legislação aplicável, {legal.nomeFantasia} não será
          responsável por danos indiretos, lucros cessantes ou prejuízos decorrentes do uso ou da
          impossibilidade de uso do site, de indisponibilidades ou de decisões tomadas com base nas
          informações aqui apresentadas. Nada nestes Termos exclui responsabilidades que não possam
          ser afastadas pela lei, em especial as previstas no Código de Defesa do Consumidor quando
          aplicável.
        </P>
      </Section>

      <Section n="9" title="Privacidade e proteção de dados">
        <P>
          O tratamento de dados pessoais realizado neste site é regido pela nossa{' '}
          <a href="/privacidade" className="text-moss-700 underline-offset-2 hover:underline">
            Política de Privacidade
          </a>{' '}
          e pela{' '}
          <a href="/lgpd" className="text-moss-700 underline-offset-2 hover:underline">
            Central de Privacidade (LGPD)
          </a>
          , que integram estes Termos para todos os fins.
        </P>
      </Section>

      <Section n="10" title="Alterações destes Termos">
        <P>
          Estes Termos podem ser atualizados a qualquer momento. A versão vigente é a publicada nesta
          página, com a data de última atualização indicada no topo. O uso continuado do site após
          alterações implica concordância com a versão revisada.
        </P>
      </Section>

      <Section n="11" title="Legislação aplicável e foro">
        <P>
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da{' '}
          {legal.foro} para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais
          privilegiado que seja, ressalvada, no caso de relação de consumo, a competência do foro do
          domicílio do consumidor.
        </P>
      </Section>

      <Section n="12" title="Contato">
        <P>
          Dúvidas sobre estes Termos podem ser encaminhadas para{' '}
          <a href={`mailto:${legal.emailContato}`} className="text-moss-700 hover:underline">
            {legal.emailContato}
          </a>
          . Para assuntos de privacidade, fale com o Encarregado:{' '}
          <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
            {legal.emailPrivacidade}
          </a>
          .
        </P>
      </Section>
    </LegalShell>
  );
}
