
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const Player = require('./models/Player');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'borderland-secret',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Player.findOne({ username });
  if (user && user.password === password) {
    req.session.user = user;
    res.redirect('/leaderboard');
  } else {
    res.send('Login failed. Try again.');
  }
});

app.get('/leaderboard', async (req, res) => {
  const players = await Player.find().sort({ rating: -1 });
  res.render('leaderboard', { players });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
