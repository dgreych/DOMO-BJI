const PHONE = '5522998399626';

const classes = {
  baby: {
    label: 'BABY', age: '4–6 ANOS',
    times: [['SEG · QUA', '18:30'], ['TER · QUI', '17:30']],
    message: 'Olá! Tenho interesse na turma Baby (4 a 6 anos) de Jiu-Jitsu. Gostaria de saber mais.'
  },
  juniors: {
    label: 'JUNIORS', age: '7–10 ANOS',
    times: [['SEG · QUA', '17:30'], ['TER · QUI', '18:30']],
    message: 'Olá! Tenho interesse na turma Juniors (7 a 10 anos) de Jiu-Jitsu. Gostaria de saber mais.'
  },
  teens: {
    label: 'TEENS', age: '11–16 ANOS',
    times: [['TER · QUI', '19:30']],
    message: 'Olá! Tenho interesse na turma Teens (11 a 16 anos) de Jiu-Jitsu. Gostaria de saber mais.'
  }
};

const wa = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

function renderClass(key) {
  const item = classes[key];
  const panel = document.querySelector('#class-panel');
  panel.innerHTML = `
    <div>
      <p class="eyebrow"><span></span>${item.age}</p>
      <h3>${item.label}</h3>
      <div class="panel-actions"><a href="${wa(item.message)}" target="_blank" rel="noreferrer">FALAR SOBRE ESTA TURMA ↗</a></div>
    </div>
    <div class="times">${item.times.map(([day,time]) => `<p><b>${time}</b><span>${day}</span></p>`).join('')}</div>`;
}

document.querySelectorAll('.class-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.class-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    renderClass(btn.dataset.class);
  });
});

document.querySelectorAll('[data-wa]').forEach(link => {
  const text = link.dataset.wa === 'schedule'
    ? 'Olá! Gostaria de confirmar os horários das turmas de Jiu-Jitsu.'
    : 'Olá! Gostaria de saber mais sobre as aulas da Eduardo Fitaroni Jiu-Jitsu.';
  link.href = wa(text);
  link.target = '_blank';
  link.rel = 'noreferrer';
});

document.querySelectorAll('[data-interest]').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.interest;
    const text = classes[key]?.message || 'Olá! Gostaria de saber mais sobre as aulas da Eduardo Fitaroni Jiu-Jitsu.';
    window.open(wa(text), '_blank', 'noopener,noreferrer');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
renderClass('baby');