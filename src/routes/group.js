const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const { add, fetch, edit, remove } = require('../controllers/GroupController');

router.get('/fetch', auth, fetch);

router.post('/add', auth, add);

router.put('/edit/:id', auth, edit);

router.delete('/delete/:id', auth, remove);

module.exports = router;
