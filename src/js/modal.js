(() => {
  const refs = {
    // Додати атрибут data-modal-open на кнопку відкриття
    openModalBtn: document.querySelector('[data-mobile-open]'),
    // Додати атрибут data-modal-close на кнопку закриття
    closeModalBtn: document.querySelector('[data-mobile-close]'),
    // Додати атрибут data-modal на бекдроп модалки
    modal: document.querySelector('[data-mobile]'),
    // Додаємо body для керування скролом
    body: document.body,
  };

  if (!refs.modal) return;

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);

  function toggleModal() {
    // is-open це клас який буде додаватися/забиратися на бекдроп при натисканні на кнопки
    refs.modal.classList.toggle('is-open');
    // Перевіряємо чи є клас is-open на бекдропі
    const isOpen = refs.modal.classList.contains('is-open');
    // Забираємо скрол коли модалка відкрита
    refs.body.classList.toggle('no-scroll', isOpen);
  }
  // Закриваємо модалку при натисканні на Escape
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && refs.modal.classList.contains('is-open')) {
      toggleModal();
    }
  });

  refs.modal.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    //Закриває модалку та переносить до відпопідної секції при натискані на лінк
    if (link.getAttribute('href')?.startsWith('#')) {
      toggleModal();
    }
  });
})();
