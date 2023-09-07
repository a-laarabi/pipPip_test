const nodemailer = require('nodemailer');
const connection = require('../db');
const dotenv = require('dotenv');
dotenv.config();

const alreadyAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/blog')
  }
  return next();
}

// For Reset password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});


// For send Reset Email
const getUserIdByEmail = async(email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT id FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0].id);
        }
      }
    });
  });
}

const storeResetTokenInDatabase = async(userId, resetToken) => {
  return new Promise((resolve, reject) => {
    const insertSQL = `
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (?, ?, NOW() + INTERVAL 1 HOUR)  -- Set an expiration time (e.g., 1 hour)
    `;

    connection.query(insertSQL, [userId, resetToken], (error, results) => {
      if (error) {
        console.error('Error storing reset token in the database:', error);
        reject(error);
      } else {
        console.log('Reset token stored in the database.');
        resolve();
      }
    });
  });
}

// For Reset Password
const verifyResetToken = async(token) => {
  return new Promise((resolve, reject) => {
    const checkTokenSQL = `
      SELECT user_id, expires_at
      FROM password_reset_tokens
      WHERE token = ? AND expires_at > NOW()
    `;

    connection.query(checkTokenSQL, [token], (error, results) => {
      if (error) {
        console.error('Error checking reset token:', error);
        reject(error);
      } else if (results.length === 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

const updatePassword = async(userId, newPassword) => {
  return new Promise((resolve, reject) => {
    const updatePasswordSQL = `
      UPDATE users
      SET password = ?
      WHERE id = ?
    `;

    connection.query(updatePasswordSQL, [newPassword, userId], (error, results) => {
      if (error) {
        console.error('Error updating user password:', error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

const getUserIdByResetToken = async(token) => {
  return new Promise((resolve, reject) => {
    const getUserIdSQL = `
      SELECT user_id
      FROM password_reset_tokens
      WHERE token = ? AND expires_at > NOW()
    `;

    connection.query(getUserIdSQL, [token], (error, results) => {
      if (error) {
        console.error('Error getting user ID by reset token:', error);
        reject(error);
      } else if (results.length === 1) {
        resolve(results[0].user_id);
      } else {
        resolve(null);
      }
    });
  });
}


module.exports = {
  alreadyAuthenticated,
  transporter,
  getUserIdByEmail,
  storeResetTokenInDatabase,
  verifyResetToken,
  updatePassword,
  getUserIdByResetToken
}