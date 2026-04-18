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
      if (highlight && ul) {
        const ulRect = ul.getBoundingClientRect();
        const aRect = a.getBoundingClientRect();
        highlight.style.left = (aRect.left - ulRect.left) + 'px';
        highlight.style.width = aRect.width + 'px';
      }
    }
  });

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
});