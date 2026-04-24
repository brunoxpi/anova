/* ═══════════════════════════════════════════════════════
   ORQUESTRADOR · WhatsApp Conversation Motion
   Uma conversa completa que avança dentro de um único phone.
   Loop infinito com fade e restart.
   ═══════════════════════════════════════════════════════ */

(function(){
  'use strict';

  const phone = document.getElementById('wa-phone');
  if(!phone) return;

  const chat = phone.querySelector('.wa-chat');
  const header = phone.querySelector('.wa-header-slot');

  // ─── Header states ───
  const HEADER_11 = `
    <div class="wa-ava">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#0A0A0A"/>
        <text x="12" y="15.5" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="7" font-weight="700" fill="#fff" letter-spacing=".5">ANOVA</text>
      </svg>
    </div>
    <div>
      <div class="wa-name">Anova Investimentos</div>
      <div class="wa-status">online</div>
    </div>`;

  const HEADER_GRP = `
    <div class="wa-gi">👥</div>
    <div>
      <div class="wa-name">Seguro de Vida · Bruno</div>
      <div class="wa-status">4 participantes</div>
    </div>`;

  function setHeader(which, isGroup){
    header.innerHTML = which;
    const h = phone.querySelector('.wa-header-slot');
    h.className = 'wa-header-slot ' + (isGroup ? 'wa-gh' : 'wa-header');
  }

  // ─── Timeline ───
  // Each step: { delay (ms before), action (fn), scroll (auto scroll after) }
  const steps = [
    // ─── 1. User types "acesso" ───
    { delay: 600, html: `<div class="wa-bubble out">acesso<div class="time">10:30</div></div>` },
    { delay: 700, html: `<div class="wa-typing"><span></span><span></span><span></span></div>`, key:'t1' },
    { delay: 1200, remove:'t1', html: `
      <div class="wa-bubble in"><strong>Confirmar acesso</strong><br>Para segurança dos dados, confirme sua identidade.
        <div class="wa-btns"><div class="wa-btn active">🔐 Confirmar Acesso</div></div>
        <div class="time">10:30</div>
      </div>`},

    // ─── 2. Flow: CPF ───
    { delay: 900, html: `
      <div class="wa-flow" data-step="flow">
        <div class="wf-head"><span>Confirmação de identidade</span><span class="x">✕</span></div>
        <div class="wf-bar"><div class="wf-bar-fill" style="width:66%;background:#00A884"></div></div>
        <div class="wf-body" style="text-align:center;padding:10px 14px 8px">
          <div style="font-size:30px;margin-bottom:6px">🛡️</div>
          <div style="font-size:11.5px;color:#555;text-align:left;margin-bottom:7px">Digite os 4 primeiros números do CPF.</div>
          <div class="wf-input" style="letter-spacing:6px;font-size:14px" data-cpf>••••</div>
        </div>
        <div class="wf-foot"><button class="wf-submit">Confirmar</button></div>
        <div class="wf-brand">Gerenciada por Anova Investimentos. <span style="color:#00A884">Saiba mais</span></div>
      </div>`},
    { delay: 1100, fn(){
      const el = chat.querySelector('[data-cpf]');
      if(!el) return;
      const digits = ['1','2','3','4'];
      let i = 0;
      const int = setInterval(()=>{
        if(i >= 4){ clearInterval(int); return; }
        el.textContent = digits.slice(0, i+1).join('') + '••••'.slice(i+1);
        i++;
      }, 180);
    }},
    { delay: 1000, fn(){
      const flow = chat.querySelector('[data-step="flow"]');
      if(!flow) return;
      flow.querySelector('.wf-submit').style.background = '#007A64';
      flow.querySelector('.wf-submit').textContent = '✓ Confirmado';
    }},

    // ─── 3. Painel de comissões (panel bubble) ───
    { delay: 900, html: `
      <div class="wa-bubble in" style="max-width:94%">
        <div class="panel-header"><span>📊</span> Painel de comissões</div>
        <div class="panel-section-title"><span>💰</span> Por produto</div>
        <div class="panel-line">• Proteção e Benefícios</div>
        <div class="panel-line">• Crédito Pessoal</div>
        <div class="panel-line">• Imobiliário</div>
        <div class="panel-line">• Consórcio</div>
        <div class="panel-line">• Veículos</div>
        <hr class="panel-divider">
        <div style="font-size:10.5px;color:#667781;margin-top:3px">Escolha um produto para iniciar:</div>
        <div class="time">10:31</div>
      </div>`},

    // ─── 4. Product carousel ───
    { delay: 700, html: `
      <div style="padding:2px 0">
        <div class="wa-carousel">
          <div class="cc"><div class="cc-img" style="background:#e8e8e8;display:flex;align-items:center;justify-content:center;font-size:28px">🛡️</div><div class="cc-body"><div class="cc-desc">Seguros e proteção financeira.</div></div><div class="cc-btn">↗ Proteção</div></div>
          <div class="cc"><div class="cc-img" style="background:#1a1a1a;display:flex;align-items:center;justify-content:center;font-size:28px">💰</div><div class="cc-body"><div class="cc-desc">Crédito rápido e alinhado.</div></div><div class="cc-btn">↗ Crédito</div></div>
          <div class="cc"><div class="cc-img" style="background:#d8d4cc;display:flex;align-items:center;justify-content:center;font-size:28px">🏠</div><div class="cc-body"><div class="cc-desc">Financiamento imobiliário.</div></div><div class="cc-btn">↗ Imobiliário</div></div>
          <div class="cc"><div class="cc-img" style="background:#c8c4be;display:flex;align-items:center;justify-content:center;font-size:28px">🚗</div><div class="cc-body"><div class="cc-desc">Financiamento veicular.</div></div><div class="cc-btn">↗ Veículos</div></div>
        </div>
      </div>`},

    // ─── 5. User picks Proteção ───
    { delay: 1500, html: `<div class="wa-bubble out">🛡️ Proteção<div class="time">10:32</div></div>` },
    { delay: 700, html: `
      <div class="wa-bubble in">Você selecionou <strong>🛡️ Proteção e Benefício</strong><br><br>Escolha o tipo:<div class="time">10:32</div></div>`},

    // ─── 6. Proteção sub-carousel ───
    { delay: 500, html: `
      <div style="padding:2px 0">
        <div class="wa-carousel">
          <div class="cc"><div class="cc-img" style="background:#0a0a0a;display:flex;align-items:center;justify-content:center;font-size:24px">🛡️</div><div class="cc-body"><div class="cc-desc">Cobertura em vida e em caso de morte.</div></div><div class="cc-btn">↗ Seguro de Vida</div></div>
          <div class="cc"><div class="cc-img" style="background:#e8e8e8;display:flex;align-items:center;justify-content:center;font-size:24px">🏥</div><div class="cc-body"><div class="cc-desc">Acesso a planos de saúde com rede credenciada.</div></div><div class="cc-btn">↗ Plano de Saúde</div></div>
        </div>
      </div>`},

    // ─── 7. Proposta enviada ───
    { delay: 1600, html: `
      <div class="wa-bubble in">✅ <strong>Proposta enviada com sucesso!</strong><br><br>Clique em participar do grupo para dar continuidade.
        <div style="margin-top:5px"><div class="wa-link">https://chat.whatsapp.com/JIPo1Yi...</div></div>
        <div class="wa-link-btn">👥 Participar do grupo</div>
        <div class="time">10:34</div>
      </div>`},
    { delay: 800, html: `<div class="wa-bubble out">Obrigado!<div class="time">10:35</div></div>` },

    // ─── 8. Transition to group ───
    { delay: 1500, fn(){
      // Fade chat out, swap header
      chat.style.transition = 'opacity .4s';
      chat.style.opacity = '0';
    }},
    { delay: 500, fn(){
      setHeader(HEADER_GRP, true);
      chat.innerHTML = '';
      chat.style.opacity = '1';
    }},

    // ─── 9. Group invite screen ───
    { delay: 500, html: `<div class="gsys">qui., 12 de mar.</div>`},
    { delay: 300, html: `<div class="gmeta">Anova Investimentos usa um serviço seguro da Meta para gerenciar esta conversa.</div>`},
    { delay: 400, html: `
      <div class="ginvite">
        <div class="ginvite-ico">
          <svg viewBox="0 0 24 24" fill="#E91E63">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
        <h4>Você entrou usando um link de convite</h4>
        <div class="sub">Grupo criado automaticamente pelo Orquestrador</div>
        <div class="desc">Atendimento Seguro de Vida · Bruno</div>
        <div class="tag">🏷️ 4 participantes: você, cliente, especialista e Orquestrador</div>
      </div>`},

    // ─── 10. Hold, then restart ───
    { delay: 4500, fn(){ restart(); } }
  ];

  // ─── Engine ───
  let tid = null;
  let running = false;

  function scrollDown(){
    requestAnimationFrame(()=>{
      chat.scrollTop = chat.scrollHeight;
    });
  }

  function runStep(i){
    if(i >= steps.length) return;
    const s = steps[i];
    tid = setTimeout(()=>{
      if(s.remove){
        const el = chat.querySelector(`[data-key="${s.remove}"]`);
        if(el) el.remove();
      }
      if(s.html){
        const tpl = document.createElement('div');
        tpl.innerHTML = s.html.trim();
        const node = tpl.firstElementChild;
        if(s.key) node.setAttribute('data-key', s.key);
        chat.appendChild(node);
        scrollDown();
      }
      if(typeof s.fn === 'function'){
        s.fn();
        scrollDown();
      }
      runStep(i+1);
    }, s.delay);
  }

  function restart(){
    chat.style.transition = 'opacity .5s';
    chat.style.opacity = '0';
    setTimeout(()=>{
      chat.innerHTML = '';
      setHeader(HEADER_11, false);
      chat.style.opacity = '1';
      runStep(0);
    }, 600);
  }

  function start(){
    if(running) return;
    running = true;
    setHeader(HEADER_11, false);
    runStep(0);
  }

  // Start on intersection (only when visible)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !running){
        start();
      }
    });
  }, { threshold: .3 });
  io.observe(phone);

})();
