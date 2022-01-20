const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth');
const { convertUser } = require('../helpers/user');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized', success: false });
  } else {
    let token = req.headers.authorization.replace('Bearer ', '');

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(500).json({
          message: 'Failed to decode token',
          err,
          success: false,
        });
      } else {
        req.user = convertUser(decoded.user);
        next();
      }
    });
  }
};
