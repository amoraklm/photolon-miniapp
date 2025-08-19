// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile menu on navigation
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    }
  });
});

// Header shadow on scroll + toTop
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
const onScroll = ()=>{
  const y = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('scrolled', y>8);
  toTop.classList.toggle('show', y>280);
};
document.addEventListener('scroll', onScroll);
onScroll();

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', ()=>{
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Back to top
toTop.addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior:'smooth'});
});

// Accordion
document.querySelectorAll('.accordion__item').forEach(item=>{
  const btn = item.querySelector('.accordion__btn');
  const panel = item.querySelector('.accordion__panel');
  const setHeight = (open)=>{
    if(open){
      panel.style.height = panel.scrollHeight + 'px';
    }else{
      panel.style.height = '0px';
    }
  };
  setHeight(false);
  btn.addEventListener('click', ()=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // close others
    document.querySelectorAll('.accordion__btn[aria-expanded="true"]').forEach(b=>{
      if(b!==btn){ b.setAttribute('aria-expanded','false'); b.parentElement.querySelector('.accordion__panel').style.height='0px'; }
    });
    btn.setAttribute('aria-expanded', String(!expanded));
    setHeight(!expanded);
  });
  // transition end fix for dynamic height
  panel.addEventListener('transitionend', ()=>{
    if(btn.getAttribute('aria-expanded')==='true'){
      panel.style.height = 'auto';
    }
  });
});

// Lead form validation + toast
const form = document.getElementById('leadForm');
const toast = document.getElementById('toast');

function showError(id, msg){
  const el = document.querySelector(`.err[data-for="${id}"]`);
  if(el) el.textContent = msg || '';
}
function validatePhone(v){
  return /^(\+?98|0)?9\d{9}$/.test(v.replace(/\s|-/g,''));
}
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const goal = form.goal.value;

  let ok = true;
  if(name.length < 3){ showError('name', 'نام را کامل‌تر بنویس'); ok=false; } else showError('name');
  if(!validatePhone(phone)){ showError('phone', 'شماره معتبر وارد کن'); ok=false; } else showError('phone');
  if(!goal){ showError('goal', 'یکی از گزینه‌ها را انتخاب کن'); ok=false; } else showError('goal');

  if(!ok) return;

  // Simulate submit
  try{
    const lead = {name, phone, goal, ts: Date.now()};
    const leads = JSON.parse(localStorage.getItem('ftn_leads')||'[]');
    leads.push(lead);
    localStorage.setItem('ftn_leads', JSON.stringify(leads));
  }catch(_){}

  // reset and toast
  form.reset();
  toast.classList.add('toast--show');
  setTimeout(()=>toast.classList.remove('toast--show'), 2600);
});