import '../styles/main.scss';
import 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';

if (process.env.NODE_ENV !== 'production') {
    require('../index.pug');
}

// Toogle Top-Menu

function classToggle() {
    const navs = document.querySelectorAll('.menu__item');
    navs.forEach(nav => nav.classList.toggle('h-toogle-nav-show'));
}
document
    .querySelector('.top-menu__toggle')
    .addEventListener('click', classToggle);
