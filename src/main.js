// Це для PAge коли натискаєш на кнопку виповзає під меню
document.addEventListener('DOMContentLoaded', function () {
  const pageButton = document.querySelector('.btn-page-list');
  const menuItem = pageButton.closest('.second-menu-item');

  pageButton.addEventListener('click', function () {
    menuItem.classList.toggle('open');
  });
});
