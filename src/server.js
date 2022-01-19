const express = require('express');
const helmet = require('helmet');
const app = express();
const { User, Group, Todo } = require('./models');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users = require('./routes/user');
app.use('/api/user', users);

const groups = require('./routes/group');
app.use('/api/group', groups);

const todos = require('./routes/todo');
app.use('/api/todo', todos);

app.use(function (req, res, next) {
  res.status(405).send({ message: 'Request not allowed', success: false });
});

(async () => {
  try {
    await User.sync();
    await Group.sync();
    await Todo.sync();
    app.listen(PORT, () => {
      console.log(`listening on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();