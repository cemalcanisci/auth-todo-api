if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  secret: process.env.JWT_SECRET || '26af3380-5fd3-4480-bbcf-7a2456cf900a',
  rounds: 10,
};
