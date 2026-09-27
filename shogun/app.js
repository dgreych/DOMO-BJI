const prerequisites = {
  "windows": {
    "command": "winget install --id OpenJS.NodeJS.LTS --exact --source winget\nwinget install --id Git.Git --exact --source winget",
    "note": "Feche e reabra o terminal. Confira node --version, npm.cmd --version e git --version.",
    "ffmpeg": "winget install --id Gyan.FFmpeg --exact --source winget"
  },
  "linux": {
    "command": "sudo apt update\nsudo apt install -y git curl\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash\n. \"$HOME/.nvm/nvm.sh\"\nnvm install 24",
    "note": "Comandos para Ubuntu/Debian. Confira node --version, npm --version e git --version. Outras distribuições: veja o guia completo.",
    "ffmpeg": "sudo apt install -y ffmpeg"
  },
  "macos": {
    "command": "brew install git node@24\nexport PATH=\"$(brew --prefix node@24)/bin:$PATH\"",
    "note": "Instale o Homebrew pelo site brew.sh antes destes comandos. Confira node --version, npm --version e git --version. O guia explica como manter o PATH.",
    "ffmpeg": "brew install ffmpeg"
  },
  "termux": {
    "command": "pkg update -y\npkg install -y git nodejs-lts ffmpeg",
    "note": "Use o Termux do F-Droid ou GitHub oficial, como explicado no guia. Aguarde cada comando terminar. Confira node --version e ffmpeg -version.",
    "ffmpeg": "pkg install -y ffmpeg"
  }
};
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
    document.getElementById('menu-preview').textContent = ['╭━╼ 🐈‍⬛ SHOGUN', '┃  ' + { member: 'MENU PRINCIPAL', admin: 'ADMINISTRAÇÃO', owner: 'DONO' }[button.dataset.role], '┃  Você ┆ prefixo !', '┃', '┣━╼ 01 ╸ COMANDOS', ...entries.flatMap(([command, label]) => ['┃    ↳ !' + command, '┃      ' + label]), '┃', '╰━╼ SHOGUN ━━━━━━━━━'].join('\n');
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
    const prerequisitesForPlatform = prerequisites[button.dataset.platform];
    document.getElementById('requirements-command').textContent = prerequisitesForPlatform.command;
    document.getElementById('requirements-note').textContent = prerequisitesForPlatform.note;
    document.getElementById('ffmpeg-command').textContent = prerequisitesForPlatform.ffmpeg;
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

document.getElementById('copy-requirements').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById('requirements-command').textContent);
    document.getElementById('copy-status').textContent = 'Requisitos copiados. Execute no terminal da plataforma escolhida.';
  } catch {
    document.getElementById('copy-status').textContent = 'Selecione os comandos dos requisitos para copiá-los.';
  }
});
