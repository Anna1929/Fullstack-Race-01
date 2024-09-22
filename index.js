const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/routesAuth');
const mainRoutes = require('./routes/main');
const NotFoundController = require('./controllers/notFoundController');
const ejs = require('ejs');

const gameRoutes = require('./routes/gameRoutes');
const waitingRoomRoutes = require('./routes/waitingRoomRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'ahieienko', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.use('/game', gameRoutes);
app.use('/waiting-room', waitingRoomRoutes);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Middleware to check session
function checkSession(req, res, next) {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/register');
}

app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'registration.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/password', (req, res) => res.sendFile(path.join(__dirname, 'views', 'password.html')));
app.get('/reminder', (req, res) => res.sendFile(path.join(__dirname, 'views', 'reminder.html')));
app.get('/create-waiting-page', (req, res) => res.sendFile(path.join(__dirname, 'views', 'waiting.html')));
app.get('/create-join-page', (req, res) => res.sendFile(path.join(__dirname, 'views', 'join-room.html')));
app.get('/', checkSession, (req, res) => res.render('main', { user: req.session.user }));

app.use('/', mainRoutes);
app.use('/', authRoutes);
app.use(NotFoundController.showNotFoundPage);

const SERVER_PORT = 5050;
app.listen(SERVER_PORT, () => {
    console.log(`Server started on http://localhost:${SERVER_PORT}`);
});