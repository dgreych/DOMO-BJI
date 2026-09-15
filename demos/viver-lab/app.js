const WHATSAPP='https://wa.me/5522999926600';
const form=document.querySelector('#exam-form');
const input=document.querySelector('#exam-input');
const preview=document.querySelector('[data-preview]');
const title=document.querySelector('[data-intent-title]');
const clearButton=document.querySelector('.clear-field');
const header=document.querySelector('[data-header]');
const intents={pedido:{title:'Tenho um pedido médico',placeholder:'Ex.: tenho um pedido com alguns exames...',lead:'Olá! Tenho um pedido médico e gostaria de orientação da Viver Lab.'},exame:{title:'Consultar um exame',placeholder:'Ex.: TSH, glicose, hemograma...',lead:'Olá! Gostaria de consultar um exame na Viver Lab.'},preparo:{title:'Saber o preparo',placeholder:'Ex.: preciso saber o preparo para...',lead:'Olá! Gostaria de confirmar o preparo para um exame na Viver Lab.'},resultado:{title:'Falar sobre resultado',placeholder:'Ex.: preciso de orientação sobre meu resultado...',lead:'Olá! Gostaria de orientação sobre um resultado de exame na Viver Lab.'}};
let currentIntent='exame';
function selectedCity(){return form?.querySelector('input[name="city"]:checked')?.value||'São José do Calçado'}
function buildMessage(){const base=intents[currentIntent].lead;const detail=input?.value.trim();const city=selectedCity();const pieces=[base];if(detail)pieces.push(`Assunto: ${detail}.`);pieces.push(`Minha cidade de preferência é ${city}.`);if(currentIntent==='pedido')pieces.push('Posso enviar uma foto do pedido por aqui?');return pieces.join(' ')}
function updatePreview(){if(!preview)return;preview.textContent=buildMessage();if(clearButton)clearButton.hidden=!input?.value}
function setIntent(intent,shouldScroll=true){if(!intents[intent])return;currentIntent=intent;if(title)title.textContent=intents[intent].title;if(input)input.placeholder=intents[intent].placeholder;document.querySelectorAll('[data-intent]').forEach(el=>el.classList.toggle('is-selected',el.dataset.intent===intent));updatePreview();if(shouldScroll)document.querySelector('#pedido')?.scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('[data-intent]').forEach(button=>button.addEventListener('click',()=>setIntent(button.dataset.intent)));
document.querySelectorAll('[data-city-action]').forEach(button=>button.addEventListener('click',()=>{const city=button.dataset.cityAction;const radio=[...document.querySelectorAll('input[name="city"]')].find(el=>el.value===city);if(radio)radio.checked=true;updatePreview();document.querySelector('#pedido')?.scrollIntoView({behavior:'smooth',block:'start'})}));
form?.querySelectorAll('input[name="city"]').forEach(radio=>radio.addEventListener('change',updatePreview));
input?.addEventListener('input',updatePreview);
clearButton?.addEventListener('click',()=>{input.value='';input.focus();updatePreview()});
form?.addEventListener('submit',event=>{event.preventDefault();const message=buildMessage();const url=`${WHATSAPP}?text=${encodeURIComponent(message)}`;window.open(url,'_blank','noopener,noreferrer')});
window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',window.scrollY>20),{passive:true});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-visible');observer.unobserve(entry.target)})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'))}
setIntent('exame',false);updatePreview();
