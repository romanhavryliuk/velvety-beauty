// main.js — menu behavior for header
// - page submenu toggles (second-menu .btn-page-list)
// - mobile slide-out menu toggles (burger / mobile-close)

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Page submenu (existing second-menu) ----------
  const submenuButtons = document.querySelectorAll('.btn-page-list');

  const makeId = (prefix = 'submenu') =>
    `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll('.second-menu-item.open').forEach(item => {
      if (item === except) return;
      item.classList.remove('open');
      const btn = item.querySelector('.btn-page-list');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const sub = item.querySelector('.page-submenu');
      if (sub) sub.hidden = true;
    });
  };

  submenuButtons.forEach(button => {
    const menuItem = button.closest('.second-menu-item');
    if (!menuItem) return;

    let submenu = menuItem.querySelector('.page-submenu');
    if (submenu && !submenu.id) submenu.id = makeId('page-submenu');
    if (submenu) button.setAttribute('aria-controls', submenu.id);

    const isOpenInit = menuItem.classList.contains('open');
    button.setAttribute('aria-expanded', String(isOpenInit));
    if (submenu) submenu.hidden = !isOpenInit;

    button.addEventListener('click', evt => {
      evt.stopPropagation();
      const isOpen = menuItem.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      if (submenu) submenu.hidden = !isOpen;
      if (isOpen) closeAllSubmenus(menuItem);
    });
  });

  // Close submenus when clicking outside or pressing Escape
  document.addEventListener('click', evt => {
    if (!evt.target.closest('.second-menu')) closeAllSubmenus();
  });
  document.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') closeAllSubmenus();
  });

  // ---------- Mobile slide-out menu (burger) ----------
  const burger = document.querySelector('.burger');
  const bigMenu = document.querySelector('.big-container-open-menu');
  const mobileCloseBtns = document.querySelectorAll('.mobile-close');

  if (burger && bigMenu) {
    // ensure accessible attribute
    burger.setAttribute(
      'aria-expanded',
      burger.getAttribute('aria-expanded') || 'false'
    );

    const openMenu = open => {
      bigMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      // prevent background scroll when menu is open
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', evt => {
      evt.stopPropagation();
      const isOpen = bigMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileCloseBtns.forEach(btn =>
      btn.addEventListener('click', evt => {
        evt.stopPropagation();
        openMenu(false);
      })
    );

    // clicking outside the big menu closes it
    document.addEventListener('click', evt => {
      if (
        bigMenu.classList.contains('open') &&
        !evt.target.closest('.big-container-open-menu') &&
        !evt.target.closest('.burger')
      ) {
        openMenu(false);
      }
    });

    // Escape closes the big menu too
    document.addEventListener('keydown', evt => {
      if (evt.key === 'Escape' && bigMenu.classList.contains('open'))
        openMenu(false);
    });
  }
});
