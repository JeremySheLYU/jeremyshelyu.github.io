(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  function closeMenu(restoreFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu +';
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close −' : 'Menu +';
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const filters = [...document.querySelectorAll('.filter-btn')];
  const publications = [...document.querySelectorAll('.pub-item')];
  const resultCount = document.querySelector('#result-count');
  function filterPublications(category) {
    let count = 0;
    publications.forEach(item => {
      const visible = category === 'all' || item.dataset.category === category;
      item.hidden = !visible;
      if (visible) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    resultCount.textContent = `${count} ${count === 1 ? 'work' : 'works'}`;
  }
  filters.forEach(button => button.addEventListener('click', () => filterPublications(button.dataset.filter)));
  filterPublications('journal');

  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibleSections.set(entry.target.id, entry));
      const visible = [...visibleSections.values()].filter(entry => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!visible) return;
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-100px 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
  }
})();
