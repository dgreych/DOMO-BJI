(() => {
  const BASE = 'https://wa.me/5522999686677';
  const messages = {
    header: 'Olá! Conheci a Domo pela vitrine e quero explicar um gargalo do meu negócio.',
    menu: 'Olá! Vi a vitrine da Domo e quero conversar sobre uma solução sob medida.',
    hero: 'Olá! Quero explicar como funciona hoje uma parte do meu negócio e avaliar o que pode funcionar melhor.',
    method: 'Olá! Tenho um gargalo no meu negócio e quero entender como a Domo pode diagnosticá-lo e demonstrar uma solução.',
    final: 'Olá! Quero mostrar uma rotina que hoje dá trabalho demais e avaliar uma solução com a Domo.',
    float: 'Olá! Estou vendo a vitrine da Domo e quero conversar sobre meu negócio.'
  };

  const flowData = {
    agenda: {
      label: 'AGENDA / FLUXO CONCEITUAL',
      title: 'Da primeira mensagem ao horário confirmado.',
      copy: 'Um caminho guiado pode reunir serviço, preferência de horário e dados essenciais antes da conversa continuar.',
      benefit: 'menos ida e volta para chegar a um horário possível.',
      question: 'Qual período funciona melhor?',
      options: ['Manhã', 'Tarde', 'Noite'],
      selected: 1,
      path: ['Contato', 'Preferência', 'Confirmação'],
      message: 'Olá! Quero conversar sobre um fluxo de agenda e atendimento para meu negócio.'
    },
    orcamento: {
      label: 'ORÇAMENTO / FLUXO CONCEITUAL',
      title: 'Do pedido solto a uma proposta consistente.',
      copy: 'Serviços, opções e condições podem seguir uma sequência clara para reduzir conta refeita e informação esquecida.',
      benefit: 'mais padrão sem transformar cada proposta em uma nova planilha.',
      question: 'Qual opção faz parte deste pedido?',
      options: ['Essencial', 'Completa', 'Sob medida'],
      selected: 2,
      path: ['Necessidade', 'Composição', 'Proposta'],
      message: 'Olá! Quero conversar sobre uma ferramenta de orçamento para meu negócio.'
    },
    briefing: {
      label: 'BRIEFING / FLUXO CONCEITUAL',
      title: 'Da intenção vaga ao contexto que permite agir.',
      copy: 'Perguntas certas, na ordem certa, ajudam a reunir objetivo, prazo e preferências antes de alguém precisar reorganizar tudo.',
      benefit: 'menos conversa incompleta e uma próxima ação mais bem informada.',
      question: 'O que precisa acontecer primeiro?',
      options: ['Apresentar', 'Organizar', 'Automatizar'],
      selected: 1,
      path: ['Objetivo', 'Contexto', 'Próximo passo'],
      message: 'Olá! Quero conversar sobre um briefing guiado para meu negócio.'
    },
    portfolio: {
      label: 'PORTFÓLIO / FLUXO CONCEITUAL',
      title: 'Do “o que vocês fazem?” a uma escolha informada.',
      copy: 'Uma vitrine pode organizar serviços e caminhos de contato sem depender de explicação repetida a cada novo interesse.',
      benefit: 'uma presença comercial que conduz, em vez de apenas existir.',
      question: 'O que você quer conhecer?',
      options: ['Serviços', 'Processo', 'Contato'],
      selected: 0,
      path: ['Descoberta', 'Confiança', 'Conversa'],
      message: 'Olá! Quero conversar sobre uma vitrine ou portfólio comercial para meu negócio.'
    },
    triagem: {
      label: 'TRIAGEM / FLUXO CONCEITUAL',
      title: 'Da demanda misturada ao encaminhamento correto.',
      copy: 'Uma entrada orientada pode identificar o tipo de necessidade e reunir o mínimo para direcionar cada contato.',
      benefit: 'menos transferência sem contexto e mais clareza desde o início.',
      question: 'Que tipo de ajuda você procura?',
      options: ['Informação', 'Atendimento', 'Urgência'],
      selected: 1,
      path: ['Demanda', 'Contexto', 'Direção'],
      message: 'Olá! Quero conversar sobre um fluxo de triagem para meu negócio.'
    },
    automacao: {
      label: 'AUTOMAÇÃO / FLUXO CONCEITUAL',
      title: 'Da tarefa repetida a uma rotina previsível.',
      copy: 'Quando as mesmas informações percorrem sempre os mesmos passos, parte do trabalho pode acontecer sem copiar, colar e conferir tudo outra vez.',
      benefit: 'tempo humano preservado para o que realmente exige decisão.',
      question: 'Quando este fluxo deve começar?',
      options: ['Novo contato', 'Novo pedido', 'Novo prazo'],
      selected: 0,
      path: ['Gatilho', 'Rotina', 'Aviso'],
      message: 'Olá! Quero conversar sobre uma rotina que pode ser automatizada no meu negócio.'
    }
  };

  const toWhatsapp = (message) => `${BASE}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('.js-wa').forEach((link) => {
    link.href = toWhatsapp(messages[link.dataset.waContext] || messages.header);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const title = document.querySelector('[data-canvas-title]');
  const label = document.querySelector('[data-canvas-label]');
  const copy = document.querySelector('[data-canvas-copy]');
  const benefit = document.querySelector('[data-canvas-benefit]');
  const canvasUi = document.querySelector('[data-canvas-ui]');
  const canvasWa = document.querySelector('[data-canvas-wa]');
  const tabs = [...document.querySelectorAll('[data-flow]')];

  function renderFlow(key, updateUrl = true) {
    const flow = flowData[key];
    if (!flow) return;
    tabs.forEach((tab) => {
      const active = tab.dataset.flow === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    label.textContent = flow.label;
    title.textContent = flow.title;
    copy.textContent = flow.copy;
    benefit.textContent = flow.benefit;
    canvasWa.href = toWhatsapp(flow.message);
    canvasWa.target = '_blank';
    canvasWa.rel = 'noopener noreferrer';
    canvasUi.innerHTML = `<div class="ui-path">${flow.path.map((step, index) => `${index ? '<i></i>' : ''}<span class="${index === 0 ? 'complete' : index === 1 ? 'current' : ''}">${step}</span>`).join('')}</div><div class="ui-panel"><small>PRÓXIMA PERGUNTA</small><strong>${flow.question}</strong><div class="ui-options">${flow.options.map((option, index) => `<span class="${index === flow.selected ? 'selected' : ''}">${option}</span>`).join('')}</div></div>`;
    if (updateUrl) history.replaceState(null, '', `#${key}`);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderFlow(tab.dataset.flow));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      renderFlow(next.dataset.flow);
    });
  });

  const initialFlow = location.hash.slice(1);
  if (flowData[initialFlow]) renderFlow(initialFlow, false);
  else canvasWa.href = toWhatsapp(flowData.agenda.message);

  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  document.querySelector('[data-year]').textContent = new Date().getFullYear();
})();
