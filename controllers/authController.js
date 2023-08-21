const bcrypt = require('bcrypt');
const connection = require('../db')


const register_get = (req, res) => {
  res.render('register', { error: null });
}

const register_post = (req, res) => {
  const { username, email, password } = req.body;

  let error = null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!username || !email || !password) {
    error = 'All fields are required.';
  } else if (password.length < 8) {
    error = 'Password must be at least 8 characters long.';
  } else if (!emailRegex.test(email)) {
    error = 'Invalid email format.';
  }

  if (error) {
    res.render('register', { error });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = { username, email, password: hashedPassword };
  connection.query('INSERT INTO users SET ?', user, (error, results) => {
    if (error) throw error;
    res.status(201).send('User registered successfully.');
  });
}

const login_get = (req, res) => {
  res.render('login', { error: null });
}

const login_post = (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      res.render('login', {error: 'Invalid username.'});
      return
    }

    const user = results[0];
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      res.send('Logged in successfully.');
    } else {
      res.render('login', {error: 'Invalid password.'});
    }
  });
}

const logout_get = (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully.');
}

module.exports = {
  register_get,
  register_post,
  login_get,
  login_post,
  logout_get
};