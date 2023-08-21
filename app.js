const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const connection = require('./db');
const rateLimit = require('express-rate-limit');


const app = express();

app.use(express.static('public'));

// Use sessions
const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);



connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPasswordResetTableSQL = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;

  connection.query(createUserTableQuery);
  connection.query(createPasswordResetTableSQL);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    // User is authenticated, allow access to the route
    return next();
  }
  // User is not authenticated, redirect to the login page or show an error message
  res.redirect('/login'); // You can customize this redirection as needed
}

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/blog', isAuthenticated, (req, res) => {
  // Render the blog page for authenticated users
  res.send('blog page')
});

app.use(authRoute);
app.use(userRoute);


app.listen(3000)
