const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
  fetch,
  add,
  edit,
  remove,
  updateStatus,
} = require('../controllers/TodoController');

router.get('/fetch', auth, fetch);

router.post('/add', auth, add);

router.put('/edit/:id', auth, edit);

router.put('/update-status/:id', auth, updateStatus);

router.delete('/delete/:id', auth, remove);

module.exports = router;
