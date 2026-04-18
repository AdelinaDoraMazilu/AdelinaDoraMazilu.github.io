  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.site-nav a:not(.nav-brand)');
    const highlight = document.getElementById('navHighlight');
    const ul = document.querySelector('.site-nav ul');
    links.forEach(a => {
      const path = new URL(a.href).pathname;
      const here = location.pathname;
      const isHome = (here === '/' || here === '/index.html') && a.getAttribute('href') === '/index.html';
      const isMatch = here.startsWith(path) && a.getAttribute('href') !== '/index.html';
      if (isHome || isMatch) {
        a.classList.add('active');
        const ulRect = ul.getBoundingClientRect();
        const aRect = a.getBoundingClientRect();
        highlight.style.left = (aRect.left - ulRect.left) + 'px';
        highlight.style.width = aRect.width + 'px';
      }
    });
  });


      // ── THEME TOGGLE ──
  (function () {
      const html   = document.documentElement;
      const cbs    = [document.getElementById('theme-toggle-cb'), document.getElementById('theme-toggle-cb-mobile')];
      const tracks = [document.getElementById('theme-track'), document.getElementById('theme-track-mobile')];

      if (localStorage.getItem('theme') === 'light') applyLight(true);

      cbs.forEach(cb => {
        if (cb) cb.addEventListener('change', () => applyLight(cb.checked));
      });

      function applyLight(isLight) {
        html.setAttribute('data-theme', isLight ? 'light' : 'dark');
        cbs.forEach(cb     => { if (cb)    cb.checked = isLight; });
        tracks.forEach(track => { if (track) track.classList.toggle('checked', isLight); });
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      }
    })();


      // also highlight active in mobile menu
  const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
  mobileLinks.forEach(a => {
    const path = new URL(a.href).pathname;
    const here = location.pathname;
    const isHome = (here === '/' || here === '/index.html') && a.getAttribute('href') === '/index.html';
    const isMatch = here.startsWith(path) && a.getAttribute('href') !== '/index.html';
    if (isHome || isMatch) a.classList.add('active');
  });

  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');
  const closeBtn = document.getElementById('navMobileClose');

if (hamburger) hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
});
if (closeBtn) closeBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
});

