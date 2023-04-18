const jwt = require('jsonwebtoken');

const autotorization = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const playload = jwt.verify(token, 'some-secret-key');
    req.user = playload;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

module.exports = {
  autotorization,
};
