/* ─────────────────────────────────────────────────────────
   ANOVA SHELL
   Injeta partials (nav, footer), marca página ativa,
   gerencia toggle mobile.
   ───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const navMount = document.getElementById('anova-nav');
  const footerMount = document.getElementById('anova-footer');
  const ctaMount = document.getElementById('anova-cta-form');
  const currentPage = document.body.dataset.page || 'home';

  async function injectPartial(url, mount) {
    if (!mount) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      mount.innerHTML = await res.text();
    } catch (err) {
      console.error('[anova-shell] failed to load', url, err);
      mount.innerHTML = `<p style="padding:16px;color:#888;font-family:monospace;font-size:12px;">Falha ao carregar ${url}. Rode via servidor local.</p>`;
    }
  }

  function markActivePage() {
    const links = document.querySelectorAll('[data-nav]');
    links.forEach(link => {
      if (link.dataset.nav === currentPage) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function wireMobileToggle() {
    const nav = document.querySelector('.anova-nav');
    if (!nav) return;
    const toggle = nav.querySelector('.anova-nav-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !nav.classList.contains('mobile-open');
      nav.classList.toggle('mobile-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '×' : '☰';
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
    // Fecha ao clicar em link
    nav.querySelectorAll('.anova-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  function wireCtaForm() {
    if (!ctaMount) return;
    const form = ctaMount.querySelector('form.anova-cta-form');
    if (!form) return;

    // Pré-seleciona produto via data-product="..."
    const product = ctaMount.dataset.product;
    if (product) {
      const sel = form.querySelector('select[name="produto"]');
      if (sel) {
        const opt = [...sel.options].find(o => o.value === product);
        if (opt) sel.value = product;
      }
    }

    // Tema claro opcional via data-theme="light"
    if (ctaMount.dataset.theme === 'light') {
      form.classList.add('is-light');
    }

    // Handler de submit (stub — exibe estado "enviado")
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      const btn = form.querySelector('.acf-submit');
      const label = btn.querySelector('.acf-submit-label');
      btn.classList.add('is-sending');
      btn.disabled = true;
      label.textContent = 'Enviando...';

      // TODO: integrar com endpoint real (HubSpot, RD Station, e-mail, etc.)
      // Por enquanto, simula sucesso.
      setTimeout(() => {
        btn.classList.remove('is-sending');
        btn.classList.add('is-sent');
        label.textContent = '✓ Recebemos. Falamos em até 1 dia útil.';
      }, 600);
    });
  }

  async function init() {
    await Promise.all([
      injectPartial('partials/nav.html', navMount),
      injectPartial('partials/footer.html', footerMount),
      injectPartial('partials/cta-form.html', ctaMount),
    ]);
    markActivePage();
    wireMobileToggle();
    wireCtaForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
