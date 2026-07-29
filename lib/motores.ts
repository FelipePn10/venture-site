/**
 * Os motores de cálculo do VentureERP — o que o sistema decide sozinho.
 *
 * Cada entrada vira uma página em /motor/[slug] e uma linha no menu
 * "Motores de cálculo". O conteúdo é a tradução comercial do que está
 * implementado no backend (docs/apresentacao/*.md e docs/dev/*.md do
 * panossoerp): MRP, CRP, APS, promessa de entrega, previsão, custeio e
 * configurador.
 *
 * O plano de corte é o único que não mora aqui: ele já tem página inteira e
 * simulador em /plano-de-corte, e o menu aponta para lá (ver NAV_MOTORES).
 *
 * Regra de números: nada de percentual sem cliente medido por trás — ver a
 * política de claims do site. As páginas abaixo são todas qualitativas.
 */

export type Motor = {
  /** Rótulo curto, como aparece no menu. */
  nav: string;
  /** A pergunta que o motor responde, em uma linha, no dropdown. */
  hint: string;
  /** H1 da página. */
  title: string;
  /** Chamada da página: a pergunta do dono da fábrica. */
  question: string;
  body: string;
  /** O que o cálculo leva em conta. */
  entra: string[];
  /** Como ele decide, passo a passo. */
  passos: [string, string][];
  /** O que a fábrica recebe no fim. */
  saida: string[];
  /**
   * Um caso concreto para o visitante conferir a conta com os próprios olhos.
   * Os números são ilustrativos — servem para mostrar o raciocínio, não para
   * prometer resultado. A página deixa isso escrito embaixo do bloco.
   */
  exemplo: { titulo: string; passos: string[]; fecho: string };
  /**
   * A camada profunda: o que o motor realmente faz, agrupado por assunto.
   * Existe porque o resumo comercial fazia o MRP (e os outros) parecerem
   * pequenos. Aqui vale detalhe técnico — quem chega até essa altura da página
   * está avaliando o produto, não sendo apresentado a ele.
   */
  detalhes: { grupo: string; itens: string[] }[];
  /** Ligações com o resto do sistema. */
  conn: string[];
};

