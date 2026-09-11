const WA='5522998217560';
const messages={
  geral:'Olá! Vim pelo site da Beleza Leal e gostaria de falar com a equipe.',
  emagrecimento:'Olá! Vim pelo site da Beleza Leal e gostaria de entender como funciona o acompanhamento de emagrecimento.',
  metodo:'Olá! Vim pelo site da Beleza Leal e quero conhecer melhor o Método BL.',
  mounjaro:'Olá! Vim pelo site da Beleza Leal. Já uso Mounjaro por conta própria e quero entender como funciona o acompanhamento e quais cuidados preciso observar.',
  linha:'Olá! Vim pelo site da Beleza Leal e gostaria de conhecer melhor a Linha BL.'
};
function openWa(kind='geral'){window.open(`https://wa.me/${WA}?text=${encodeURIComponent(messages[kind]||messages.geral)}`,'_blank','noopener')}
document.querySelectorAll('[data-wa]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openWa(el.dataset.wa||'geral')}));
const menu=document.getElementById('menu'),drawer=document.getElementById('drawer');
if(menu&&drawer){menu.addEventListener('click',()=>drawer.classList.toggle('open'));drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')))}
const form=document.getElementById('form');
if(form){form.addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('name').value.trim(),i=document.getElementById('interest').value,o=document.getElementById('note').value.trim();let text=`Olá! Meu nome é ${n}. Vim pelo site da Beleza Leal e tenho interesse em ${i}.`;if(o)text+=`\n\n${o}`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`,'_blank','noopener')})}