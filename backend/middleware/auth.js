const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = tokenHeader.replace('Bearer ', '');

  // Use a hardcoded secret key for testing. Replace 'my_test_jwt_secret' with your actual test secret.
  const JWT_SECRET = 'my_test_jwt_secret';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;


      