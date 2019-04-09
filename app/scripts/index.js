import '../styles/main.scss';
import 'bootstrap';

import '@fortawesome/fontawesome-free/js/all';

if (process.env.NODE_ENV !== 'production') {
    require('../index.pug');
    require('../detail.pug');
    require('../product-list.pug');
    require('../product-list-default.pug');
    require('../cart.pug');
    require('../about.pug');
    require('../blog.pug');
    require('../blog-detail.pug');
    require('../login.pug');
    require('../register.pug');
    require('../order.pug');
    require('../contact.pug');
}

// Toogle Top-Menu

function classToggle() {
    const navs = document.querySelectorAll('.menu__item');
    navs.forEach(nav => nav.classList.toggle('h-toogle-nav-show'));
}
document
    .querySelector('.top-menu__toggle')
    .addEventListener('click', classToggle);
