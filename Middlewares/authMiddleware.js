const {getUserById, getUserIdByEmail} = require('./index')

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

const checkUser = (req, res, next) => {
  if(req.session.userId){
    let user = req.session.userId;
    res.locals.user = user;
    next();
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = {
  isAuthenticated,
  checkUser
}