export const motores: Record<string, Motor> = {
  mrp: {
    nav: 'MRP · necessidade de material',
    hint: 'O que comprar e fabricar, quanto e para quando',
    title: 'MRP.',
    question: 'O que precisa ser comprado e fabricado, em que quantidade e até quando?',
    body: 'Numa fábrica com estrutura de três níveis e centenas de pedidos no mês, essa conta deixa de caber no papel — não por falta de quem saiba fazê-la, mas por volume. O MRP abre a ficha técnica de cada pedido nível a nível, desconta o que já existe no estoque e o que já está a caminho, aplica lote mínimo e estoque de segurança, e recua no tempo a partir da data de entrega para dizer o dia em que cada compra e cada ordem precisa começar.',
    entra: [
      'Pedidos de venda confirmados, demandas avulsas e previsões de venda',
      'Ficha técnica (BOM) multinível de cada produto',
      'Saldo atual de estoque, item por item',
      'Compras e ordens já em andamento — o suprimento firme',
      'Lote mínimo, múltiplo de compra e estoque de segurança de cada item',
      'Prazo do fornecedor e tempo de produção pelo caminho crítico do roteiro',
      'Calendário industrial — feriado não conta como dia produtivo',
    ],
    passos: [
      ['Junta a demanda', 'Pedidos confirmados, demandas independentes e previsões entram na mesma conta.'],
      ['Abre a receita', 'Explode a estrutura do produto nível a nível até chegar na matéria-prima.'],
      ['Desconta o que já tem', 'Necessidade líquida = o que é preciso − estoque − o que já foi comprado ou está em produção.'],
      ['Aplica a regra do item', 'Lote mínimo, múltiplo e estoque de segurança ajustam a quantidade sugerida.'],
      ['Recua no tempo', 'A partir da data de entrega, volta pelo prazo do fornecedor ou pelo tempo de fabricação até achar a data de início.'],
      ['Sugere e devolve a decisão', 'O MRP não compra nem produz sozinho. Ele propõe; o planejador firma o que concorda.'],
    ],
    saida: [
      'Sugestões de compra e de produção, com quantidade e data',
      'Perfil de cada item: necessidade, estoque projetado e suprimento período a período',
      'Mensagens de exceção — atraso inevitável, cadastro incompleto, gargalo de máquina',
      'Sugestão firmada vira ordem planejada com número, e daí ordem de produção ou pedido de compra',
    ],
    exemplo: {
      titulo: 'O pedido que parecia caber no prazo',
      passos: [
        'Entram 100 suportes com entrega no dia 30 — um prazo que, à primeira vista, é confortável.',
        'O MRP abre a estrutura nível a nível: o suporte é soldado a partir de uma peça cortada, que sai de uma chapa comprada.',
        'Estoque: 20 suportes prontos e 40 kg de chapa. Faltam 80 peças, e a produção precisa de 64 kg — comprar 24.',
        'Só que a chapa vem em múltiplo de 50 kg. A compra não é de 24 kg, é de 50.',
        'O fornecedor entrega em 5 dias; corte, solda e pintura levam 3 pelo caminho crítico — a pintura da tampa roda em paralelo e não soma no prazo.',
      ],
      fecho:
        'O pedido de compra tinha que ter saído ontem. O MRP faz essa conta para milhares de itens em segundos e ainda dispara a mensagem de exceção avisando que o dia 30 já nasceu impossível — enquanto ainda dá tempo de renegociar, em vez de ligar pedindo desculpa no dia 29.',
    },
    detalhes: [
      {
        grupo: 'Explosão da estrutura',
        itens: [
          'Percorre a estrutura do produto nível a nível — produto final, conjunto, componente, matéria-prima — sem limite de profundidade.',
          'Cada item tem um código de nível mais baixo (LLC): o nível mais fundo em que ele aparece em qualquer estrutura da fábrica.',
          'O cálculo processa os itens em ordem de LLC. Assim, quando chega no parafuso usado em cinco produtos diferentes, ele já somou toda a demanda e gera uma ordem de 100 — não cinco ordens de 20.',
          'Estrutura marcada como comercial não entra na produção industrial; item de terceiro não gera ordem porque não é da empresa.',
        ],
      },
      {
        grupo: 'As três fontes de demanda',
        itens: [
          'Pedido de venda confirmado entra como demanda firme, gerada automaticamente na confirmação.',
          'Demanda independente avulsa, lançada à mão quando existe uma necessidade que não veio de pedido.',
          'Previsão de venda entra como demanda de planejamento — e o pedido real continua sendo o sinal mais forte quando aparece.',
          'O status da demanda controla o que ainda pesa: pendente entra no cálculo, entregue e cancelada saem.',
        ],
      },
      {
        grupo: 'Cálculo reprodutível',
        itens: [
          'O estoque entra como uma foto tirada no instante da rodada. Rodar de novo no mesmo dia parte do mesmo ponto, sem ser contaminado por movimentações do meio do caminho.',
          'Só um cálculo de planejamento roda por vez em todo o sistema, garantido no banco de dados — mesmo com mais de uma instância da API no ar. A segunda chamada é recusada em vez de gerar sugestão corrompida.',
          'Cada execução deixa log com histórico, para você comparar a fotografia do último cálculo com a posição atual.',
        ],
      },
      {
        grupo: 'Regras por item',
        itens: [
          'Lote mínimo e múltiplo de compra ou produção — não adianta precisar de 3 quando o fornecedor vende de 10 em 10.',
          'Estoque de segurança somado à demanda antes do cálculo da necessidade líquida.',
          'Lead time de compra ou de fabricação, este último vindo do caminho crítico do roteiro.',
          'Regras configuradas que sobrescrevem um campo específico (lead time, lote mínimo) por igualdade, diferença ou faixa, com sequência de aplicação — dá para ajustar o comportamento de um item sem mexer no cadastro dele.',
        ],
      },
      {
        grupo: 'Cinco modos de planejamento',
        itens: [
          'MRP — o cálculo completo, para item com receita e demanda calculável.',
          'Mín/máx — repõe entre um nível mínimo e um máximo.',
          'Ponto de pedido — dispara a compra quando o saldo cai abaixo do limite, alimentado pelo consumo médio que o estoque calcula sozinho.',
          'Kanban — reposição puxada por consumo, com trava para não duplicar ordem.',
          'MPS / plano-mestre — item-chave planejado à mão pelo PCP.',
        ],
      },
      {
        grupo: 'O que sai do cálculo',
        itens: [
          'Sugestões de compra ou de fabricação conforme o tipo do item, cada uma com quantidade, data de necessidade e data de início.',
          'Perfil de cada item período a período: demanda, estoque projetado, ordens planejadas e ordens firmes — a linha do tempo do item ao longo do horizonte.',
          'Mensagens de exceção quando algo não fecha: atraso inevitável, cadastro incompleto, gargalo de máquina. Podem ser notificadas por e-mail ou alerta.',
          'Agenda de máquina, para o sequenciamento partir de algo pronto.',
        ],
      },
      {
        grupo: 'Firmar, liberar, replanejar',
        itens: [
          'Sugestão é proposta. Firmar cria a ordem planejada com número, que passa a contar como suprimento firme nas rodadas seguintes.',
          'Rodar o MRP de novo recalcula os perfis do zero — e não toca no que já foi firmado.',
          'Ordem apenas liberada pode voltar ao planejamento enquanto não houver apontamento nem consumo.',
          'A ação vale para várias ordens de uma vez; rejeitar é simplesmente não firmar.',
          'Em relações entre fábricas marcadas para liberação automática, o cálculo converte e libera só as sugestões elegíveis, sem duplicá-las na reexecução.',
        ],
      },
    ],
    conn: [
      'Engenharia → a estrutura e o roteiro que o cálculo explode',
      'Estoque → saldo, lote mínimo e estoque de segurança',
      'Compras → sugestão firmada vira pedido de compra',
      'Capacidade e sequenciamento → recebem as ordens sugeridas para conferir se cabem',
    ],
  },

  capacidade: {
    nav: 'CRP · capacidade',
    hint: 'A fábrica aguenta o que foi planejado?',
    title: 'Capacidade (CRP).',
    question: 'O plano que acabou de sair cabe dentro das horas que a fábrica tem?',
    body: 'O MRP responde o que produzir. O CRP responde se dá. Ele pega todas as ordens sugeridas, soma as horas que cada uma exige de cada máquina e centro de trabalho, dia a dia, e compara com a capacidade que existe de verdade — já descontando manutenção, feriado e parada programada. Onde passar de 100%, ele aponta.',
    entra: [
      'Todas as ordens sugeridas e planejadas do período',
      'Roteiro de produção: quais operações, em qual máquina, por quanto tempo',
      'Capacidade instalada de cada máquina e centro de trabalho',
      'Paradas de manutenção, preventivas e não planejadas',
      'Calendário industrial: turnos, finais de semana e feriados',
    ],
    passos: [
      ['Distribui a carga', 'Cada operação de cada ordem cai no dia e na máquina em que deveria acontecer.'],
      ['Soma por recurso e por dia', 'A carga vira horas necessárias por máquina e por centro de trabalho, dia a dia.'],
      ['Desconta o que não produz', 'Manutenção, parada e dia não útil saem da capacidade disponível antes da comparação.'],
      ['Compara e aponta', 'Onde a carga passa da capacidade, o centro aparece marcado como sobrecarregado.'],
    ],
    saida: [
      'Carga por máquina e por centro de trabalho, dia a dia',
      'Lista dos centros sobrecarregados, com quanto passou de 100%',
      'O alerta que evita prometer um prazo que a fábrica não tem como cumprir',
    ],
    exemplo: {
      titulo: 'A dobradeira da semana do dia 12',
      passos: [
        'O MRP sugeriu 34 ordens para a semana do dia 12. No papel, todas aceitas.',
        'O CRP joga cada operação do roteiro no dia e na máquina em que ela realmente cairia.',
        'A dobradeira acumula 61 horas de carga.',
        'Dois turnos por cinco dias dariam 80 horas — mas o dia 15 é feriado (−16 h) e há 6 horas de preventiva já agendada.',
        'Capacidade real da semana: 58 horas.',
      ],
      fecho:
        'A dobradeira aparece com 105% de carga antes de a semana começar. Três horas de estouro numa máquina é exatamente o tamanho do problema que planilha nenhuma enxerga — e que reaparece no dia 20 como "atraso inexplicável", quando a única saída restante é hora extra no sábado ou o telefonema para o cliente.',
    },
    detalhes: [
      {
        grupo: 'De onde vem a carga',
        itens: [
          'Cada operação do roteiro de cada ordem sugerida e planejada, com o tempo que ela exige.',
          'O tempo total de fabricação sai do caminho crítico da rede de precedências — operações que rodam em paralelo não somam no prazo, como na fábrica real.',
          'A carga cai no dia e no recurso em que a operação realmente aconteceria, não distribuída por média.',
        ],
      },
      {
        grupo: 'Capacidade que existe de verdade',
        itens: [
          'Capacidade instalada de cada máquina e de cada centro de trabalho, em hierarquia: o centro agrega, a máquina executa.',
          'Calendário industrial com turnos, finais de semana e feriados — dia não útil não vira hora produtiva.',
          'Paradas de manutenção, planejadas e não planejadas, descontadas por intervalo antes da comparação.',
        ],
      },
      {
        grupo: 'O que o relatório entrega',
        itens: [
          'Carga por máquina e por centro de trabalho, dia a dia, dentro do plano de produção.',
          'Percentual de ocupação de cada recurso e a lista dos centros acima de 100%.',
          'A sobrecarga aparece antes de a semana começar, enquanto ainda cabe remanejar ordem, antecipar turno ou renegociar data.',
        ],
      },
      {
        grupo: 'Onde entra no fluxo',
        itens: [
          'Roda entre o MRP e o sequenciamento: o MRP diz o que produzir, o CRP diz se cabe, o APS diz em que ordem.',
          'O pipeline de planejamento dispara os três num único comando e devolve um parecer de viabilidade consolidado.',
          'O parecer termina com um veredito: é viável ou não atender no prazo — com o que precisa ser comprado, onde há sobrecarga e a sequência sugerida.',
        ],
      },
    ],
    conn: [
      'MRP → as ordens sugeridas que precisam caber',
      'Máquinas e manutenção → capacidade real e paradas',
      'Sequenciamento → recebe a carga já conferida para montar a fila',
      'Promessa de entrega → a ocupação prevista alimenta a data prometida ao cliente',
    ],
  },

  sequenciamento: {
    nav: 'APS · sequenciamento',
    hint: 'Em que ordem e em qual máquina produzir',
    title: 'Sequenciamento (APS).',
    question: 'Tenho vinte ordens liberadas e seis máquinas. Qual entra primeiro, e onde?',
    body: 'Hoje quem responde isso é o encarregado, e costuma responder bem — o problema é que essa leitura mora só com ele, e não sobrevive a férias, ao turno da noite nem a um mês com o dobro de ordens. O APS monta a agenda de cada máquina com capacidade finita — uma ordem de cada vez, respeitando a prioridade do pedido, o calendário do recurso e as paradas de manutenção. O resultado é um Gantt: a fila de cada máquina e o caminho de cada ordem.',
    entra: [
      'Ordens de fabricação liberadas',
      'Prioridade de cada ordem — quem entrega antes vem primeiro',
      'Capacidade finita de cada máquina: uma operação por vez',
      'Grupos de recurso e calendário semanal por máquina',
      'Paradas planejadas e não planejadas',
      'Centro de trabalho, com custo de máquina e de mão de obra separados',
    ],
    passos: [
      ['Lê a fila', 'Ordens liberadas entram com sua prioridade e sua data de entrega.'],
      ['Escolhe o recurso', 'Cada operação vai para a máquina do grupo que a executa, dentro do calendário dela.'],
      ['Encaixa sem sobrepor', 'Capacidade finita: a máquina só faz uma coisa por vez, e parada não vira hora produtiva.'],
      ['Devolve a agenda', 'A sequência sai como Gantt por máquina ou por ordem, e fica registrado qual máquina foi escolhida.'],
    ],
    saida: [
      'Agenda de cada máquina em gráfico de Gantt, por período e por grupo de recurso',
      'A fila de produção com data e hora de início e fim de cada operação',
      'Filtro por ordem, máquina, centro de trabalho e planejador',
      'Exportação de refugo e paradas em CSV para análise fora do sistema',
    ],
    exemplo: {
      titulo: 'A guilhotina na segunda-feira',
      passos: [
        'Quatro ordens liberadas disputam a mesma guilhotina.',
        'Uma tem prioridade alta e entrega no dia 17. Duas são do mesmo cliente, para o dia 20. A quarta é amostra, sem prazo firme.',
        'A guilhotina faz uma de cada vez, e na segunda tem preventiva das 8h às 12h.',
        'O APS encaixa respeitando prioridade, capacidade finita e o calendário daquela máquina.',
      ],
      fecho:
        'A agenda sai pronta: a do dia 17 na sexta à tarde, as duas do dia 20 na segunda depois da manutenção, a amostra na janela da terça. E fica registrado qual máquina fez o quê — então, quando o cliente ligar cobrando o dia 20, a resposta não depende da memória do encarregado nem de ele estar na fábrica naquele dia.',
    },
    detalhes: [
      {
        grupo: 'O que entra na fila',
        itens: [
          'Ordens de fabricação liberadas, com prioridade e data de entrega.',
          'A seleção do cálculo aceita recorte por ordem, por máquina, por centro de trabalho e por operação — dá para sequenciar só o setor que interessa.',
          'O ponto de partida no tempo é configurável: sequenciar a partir de agora ou a partir de uma data futura.',
        ],
      },
      {
        grupo: 'Capacidade finita de verdade',
        itens: [
          'Uma operação por vez em cada recurso. Não é capacidade infinita fingindo que a máquina se multiplica.',
          'Calendário semanal por máquina, com intervalos validados — um turno não atravessa a meia-noite por engano.',
          'Grupos de recurso: a operação vai para a máquina do grupo que sabe executá-la.',
          'Paradas planejadas e não planejadas registradas por intervalo, com CRUD próprio.',
        ],
      },
      {
        grupo: 'O centro de trabalho industrial',
        itens: [
          'Capacidade hierárquica: o centro de trabalho agrega, a máquina executa.',
          'Centro de custo de máquina e de homem separados — e o de homem nunca pode repetir o de máquina.',
          'Máquina marcada como crítica, com localização e grupo próprios.',
          'Perfil industrial do recurso: serviços, itens e responsáveis; serviços preventivos com periodicidade, materiais e responsáveis, integrados às ordens de manutenção.',
        ],
      },
      {
        grupo: 'O que fica registrado',
        itens: [
          'Qual máquina efetivamente executou cada operação — não a máquina que "deveria" ter feito.',
          'Consulta por data e hora inicial e final, com unidade em hora ou minuto.',
          'Um grupo de recurso por consulta, com faixas de ordem, máquina, centro e planejador.',
          'Exportação de refugo e paradas em JSON e CSV, para análise fora do sistema.',
        ],
      },
      {
        grupo: 'A saída',
        itens: [
          'Gráfico de Gantt por máquina — a agenda de cada recurso.',
          'Gráfico de Gantt por ordem — o caminho de cada pedido pela fábrica.',
          'Data e hora de início e fim de cada operação da fila.',
        ],
      },
      {
        grupo: 'Volume que o motor aguenta',
        itens: [
          'O roteiro de aceite do backend rodou 10.000 registros de sequência com leitura em 8,45 ms.',
          'Carga HTTP de 6.309 requisições com 0% de erro e p95 de 1,18 ms.',
          'Suíte executada com detector de concorrência, porque sequenciamento errado sob concorrência é ordem duplicada no chão de fábrica.',
          'Esses números vêm do nosso roteiro de aceite técnico, em ambiente controlado — não são medição na operação de um cliente.',
        ],
      },
    ],
    conn: [
      'Capacidade (CRP) → a carga conferida antes de virar fila',
      'PCP e chão de fábrica → a sequência vira o que o operador aponta',
      'Máquinas e manutenção → calendário, grupo e parada de cada recurso',
      'Promessa de entrega → a agenda mostra quando a ordem realmente termina',
    ],
  },

  prazo: {
    nav: 'Promessa de entrega',
    hint: 'Que data prometer ao cliente sem mentir',
    title: 'Promessa de entrega.',
    question: 'O cliente está no telefone perguntando a data. O que o comercial responde?',
    body: 'A saída comum é embutir folga na data: quando a folga sobra, o pedido vai para quem prometeu antes; quando falta, o cliente é avisado do atraso em cima da hora. Aqui a data prometida é calculada a partir do estoque disponível, da capacidade produtiva já comprometida e do calendário operacional. E o comercial ainda consegue reservar capacidade por alguns dias enquanto a negociação não fecha.',
    entra: [
      'Estoque disponível do item e das variantes',
      'Ocupação já comprometida por setor, tanque ou recurso, dia a dia',
      'Calendário de promessa por item — dias úteis ou bloqueados de cada produto',
      'Parâmetros gerais de como a data prometida é formada',
      'Reservas comerciais em aberto de outras negociações',
    ],
    passos: [
      ['Olha o que existe', 'Estoque disponível resolve a parte que pode sair amanhã.'],
      ['Olha o que cabe', 'O que precisa ser produzido entra na ocupação prevista do recurso, respeitando o que já foi vendido.'],
      ['Aplica o calendário', 'Dia bloqueado do item e dia não útil da fábrica saem da conta antes de a data fechar.'],
      ['Segura a capacidade', 'Enquanto a venda é negociada, a reserva comercial guarda o espaço por alguns dias.'],
    ],
    saida: [
      'Uma data de entrega que considera estoque, capacidade e calendário — não uma folga fixa aplicada a todo pedido',
      'Ocupação prevista por dia, visível para a fábrica antes de o pedido entrar',
      'Reserva comercial com prazo, para negociar sem prometer no escuro',
      'Reprogramação registrada com data original, nova data e motivo — datas firmes ficam protegidas',
    ],
    exemplo: {
      titulo: 'O cliente no telefone querendo 40 portas',
      passos: [
        'O cliente quer 40 portas no dia 10. O vendedor precisa responder agora, com ele na linha.',
        'Disponível para promessa: 12 prontas — o saldo menos o que já está reservado para outros pedidos.',
        'As 28 restantes passam pela pintura, que tem capacidade diária e já está comprometida até o dia 8.',
        'O sistema quebra as 28 de trás para frente a partir do dia 10, pulando o sábado que o calendário daquele item bloqueia.',
        'A conta não fecha no dia 10. Fecha no dia 14.',
      ],
      fecho:
        'O vendedor responde dia 14 com a fábrica atrás da data — e ainda segura essa capacidade por alguns dias enquanto negocia, sem virar pedido e sem entrar no MRP. Se o cliente sumir, a reserva expira sozinha e a capacidade volta para o próximo da fila. O que não acontece mais é prometer o dia 10 e descobrir no dia 9.',
    },
    detalhes: [
      {
        grupo: 'Disponível para promessa (ATP)',
        itens: [
          'Disponível = saldo − reservas, por item e por variação, somando todos os depósitos.',
          'Confirmar um pedido de venda reserva o disponível linha a linha, automaticamente.',
          'Criar, liberar e consumir reserva acontece na mesma transação do saldo — o disponível nunca fica mentindo entre uma operação e outra.',
        ],
      },
      {
        grupo: 'Ocupação por tanque ou setor',
        itens: [
          'Ocupação diária agrupada pelo código de tanque de planejamento do item — pintura, galvanização, montagem, o que for o gargalo do seu processo.',
          'Entram no cálculo os pedidos abertos e confirmados com entrega no período e as reservas comerciais ativas.',
          'A consulta devolve quantidade alocada, capacidade informada, saldo livre e percentual de ocupação por dia.',
          'Também o valor previsto por dia (quantidade × preço), para o comercial enxergar receita e não só volume.',
          'Item sem tanque de planejamento cadastrado gera aviso explícito em vez de sumir da conta.',
        ],
      },
      {
        grupo: 'Como a data é montada',
        itens: [
          'A quantidade é quebrada de trás para frente a partir da data que o cliente pediu.',
          'Cada dia respeita o calendário de promessa daquele item; dia não cadastrado cai no fallback de segunda a sexta.',
          'A verificação de estoque desconta o ATP antes de reservar capacidade produtiva — o que já existe não ocupa máquina à toa.',
          'A capacidade diária pode ser informada por consulta enquanto o cadastro formal de tanques não estiver completo.',
        ],
      },
      {
        grupo: 'Reserva comercial',
        itens: [
          'Guarda capacidade para uma venda em negociação sem virar pedido e sem entrar como demanda no MRP.',
          'Tem prazo de validade próprio: passou o prazo, expira e a capacidade volta para a fila.',
          'Modo simulação: calcula e mostra o resultado sem gravar nada, para o vendedor testar cenários na frente do cliente.',
          'Reserva gravada pode ser cancelada pelo código; reservas vencidas são expiradas em lote.',
        ],
      },
      {
        grupo: 'Reprogramação em lote',
        itens: [
          'Reprograma por período, cliente, representante, lista de pedidos ou lista de itens.',
          'Pedido ou item marcado com data firme é ignorado — data negociada não muda por engano num comando em massa.',
          'Ao reprogramar itens, a data do pedido acompanha a maior nova data das linhas.',
          'A resposta informa quantos pedidos e itens foram alterados e quais foram ignorados por data firme.',
          'Toda remarcação fica registrada com data original, nova data e motivo.',
        ],
      },
    ],
    conn: [
      'Vendas → a data que entra na proposta e no pedido',
      'Capacidade e sequenciamento → a ocupação que sustenta a promessa',
      'Estoque → o saldo disponível que encurta o prazo',
      'Reprogramação de entrega → o histórico de cada remarcação',
    ],
  },

  previsao: {
    nav: 'Previsão de demanda',
    hint: 'Quanto você vai vender, a partir do histórico',
    title: 'Previsão de demanda.',
    question: 'Quanto comprar de um item que só vira pedido quando já é tarde para comprar?',
    body: 'Para item de prazo de entrega longo, esperar o pedido chegar é garantir o atraso. A previsão estatística projeta a demanda futura a partir do histórico real de vendas — a mesma leitura que o planejador experiente já faz para os itens que conhece, aplicada a todo o cadastro e refeita a cada rodada. Ela entra no MRP como uma fonte de demanda a mais — e vai sendo consumida conforme a venda real acontece, para a fábrica não planejar duas vezes a mesma coisa.',
    entra: [
      'Histórico de vendas por item',
      'Previsão por item e por ano, organizada em blocos para comparar cenários',
      'Regra de apropriação: como a previsão se distribui ao longo do tempo',
      'Pedidos reais que vão entrando e consumindo a previsão',
    ],
    passos: [
      ['Lê o histórico', 'As saídas passadas de cada item alimentam o modelo estatístico.'],
      ['Projeta o futuro', 'O sistema calcula a demanda esperada por período e informa a margem de erro do modelo que usou.'],
      ['Distribui no tempo', 'A apropriação espalha a previsão pelos períodos, com uma regra padrão da casa.'],
      ['Deixa a venda real consumir', 'Conforme o pedido entra, ele abate a previsão — o MRP não soma os dois.'],
    ],
    saida: [
      'Demanda projetada por item e período, pronta para entrar no plano de produção',
      'Blocos de previsão para comparar cenários lado a lado',
      'Previsão consumida pela venda real, sem duplicar necessidade',
      'Consumo médio mensal calculado das saídas, alimentando o ponto de reposição sem digitação',
    ],
    exemplo: {
      titulo: 'A chapa que chega em 45 dias',
      passos: [
        'Uma chapa específica leva 45 dias para chegar do fornecedor.',
        'Ela só vira necessidade quando o pedido é confirmado — e aí faltam 45 dias que ninguém tem.',
        'O histórico de saídas mostra a demanda dela concentrada entre março e abril, ano após ano.',
        'A previsão projeta isso a partir do histórico e entra no plano como uma terceira fonte de demanda, ao lado dos pedidos e das necessidades avulsas.',
      ],
      fecho:
        'A compra sai em janeiro. Em março o pedido real chega e consome a previsão em vez de somar em cima dela — a fábrica não compra duas vezes a mesma chapa. E dá para montar dois blocos de previsão, um agressivo e um conservador, e comparar quanto de caixa cada cenário exige antes de decidir qual seguir.',
    },
    detalhes: [
      {
        grupo: 'Modelos estatísticos',
        itens: [
          'Média móvel, com janela ajustável.',
          'Suavização exponencial, com alfa ajustável — dá mais peso ao passado recente.',
          'Holt-Winters, que trata tendência e sazonalidade: o item que sempre sobe em março é tratado como tal, não como ruído.',
          'No modo automático o sistema roda todos os modelos disponíveis e fica com o de menor erro médio (MAPE).',
          'A resposta informa qual modelo foi escolhido e com que erro — você sabe o quanto confiar naquele número antes de comprar em cima dele.',
        ],
      },
      {
        grupo: 'Geração pelo histórico do ERP',
        itens: [
          'A fonte pode ser pedidos de venda liberados, notas fiscais de saída autorizadas, ou os dois somados.',
          'O sistema calcula a média mensal do período escolhido e aplica um índice de projeção — para planejar um ano de crescimento ou de retração.',
          'Pedido cancelado, item cancelado, pedido bloqueado ou reprovado na análise comercial ou financeira fica de fora da média. Histórico sujo não vira previsão.',
        ],
      },
      {
        grupo: 'Como a previsão se distribui',
        itens: [
          'A entrada operacional é mensal; o sistema reparte em semanas conforme os dias úteis do calendário industrial — um mês com feriado não recebe a mesma fatia semanal de um mês cheio.',
          'Item que não aceita quantidade fracionada arredonda para baixo e concentra o saldo na última semana do mês.',
          'A apropriação diária distribui a previsão semanal pelos dias da semana em percentual, com uma tabela padrão da casa; a soma não passa de 100%.',
          'Períodos podem ser bloqueados — e a geração ignora esses períodos informando o motivo, em vez de gravar por cima.',
        ],
      },
      {
        grupo: 'Convivência com a venda real',
        itens: [
          'A previsão entra no planejamento como demanda de planejamento; o pedido confirmado entra como demanda firme e é o sinal mais forte.',
          'O cálculo carrega previsões do ano corrente e do ano seguinte, item a item e variação a variação.',
          'Previsão existente só é sobrescrita quando você autoriza; caso contrário aparece como ignorada, para não duplicar necessidade sem querer.',
        ],
      },
    ],
    conn: [
      'MRP → a previsão é uma das três fontes de demanda do cálculo',
      'Estoque → consumo médio e ponto de reposição',
      'Compras → antecipa item de prazo longo antes de o pedido existir',
      'Vendas → o pedido real consome a previsão do item',
    ],
  },

  custo: {
    nav: 'Custo padrão · rollup',
    hint: 'Quanto custa mesmo a peça, incluindo o indireto',
    title: 'Custo padrão e rollup.',
    question: 'Quanto custa a peça de verdade — não só o material que dá para ver?',
    body: 'Preço formado só pelo material é margem perdida em silêncio. O rollup sobe pela estrutura de baixo para cima: cada intermediário acumula material, tempo de máquina e a parcela de custo indireto, e o produto final já nasce com o custo de tudo o que veio antes. Depois, o custo realizado da produção volta e mostra onde o padrão não bateu.',
    entra: [
      'Estrutura do produto (BOM) e custo de compra de cada item comprado',
      'Roteiro de produção com o tempo de cada operação',
      'Custo por hora de cada centro de trabalho — máquina e mão de obra',
      'Custos indiretos da fábrica: energia, supervisão, aluguel',
      'Base de alocação escolhida: horas de máquina, quantidade produzida ou valor de material',
    ],
    passos: [
      ['Parte do comprado', 'Cada matéria-prima entra pelo seu custo de compra de referência.'],
      ['Sobe um nível', 'O intermediário soma material + tempo de máquina do roteiro + overhead rateado.'],
      ['Repete até o topo', 'O produto final já carrega o custo de todos os seus intermediários, de forma consistente.'],
      ['Rateia o indireto', 'A base de alocação distribui os custos gerais aos produtos e centros pelo critério escolhido.'],
      ['Compara com o real', 'O tempo apontado e o material consumido na produção revelam o desvio contra o padrão.'],
    ],
    saida: [
      'Custo padrão de cada item, consultável a qualquer momento',
      'Composição aberta em material, máquina e overhead',
      'Custo real por ordem de produção, do que foi de fato apontado e consumido',
      'Desvio padrão × real, mostrando qual operação ou material comeu a margem',
    ],
    exemplo: {
      titulo: 'O suporte que parecia custar R$ 18',
      passos: [
        'A chapa do suporte custa R$ 12. É o número que todo mundo enxerga.',
        'O corte leva 4 minutos numa máquina de R$ 90/hora: R$ 6. Aqui a planilha para — R$ 18.',
        'A solda leva mais 7 minutos num centro de R$ 75/hora: R$ 8,75.',
        'O overhead da fábrica, rateado por hora de máquina, soma R$ 4,20.',
        'Custo padrão real da peça: R$ 30,95.',
      ],
      fecho:
        'Quem vendeu com 30% de margem sobre R$ 18 vendeu a R$ 23,40 — sete reais abaixo do custo, em cada peça, e nada no processo apontava isso. E o padrão é só metade da história: quando a ordem fecha, o sistema valoriza o material que foi de fato baixado e as horas que foram de fato apontadas, e mostra o desvio contra o padrão. Você não descobre só que a peça dá prejuízo — descobre em qual operação ela começou a dar.',
    },
    detalhes: [
      {
        grupo: 'O rollup, nível a nível',
        itens: [
          'Sobe pela estrutura do produto de baixo para cima: a matéria-prima comprada entra pelo custo de compra, o intermediário acumula, o produto final herda tudo.',
          'Cada nível soma material da estrutura, transformação do roteiro e a parcela de overhead.',
          'Pode ser disparado sempre que um cadastro mudar — reajuste de matéria-prima, novo tempo de máquina, troca de roteiro.',
          'O resultado é consistente entre níveis: o custo do produto final já inclui o de todos os seus intermediários, sem dupla contagem.',
        ],
      },
      {
        grupo: 'As três parcelas',
        itens: [
          'Material: os itens da estrutura pelo custo de compra ou de estoque.',
          'Transformação: o tempo de cada operação do roteiro × o custo por hora do centro de trabalho.',
          'Overhead: a parcela de custos gerais da fábrica — energia, supervisão, aluguel — rateada ao produto.',
        ],
      },
      {
        grupo: 'Rateio do indireto',
        itens: [
          'A base de alocação define o critério: horas de máquina, quantidade produzida ou valor de material.',
          'A alocação de overhead distribui os custos indiretos aos produtos e centros usando essa base.',
          'O centro de custo mostra onde o dinheiro é consumido — setor, linha, máquina — e liga a produção à contabilidade e ao financeiro.',
        ],
      },
      {
        grupo: 'Custo real da ordem',
        itens: [
          'Material real = consumo × custo médio do item no estoque, preferindo o depósito de onde ele saiu.',
          'Conversão real = horas efetivamente apontadas (fim menos início do apontamento) × custo/hora do tipo da máquina que foi apontada.',
          'Overhead real = aplicado proporcionalmente à mão de obra real, pela razão padrão entre overhead e mão de obra.',
          'O padrão fica congelado como referência: custo unitário padrão do item × quantidade produzida.',
        ],
      },
      {
        grupo: 'Variância, componente a componente',
        itens: [
          'Real menos padrão em material, mão de obra, overhead e no total. Positivo significa que gastou mais do que o planejado.',
          'É o que mostra não só que a peça deu prejuízo, mas em qual operação ela começou a dar.',
          'Com isso a margem de cada peça é a real, não a teórica que saiu do orçamento.',
        ],
      },
      {
        grupo: 'Quando o cálculo roda',
        itens: [
          'Automaticamente ao fechar a ordem de produção.',
          'Recalculável a qualquer momento, e idempotente — reexecutar recalcula a mesma linha em vez de duplicar apuração.',
          'Uma falha no custeio não desfaz o fechamento da ordem: o chão de fábrica não trava por causa da controladoria.',
        ],
      },
    ],
    conn: [
      'Engenharia → a estrutura e o roteiro que o rollup percorre',
      'Máquinas → custo por hora de cada centro de trabalho',
      'Produção → tempo apontado e material consumido viram o custo real',
      'Orçamento → o preço sai de um custo que inclui o indireto',
    ],
  },

  configurador: {
    nav: 'Configurador de produto',
    hint: 'Produto que varia, sem um código para cada combinação',
    title: 'Configurador de produto.',
    question: 'Como vender uma peça que muda de cor, medida e acabamento a cada pedido?',
    body: 'A saída comum é cadastrar um código para cada combinação — e o cadastro passa a crescer mais rápido do que qualquer equipe consegue manter atualizado. Aqui o item é descrito por perguntas e respostas: cor da tampa, largura, acabamento. Ao configurar, o sistema monta a máscara que identifica exatamente aquela variação, e características do tipo fórmula calculam o que depende de conta.',
    entra: [
      'Conjuntos de respostas afins — o conjunto COR com AZUL, VERDE, PRETO',
      'Características: a pergunta que aparece ao configurar, com o tipo de resposta',
      'Tipos de resposta: escolha, escolha múltipla, texto, número com faixa e múltiplo, sim/não, desenho, fórmula, campo do pedido e sequencial',
      'Composição da máscara: qual sigla de cada resposta entra no código final',
      'Marcações por característica: afeta preço, controla metas, especial, variável padrão',
    ],
    passos: [
      ['Pergunta o que varia', 'O vendedor responde as características do item na hora de configurar.'],
      ['Calcula o que é fórmula', 'Característica do tipo fórmula resolve sozinha o que depende das outras respostas.'],
      ['Monta a máscara', 'As respostas viram o código que identifica aquela variação exata, sem cadastro novo.'],
      ['Leva para o preço', 'As características marcadas como "afeta preço" entram na formação do valor.'],
    ],
    saida: [
      'Máscara única identificando a variação vendida, sem inflar o cadastro de itens',
      'Preço formado pelas características que realmente mexem no custo',
      'Faixa e múltiplo validados na entrada — largura de 1 a 100, de 2 em 2',
      'Tradução por idioma nas respostas, para catálogo e exportação',
    ],
    exemplo: {
      titulo: 'A bancada que nunca é igual',
      passos: [
        'A bancada sai em qualquer largura de 80 a 240 cm, de 10 em 10: 17 larguras.',
        'Em três acabamentos, com ou sem cuba: 17 × 3 × 2 = 102 combinações.',
        'Cadastrar 102 códigos é manter 102 fichas técnicas — e reajustar o preço do MDF em todas quando o fornecedor aumentar.',
        'No configurador o item é um só, descrito por três perguntas.',
        'O metro de fita de borda ninguém digita: uma característica do tipo fórmula calcula a partir da largura respondida.',
      ],
      fecho:
        'O vendedor responde as três perguntas e sai BANC-160-CAR-CUB, com o preço já ajustado pelas características que mexem no custo. Um item no cadastro, 102 variações vendáveis — e quando o MDF reajustar, você mexe em um lugar, não em 102.',
    },
    detalhes: [
      {
        grupo: 'Como o item é descrito',
        itens: [
          'Conjuntos agrupam respostas afins — o conjunto COR com AZUL, VERDE, PRETO, cada uma com código, descrição e o que ela contribui para a máscara.',
          'Características são as perguntas que aparecem ao configurar, cada uma com o seu tipo de resposta.',
          'Tipos disponíveis: escolha, escolha múltipla, texto livre, número com faixa e múltiplo, sim/não, desenho, fórmula, campo puxado do pedido e sequencial.',
          'Característica marcada como especial esconde as de baixo até ser respondida — a pergunta seguinte só aparece quando faz sentido.',
          'Variável padrão pré-responde o caso mais comum, para o vendedor não repetir a mesma escolha todo dia.',
        ],
      },
      {
        grupo: 'A máscara',
        itens: [
          'Cada resposta contribui com a sua composição para montar o código final da variação.',
          'A máscara identifica aquela variação exata no pedido, no estoque e no custo — sem criar um item novo no cadastro.',
          'O saldo de estoque é segregado por empresa, item, máscara e lote: a variação azul de 18 mm tem saldo próprio, não um número agregado que não serve para nada.',
        ],
      },
      {
        grupo: 'Fórmulas',
        itens: [
          'Característica do tipo fórmula é calculada a partir das respostas anteriores, na ordem em que as perguntas aparecem.',
          'As fórmulas referenciam outras características pelo código — LARGURA, QTD, COR_LAM_EXT — em vez de posição.',
          'Exemplo real: AREA = LARGURA*2, com largura 5, gera a máscara com 10 já calculado.',
          'Fórmula também pode ser o conteúdo de uma regra de item: peso = QTD*10 atribui 50 quando a quantidade respondida é 5.',
        ],
      },
      {
        grupo: 'Restrições e dependências',
        itens: [
          'Combinação inválida é proibida na origem, em vez de virar pedido impossível de produzir.',
          'As regras comparam por igual, diferente, pertence, não pertence, maior e menor.',
          'A restrição de maior peso cujos dominantes batem age como dependência: a resposta de uma pergunta muda o que a próxima pode oferecer.',
        ],
      },
      {
        grupo: 'Geração em lote',
        itens: [
          'Produto cartesiano de todas as combinações válidas das características de escolha, para popular catálogo ou tabela de preço de uma vez.',
          'Cada combinação passa pelo mesmo motor de restrições antes de ser aceita — o lote não gera variação que a venda não pode vender.',
          'É obrigatório restringir ao menos uma característica, e o volume é limitado a 20.000 combinações por geração.',
          'A resposta informa o total gerado, quantas eram válidas, quantas foram persistidas e a lista de máscaras.',
        ],
      },
      {
        grupo: 'Descrição e idioma',
        itens: [
          'Tipos de descrição controlam como o item configurado aparece na proposta, na nota e no catálogo.',
          'As respostas aceitam tradução por idioma, para exportação e catálogo em outro país.',
          'Marcações por característica: se afeta preço, se controla metas comerciais, se entra na descrição.',
        ],
      },
    ],
    conn: [
      'Vendas → o item configurado entra no pedido com sua máscara',
      'Engenharia → a variação alimenta a ficha técnica e o roteiro',
      'Custo → as características que afetam preço entram na formação',
      // As telas de Restrições, Desenhos e Regras ainda não saíram no backend —
      // aqui afirmamos só o tipo de característica, que já existe.
      'Desenhos → o código do desenho pode ser a resposta de uma característica',
    ],
  },
};

/**
 * A ordem do menu. O plano de corte abre a lista e aponta para a própria
 * página dele — os outros sete moram em /motor/[slug].
 */
export const NAV_MOTORES: { label: string; hint: string; href: string }[] = [
  {
    label: 'Plano de corte',
    hint: 'Onde cortar cada peça para sobrar menos material',
    href: '/plano-de-corte',
  },
  ...Object.entries(motores).map(([slug, m]) => ({
    label: m.nav,
    hint: m.hint,
    href: `/motor/${slug}`,
  })),
];
