const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { secret, rounds } = require('../config/auth');
const { errorMessage } = require('../helpers/valitadion');
const { convertUser } = require('../helpers/user');

module.exports = {
  async login(req, res) {
    try {
      let { email, password } = req.body;

      if (!password) {
        return res
          .status(500)
          .json({ message: 'Password is required', success: false });
      }

      if (!email) {
        return res
          .status(500)
          .json({ message: 'Email is required', success: false });
      }

      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: 'User not found', success: false });
      } else {
        let compared = await bcrypt.compare(password, user.password);

        if (compared) {
          let token = jwt.sign({ user }, secret);

          return res.json({
            success: true,
            user: convertUser(user),
            token,
          });
        } else {
          return res
            .status(401)
            .json({ message: 'Password is incorrect.', success: false });
        }
      }
    } catch (error) {
      return res.status(400).json(errorMessage(error));
    }
  },

  async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!password) {
        return res
          .status(400)
          .json({ message: 'Password is required', success: false });
      }

      let cryptedPassword = await bcrypt.hash(password, rounds);

      const user = await User.create({
        firstName,
        lastName,
        email,
        password: cryptedPassword,
      });

      let token = jwt.sign({ user }, secret);

      res.json({
        success: true,
        user: convertUser(user),
        token,
      });
    } catch (error) {
      let statusCode = 400;
      if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
      }
      res.status(statusCode).send(errorMessage(error));
    }
  },
};
