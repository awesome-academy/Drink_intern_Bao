import '../styles/main.scss';
import 'bootstrap';
import '@fortawesome/fontawesome-free/js/all';

if (process.env.NODE_ENV !== 'production') {
    require('../index.pug');
}
