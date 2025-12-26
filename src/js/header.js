document.addEventListener('DOMContentLoaded', () => {
  // --- Допоміжна функція для перемикання стану (Accessibility + UI) ---
  const toggleUIElement = (button, container, forceState = null) => {
    if (!button || !container) return;

    // Якщо forceState не задано, перемикаємо на протилежний
    const isOpen =
      forceState !== null ? forceState : !container.classList.contains('open');

    container.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));

    // Якщо це підменю з атрибутом hidden
    if (
      container.hasAttribute('hidden') ||
      container.classList.contains('page-submenu-container')
    ) {
      container.hidden = !isOpen;
    }
  };

  // ---------- 1. Desktop PAGES menu ----------
  const desktopPageButton = document.querySelector('#page-toggle');
  const desktopPageContainer = document.querySelector('.page-second-container');
  const desktopPageItem = document.querySelector('.page');

  if (desktopPageButton && desktopPageContainer) {
    desktopPageButton.addEventListener('click', e => {
      e.stopPropagation();
      toggleUIElement(desktopPageButton, desktopPageContainer);
    });

    // Закриття при кліку поза меню або Escape
    document.addEventListener('click', e => {
      if (desktopPageItem && !desktopPageItem.contains(e.target)) {
        toggleUIElement(desktopPageButton, desktopPageContainer, false);
      }
    });
  }

  // ---------- 2. Mobile Burger Menu ----------
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.big-container-open-menu');
  const mobileCloseBtns = document.querySelectorAll('.mobile-close');

  const handleMobileMenu = open => {
    toggleUIElement(burger, mobileMenu, open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : ''; // Блокуємо скрол фону

    if (open) {
      mobileMenu.querySelector('a, button, .mobile-close')?.focus();
    } else {
      burger.focus();
    }
  };

  if (burger && mobileMenu) {
    burger.addEventListener('click', e => {
      e.stopPropagation();
      const isNowOpen = !mobileMenu.classList.contains('open');
      handleMobileMenu(isNowOpen);
    });

    mobileCloseBtns.forEach(btn =>
      btn.addEventListener('click', () => handleMobileMenu(false))
    );
  }

  // ---------- 3. Submenus (Вкладені меню) ----------
  const submenuButtons = document.querySelectorAll('.btn-page-list');

  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll('.second-menu-item.open').forEach(item => {
      if (item === except) return;
      const btn = item.querySelector('.btn-page-list');
      const sub = item.querySelector('.page-submenu-container');
      item.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (sub) sub.hidden = true;
    });
  };

  submenuButtons.forEach(button => {
    const menuItem = button.closest('.second-menu-item');
    const submenu = menuItem?.querySelector('.page-submenu-container');

    if (!submenu) return;

    button.addEventListener('click', e => {
      e.stopPropagation();
      const isOpening = submenu.hidden;

      if (isOpening) closeAllSubmenus(menuItem);

      toggleUIElement(button, menuItem, isOpening);
      submenu.hidden = !isOpening;
    });
  });

  // ---------- Загальні обробники (Escape) ----------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (desktopPageContainer)
        toggleUIElement(desktopPageButton, desktopPageContainer, false);
      if (mobileMenu?.classList.contains('open')) handleMobileMenu(false);
      closeAllSubmenus();
    }
  });
});
