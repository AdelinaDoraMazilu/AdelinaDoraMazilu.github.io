// ── NAVBAR INJECT ──
const navHTML = `
  <nav class="site-nav">
    <a class="nav-brand" href="/index.html">Adelina Mazilu</a>
    <ul>
      <div class="nav-highlight" id="navHighlight"></div>
      <li><a href="/index.html">Home</a></li>
      <li><a href="/projects/">Projects</a></li>
      <li><a href="/cv/">CV</a></li>
      <li><a href="/resources/">Resources</a></li>
      <li><a href="/blog/">Blog</a></li>
      <li><a href="/ttdil/">Things to do in life</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <label class="theme-toggle" title="Toggle light/dark mode">
      <input type="checkbox" id="theme-toggle-cb">
      <div class="theme-toggle-track" id="theme-track">
        <div class="theme-toggle-thumb"></div>
      </div>
    </label>
  </nav>

  <div class="nav-mobile-menu" id="navMobileMenu">
    <div class="nav-mobile-links">
      <a href="/index.html">Home</a>
      <a href="/projects/">Projects</a>
      <a href="/cv/">CV</a>
      <a href="/resources/">Resources</a>
      <a href="/blog/">Blog</a>
      <a href="/ttdil/">Things to do in life</a>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('afterbegin', navHTML);


document.addEventListener('DOMContentLoaded', () => {

  // ── NAV HIGHLIGHT ──
  const links     = document.querySelectorAll('.site-nav a:not(.nav-brand)');
  const highlight = document.getElementById('navHighlight');
  const ul        = document.querySelector('.site-nav ul');

  links.forEach(a => {
    const path    = new URL(a.href).pathname;
    const here    = location.pathname;
    const isHome  = (here === '/' || here === '/index.html') && a.getAttribute('href') === '/index.html';
    const isMatch = here.startsWith(path) && a.getAttribute('href') !== '/index.html';

    if (isHome || isMatch) {
      a.classList.add('active');
      if (highlight && ul) {
        const ulRect = ul.getBoundingClientRect();
        const aRect  = a.getBoundingClientRect();
        highlight.style.left  = (aRect.left - ulRect.left) + 'px';
        highlight.style.width = aRect.width + 'px';
      }
    }
  });

  // ── MOBILE NAV HIGHLIGHT ──
  const mobileLinks = document.querySelectorAll('.nav-mobile-links a');

  mobileLinks.forEach(a => {
    const path    = new URL(a.href).pathname;
    const here    = location.pathname;
    const isHome  = (here === '/' || here === '/index.html') && a.getAttribute('href') === '/index.html';
    const isMatch = here.startsWith(path) && a.getAttribute('href') !== '/index.html';
    if (isHome || isMatch) a.classList.add('active');
  });

  // ── HAMBURGER MENU ──
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');

  if (hamburger) hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // ── THEME TOGGLE ──
  (function () {
    const html   = document.documentElement;
    const cbs    = [document.getElementById('theme-toggle-cb')];
    const tracks = [document.getElementById('theme-track')];

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

});