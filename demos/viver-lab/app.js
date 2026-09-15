const header=document.querySelector('[data-header]');
const menu=document.querySelector('.nav');
const toggle=document.querySelector('[data-menu-toggle]');

window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',window.scrollY>16),{passive:true});

toggle?.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')==='true';
  toggle.setAttribute('aria-expanded',String(!open));
  menu?.classList.toggle('is-open',!open);
});

menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  menu.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded','false');
}));
