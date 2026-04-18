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