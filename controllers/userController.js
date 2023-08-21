const bcrypt = require('bcrypt');
const crypto = require('crypto');

const {transporter,
  getUserIdByEmail,
  storeResetTokenInDatabase,
  verifyResetToken,
  updatePassword,
  getUserIdByResetToken} = require('../Middlewares/index');

const forgotPassword_get = (req, res) => {
  res.render('forgot-password');
}

const sendResetEmail_post = async(req, res) => {
  const { email } = req.body;

  const resetToken = crypto.randomBytes(20).toString('hex');

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: 'ana.laara3@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You've requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    const userId = await getUserIdByEmail(email);

    if (userId !== null) {
      await storeResetTokenInDatabase(userId, resetToken);

      res.send('Password reset instructions sent to your email.');
    } else {
      res.send('No user found with the provided email.');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).send('Error sending the reset email.');
  }
}

const resetPassword_get = (req, res) => {
  const { token } = req.query;
  res.render('reset-password', { token, error: null });
}

const resetPassword_post = async(req, res) => {
  const { token, newPassword } = req.body;

  if (newPassword.length < 8) {
      return res.render('reset-password', { token, error: 'Invalid password.' });
  }

  const isValidToken = await verifyResetToken(token);

  if (!isValidToken) {
      return res.render('reset-password', { token, error: 'Invalid or expired token.' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const userId = await getUserIdByResetToken(token);
  await updatePassword(userId, hashedPassword);

  res.redirect('/login');
}

module.exports = {
  forgotPassword_get,
  sendResetEmail_post,
  resetPassword_get,
  resetPassword_post
}