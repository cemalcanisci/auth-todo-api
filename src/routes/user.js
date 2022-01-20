const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { login, register, fetch } = require('../controllers/AuthController');

router.post('/login', login);

router.get('/fetch', auth, fetch);

router.post('/register', register);

module.exports = router;
