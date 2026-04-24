// ═══════════════════════════════════════════════════════
// ANOVA Landing Page — scripts.js
// ═══════════════════════════════════════════════════════

// Scroll progress
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
});

// Hero blueprint canvas
(function(){
  const cv = document.getElementById('hero-canvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let mx = 0, my = 0;
  function resize(){
    const w = cv.parentElement.offsetWidth, h = cv.parentElement.offsetHeight;
    cv.width = w*dpr; cv.height = h*dpr;
    cv.style.width = w+'px'; cv.style.height = h+'px';
  }
  resize();
  window.addEventListener('resize', resize);
  
  cv.parentElement.addEventListener('mousemove', e => {
    const r = cv.parentElement.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  let animMx = 0, animMy = 0;
  function draw(){
    animMx += (mx - animMx) * .04;
    animMy += (my - animMy) * .04;
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const w = cv.offsetWidth, h = cv.offsetHeight;
    const fx = w*.35 + (animMx - w*.5)*.02;
    const fy = h*.5 + (animMy - h*.5)*.02;
    
    // grid
    for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.strokeStyle='rgba(0,0,0,.022)';ctx.lineWidth=.5;ctx.stroke();}
    for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.strokeStyle='rgba(0,0,0,.022)';ctx.lineWidth=.5;ctx.stroke();}
    // radial lines
    for(let i=0;i<20;i++){
      const a=(i/20)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+Math.cos(a)*Math.max(w,h),fy+Math.sin(a)*Math.max(w,h));
      ctx.strokeStyle='rgba(0,0,0,.012)';ctx.lineWidth=.5;ctx.stroke();
    }
    // rings
    for(let r=60;r<Math.max(w,h);r+=60){
      ctx.beginPath();ctx.arc(fx,fy,r,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,0,0,.015)';ctx.lineWidth=.5;ctx.stroke();
    }
    // crosshair
    ctx.beginPath();ctx.moveTo(fx-20,fy);ctx.lineTo(fx+20,fy);ctx.moveTo(fx,fy-20);ctx.lineTo(fx,fy+20);
    ctx.strokeStyle='rgba(0,0,0,.06)';ctx.lineWidth=1;ctx.stroke();
    
    requestAnimationFrame(draw);
  }
  draw();
})();

// Scroll reveals
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => io.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if(id === '#') return;
    const target = document.querySelector(id);
    if(target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 20 ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.04)';
});

// Tweaks
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"blueprint":true,"heroVersion":"A"}/*EDITMODE-END*/;
let tweakState = {...TWEAK_DEFAULTS};

window.addEventListener('message', e => {
  if(e.data?.type === '__activate_edit_mode') document.getElementById('tweaks-panel')?.classList.add('visible');
  if(e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel')?.classList.remove('visible');
});
window.parent.postMessage({type:'__edit_mode_available'},'*');

function applyTweaks(){
  const canvas = document.getElementById('hero-canvas');
  if(canvas) canvas.style.display = tweakState.blueprint ? '' : 'none';
  
  // Hero versions
  const heroH1 = document.getElementById('hero-h1');
  const heroSub = document.getElementById('hero-sub');
  if(heroH1 && heroSub) {
    const versions = {
      A: {
        h1: 'Chega de operação financeira <strong>espalhada.</strong>',
        sub: 'A Anova conecta WhatsApp, operação, backoffice e governança em um único fluxo conversacional.'
      },
      B: {
        h1: 'O cliente conversa. <strong>A operação acontece.</strong>',
        sub: 'A Anova transforma atendimento, pendência, execução e acompanhamento em um sistema contínuo.'
      },
      C: {
        h1: 'A distribuição financeira, finalmente, <strong>em um só fluxo.</strong>',
        sub: 'Menos sistemas soltos. Mais contexto, continuidade e controle real.'
      },
      main: {
        h1: 'Chega de operação financeira quebrada entre WhatsApp, CRM, banco, <strong>mesa e backoffice.</strong>',
        sub: 'A Anova conecta <strong>originação, relacionamento, operação e governança</strong> em um único fluxo conversacional, para que profissionais e instituições cresçam com <strong>mais receita, menos fricção operacional e controle real</strong>.'
      }
    };
    const v = versions[tweakState.heroVersion] || versions.main;
    heroH1.innerHTML = v.h1;
    heroSub.innerHTML = v.sub;
  }
}

function setupTweaks() {
  // Blueprint toggle
  const bpToggle = document.getElementById('t-blueprint');
  if(bpToggle) {
    bpToggle.addEventListener('click', () => {
      tweakState.blueprint = !tweakState.blueprint;
      bpToggle.classList.toggle('on', tweakState.blueprint);
      applyTweaks();
      window.parent.postMessage({type:'__edit_mode_set_keys', edits: tweakState},'*');
    });
  }
  
  // Hero version radios
  document.querySelectorAll('input[name="hero-version"]').forEach(radio => {
    radio.addEventListener('change', () => {
      tweakState.heroVersion = radio.value;
      applyTweaks();
      window.parent.postMessage({type:'__edit_mode_set_keys', edits: tweakState},'*');
    });
  });
}

setupTweaks();
applyTweaks();
