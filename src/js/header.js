document.addEventListener('DOMContentLoaded', () => {
  // ---------- Desktop PAGES menu ----------
  const desktopPageButton = document.querySelector(
    '.header-button#page-toggle'
  );
  const desktopPageContainer = document.querySelector('.page-second-container');
  const desktopPageItem = document.querySelector('.page');

  if (desktopPageButton && desktopPageContainer) {
    // Toggle меню при кліку на кнопку
    desktopPageButton.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = desktopPageContainer.classList.contains('open');

      if (isOpen) {
        desktopPageContainer.classList.remove('open');
        desktopPageButton.setAttribute('aria-expanded', 'false');
      } else {
        desktopPageContainer.classList.add('open');
        desktopPageButton.setAttribute('aria-expanded', 'true');
      }
    });

    // Закриття при кліку поза меню
    document.addEventListener('click', e => {
      if (desktopPageItem && !desktopPageItem.contains(e.target)) {
        desktopPageContainer.classList.remove('open');
        desktopPageButton.setAttribute('aria-expanded', 'false');
      }
    });

    // Закриття при натисканні Escape
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        desktopPageContainer.classList.contains('open')
      ) {
        desktopPageContainer.classList.remove('open');
        desktopPageButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
  // ---------- Page submenu (existing second-menu) ----------
  const submenuButtons = document.querySelectorAll('.btn-page-list');

  const makeId = (prefix = 'page-submenu') =>
    `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll('.second-menu-item.open').forEach(item => {
      if (item === except) return;
      item.classList.remove('open');
      const btn = item.querySelector('.btn-page-list');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const sub = item.querySelector('.page-submenu-container, .page-submenu');
      if (sub) sub.hidden = true;
    });
  };

  submenuButtons.forEach(button => {
    // 1) спроба знайти підменю по aria-controls
    const ariaId = button.getAttribute('aria-controls');
    let submenu = ariaId ? document.getElementById(ariaId) : null;

    // 2) якщо aria-controls або ID не існує — шукаємо підменю в межах .second-menu-item
    const menuItem = button.closest('.second-menu-item');
    if (!submenu && menuItem) {
      submenu =
        menuItem.querySelector('.page-submenu-container, .page-submenu') ||
        null;
    }

    // 3) якщо підменю не знайдено — виходимо (лог для дебагу)
    if (!submenu) {
      console.warn('No submenu found for button', button);
      return;
    }

    // 4) гарантуємо унікальний id і синхронізуємо aria-controls
    if (!submenu.id) submenu.id = makeId();
    button.setAttribute('aria-controls', submenu.id);

    // 5) початковий стан (візьмемо aria-expanded якщо задано, інакше по класу)
    const isOpenInit =
      button.getAttribute('aria-expanded') === 'true' ||
      menuItem?.classList.contains('open');
    submenu.hidden = !isOpenInit;
    button.setAttribute('aria-expanded', String(isOpenInit));
    if (isOpenInit && menuItem) menuItem.classList.add('open');

    // 6) клік — toggle + закрити інші
    button.addEventListener('click', evt => {
      evt.stopPropagation();
      const willOpen = submenu.hidden; // true якщо зараз приховано -> будемо відкривати
      // закриваємо інші, тільки якщо відкриваємо цей
      if (willOpen) closeAllSubmenus(menuItem || null);

      if (menuItem) menuItem.classList.toggle('open', willOpen);
      submenu.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
    });

    // 7) клік по посиланню всередині підменю закриває його
    submenu.addEventListener('click', e => {
      if (e.target.closest('a')) {
        submenu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        if (menuItem) menuItem.classList.remove('open');
      }
    });
  });

  // Закрити всі при кліку поза .second-menu або при Escape
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
    // ensure big menu aria-hidden reflects initial open state
    bigMenu.setAttribute(
      'aria-hidden',
      bigMenu.classList.contains('open') ? 'false' : 'true'
    );

    const openMenu = open => {
      bigMenu.classList.toggle('open', open);
      // sync aria-hidden: when open -> false (not hidden), when closed -> true
      bigMenu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
      // prevent background scroll when menu is open
      document.body.style.overflow = open ? 'hidden' : '';
      // move focus when opening
      if (open) {
        const first = bigMenu.querySelector(
          '.mobile-close, .btn-page-list, a, button'
        );
        first?.focus();
      } else {
        burger.focus();
      }
    };

    burger.addEventListener('click', evt => {
      evt.stopPropagation();
      const isOpen = bigMenu.classList.toggle('open');
      // sync aria-hidden and aria-expanded
      bigMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) {
        const first = bigMenu.querySelector(
          '.mobile-close, .btn-page-list, a, button'
        );
        first?.focus();
      } else {
        burger.focus();
      }
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
