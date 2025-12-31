import Swiper from 'swiper';
import 'swiper/css';

const filterSwiper = new Swiper('.products-filters', {
    slidesPerView: 'auto', // Кнопки будуть мати свою природну ширину
    spaceBetween: 12,      // Відступ між кнопками
    freeMode: true,        // Дозволяє вільно гортати, а не тільки по одному слайду
    slidesOffsetBefore: 0, 
    slidesOffsetAfter: 20, // Невеликий відступ в кінці, щоб остання кнопка не прилипала
    grabCursor: true,
    breakpoints: {
        1440: {
            enabled: false, // Вимикає слайдер, перетворюючи його на звичайний div
        }
    }
    
});

const filterButtons = document.querySelectorAll('.swiper-slide');

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    // 1. Видаляємо клас активності у всіх кнопок
    filterButtons.forEach(btn => btn.classList.remove('btn-item-active'));
    
    // 2. Додаємо клас активності саме тій кнопці, на яку натиснули
    this.classList.add('btn-item-active');
    
    // 3. (Опціонально) Центрування кнопки при кліку:
    filterSwiper.slideTo(Array.from(filterButtons).indexOf(this));
  });
});