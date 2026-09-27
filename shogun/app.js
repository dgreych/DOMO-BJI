const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  mainNav.classList.toggle('is-open', open);
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const subject = document.getElementById('contact-subject').value;
  const message = `${name ? `Olá, meu nome é ${name}. ` : 'Olá! '}Quero conversar sobre ${subject.toLowerCase()}.`;
  window.open('https://wa.me/5522997028553?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
});

const previews = {
  member: [['menudown', 'Downloads e mídia'], ['menufig', 'Figurinhas'], ['menubn', 'Brincadeiras'], ['menurpg', 'RPG e progressão']],
  admin: [['menuadm', 'Proteções e administração'], ['antilinkgp', 'Proteção contra convites'], ['bemvindo', 'Boas-vindas do grupo'], ['grupo', 'Informações do grupo']],
  owner: [['menudono', 'Configuração da instância'], ['defmsgpromo <mensagem>', 'Salva uma promoção'], ['listmsgpromo', 'Textos e progresso'], ['sendmsgpromo <id>', 'Envio gradual aos grupos']],
};
document.querySelectorAll('[data-role]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-role]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const entries = previews[button.dataset.role];
    document.getElementById('menu-preview').textContent = ['╭━━━─〔 🐈‍⬛ SHOGUN 〕─━━━', '┃  ' + { member: 'MENU PRINCIPAL', admin: 'ADMINISTRAÇÃO', owner: 'DONO' }[button.dataset.role], '┃', ...entries.flatMap(([command, label]) => ['┃  ▸ !' + command, '┃    ' + label]), '┃', '╰━━━─〔 SHOGUN 〕─━━━━'].join('\n');
  });
});
const platformNotes = {
  windows: 'No PowerShell, com os requisitos do guia instalados:',
  linux: 'No terminal, com Git, Node.js e FFmpeg instalados:',
  macos: 'No Terminal, com Git, Node.js e FFmpeg instalados:',
  termux: 'No Termux, depois de instalar os requisitos do guia:',
};
document.querySelectorAll('[data-platform]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-platform]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('platform-note').textContent = platformNotes[button.dataset.platform];
    document.getElementById('platform-guide').href = 'https://github.com/dgreych/shogun/blob/main/docs/instalacao/' + button.dataset.platform + '.md';
    document.getElementById('copy-status').textContent = '';
  });
});
document.getElementById('copy-command').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('install-command').textContent);
    document.getElementById('copy-status').textContent = 'Comandos copiados.';
  } catch {
    document.getElementById('copy-status').textContent = 'Selecione os comandos acima para copiá-los.';
  }
});
