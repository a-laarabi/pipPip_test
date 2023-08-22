const bcrypt = require('bcrypt');
const connection = require('../db')


const register_get = (req, res) => {
  res.render('register', { error: null });
}

const register_post = (req, res) => {
  const { username, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let error = null;

  if (!username || !email || !password) {
    error = 'All fields are required.';
  } else if (password.length < 8) {
    error = 'Password must be at least 8 characters long.';
  } else if (!emailRegex.test(email)) {
    error = 'Invalid email format.';
  }

  if (error) {
    res.render('register', { error });
    return;
  }

  connection.query('SELECT * FROM users WHERE username = ?', [username], (usernameError, usernameResults) => {
    if (usernameError) {
      throw usernameError;
    }
    if (usernameResults.length > 0) {
      res.render('register', { error: 'Username already exists.' });
    } else {
      connection.query('SELECT * FROM users WHERE email = ?', [email], (emailError, emailResults) => {
        if (emailError) {
          throw emailError;
        }

        if (emailResults.length > 0) {
          res.render('register', { error: 'Email already exists.' });
        } else {
          const hashedPassword = bcrypt.hashSync(password, 10);

          const user = { username, email, password: hashedPassword };
          connection.query('INSERT INTO users SET ?', user, (insertError, insertResults) => {
            if (insertError) {
              throw insertError;
            }

            res.render('display', {
              message: '<h1>Account created successfully</h1><a class="btn" href="/login">Login</a>',
            });
          });
        }
      });
    }
  });
};

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
      res.render('dashboard');
    } else {
      res.render('login', {error: 'Invalid password.'});
    }
  });
}

const logout_get = (req, res) => {
  req.session.destroy();
  res.render('login', {error: null});
}

module.exports = {
  register_get,
  register_post,
  login_get,
  login_post,
  logout_get
};