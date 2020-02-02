const check = (redirectUrl = "/") => (req, res, next) => {
  if (req.session.fair) next();
  else res.redirect(redirectUrl);
};

module.exports = { check };
