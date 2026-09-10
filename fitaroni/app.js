const PHONE = '5522998399626';

const classes = {
  baby: {
    label: 'BABY', age: '4–6 ANOS',
    times: [['SEG · QUA', '18:30'], ['TER · QUI', '17:30']],
    message: 'Tenho interesse na turma Baby (4 a 6 anos) de Jiu-Jitsu.'
  },
  juniors: {
    label: 'JUNIORS', age: '7–10 ANOS',
    times: [['SEG · QUA', '17:30'], ['TER · QUI', '18:30']],
    message: 'Tenho interesse na turma Juniors (7 a 10 anos) de Jiu-Jitsu.'
  },
  teens: {
    label: 'TEENS', age: '11–16 ANOS',
    times: [['TER · QUI', '19:30']],
    message: 'Tenho interesse na turma Teens (11 a 16 anos) de Jiu-Jitsu.'
  }
};

const interestLabels = {
  baby: 'Baby · 4–6 anos',
  juniors: 'Juniors · 7–10 anos',
  teens: 'Teens · 11–16 anos',
  krav: 'Krav Maga',
  schedule: 'Confirmar horários do Jiu-Jitsu',
  general: 'Informações gerais'
};

const wa = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const icon = id => `<svg class="ui-icon" aria-hidden="true"><use href="#${id}"/></svg>`;

const form = document.querySelector('#interest-form');
const nameInput = document.querySelector('#lead-name');
const interestSelect = document.querySelector('#lead-interest');
const ageInput = document.querySelector('#lead-age');
const ageWrap = document.querySelector('#age-wrap');
const scheduleSelect = document.querySelector('#lead-schedule');
const scheduleWrap = document.querySelector('#schedule-wrap');

function renderClass(key) {
  const item = classes[key];
  const panel = document.querySelector('#class-panel');
  panel.innerHTML = `
    <div>
      <p class="eyebrow"><span></span>${item.age}</p>
      <h3>${item.label}</h3>
      <div class="panel-actions"><button type="button" data-class-form="${key}">FALAR SOBRE ESTA TURMA ${icon('icon-chat')}</button></div>
    </div>
    <div class="times">${item.times.map(([day,time]) => `<p><b>${time}</b><span>${day}</span></p>`).join('')}</div>`;
}

function setInterestButtonState(key) {
  document.querySelectorAll('[data-interest]').forEach(button => {
    const active = button.dataset.interest === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function syncInterestFields() {
  const key = interestSelect.value;
  const item = classes[key];
  const isClass = Boolean(item);

  ageWrap.classList.toggle('is-hidden', !isClass);
  scheduleWrap.classList.toggle('is-hidden', !isClass);

  scheduleSelect.innerHTML = '';
  if (isClass) {
    scheduleSelect.append(new Option('Quero combinar pelo WhatsApp', ''));
    item.times.forEach(([day, time]) => {
      scheduleSelect.append(new Option(`${day} · ${time}`, `${day} · ${time}`));
    });
  }

  setInterestButtonState(key);
}

function openInterestForm(key = 'general') {
  if (interestLabels[key]) interestSelect.value = key;
  syncInterestFields();
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => nameInput.focus({ preventScroll: true }), 520);
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

document.addEventListener('click', event => {
  const classAction = event.target.closest('[data-class-form]');
  if (classAction) {
    openInterestForm(classAction.dataset.classForm);
    return;
  }

  const formAction = event.target.closest('[data-form-open]');
  if (formAction) {
    event.preventDefault();
    openInterestForm(formAction.dataset.formOpen || 'general');
  }
});

document.querySelectorAll('[data-interest]').forEach(btn => {
  btn.setAttribute('aria-pressed', 'false');
  btn.addEventListener('click', () => {
    interestSelect.value = btn.dataset.interest;
    syncInterestFields();
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => nameInput.focus({ preventScroll: true }), 420);
  });
});

interestSelect.addEventListener('change', syncInterestFields);

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const name = nameInput.value.trim();
  const key = interestSelect.value;
  const age = ageInput.value.trim();
  const schedule = scheduleSelect.value;
  const lines = [`Olá! Meu nome é ${name}.`];

  if (classes[key]) {
    lines.push(classes[key].message);
    if (age) lines.push(`Idade do aluno: ${age}.`);
    if (schedule) lines.push(`Horário de interesse: ${schedule}.`);
    lines.push('Gostaria de saber mais.');
  } else if (key === 'krav') {
    lines.push('Tenho interesse em Krav Maga.');
    lines.push('Gostaria de saber mais.');
  } else if (key === 'schedule') {
    lines.push('Gostaria de confirmar os horários das turmas de Jiu-Jitsu.');
  } else {
    lines.push('Gostaria de saber mais sobre as aulas da Escola de Lutas Eduardo Fitaroni.');
  }

  window.open(wa(lines.join('\n')), '_blank', 'noopener,noreferrer');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
renderClass('baby');
syncInterestFields();