const { STATUS } = require('../constants/enums');
const { ACTIVE, COMPLETED } = STATUS;

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.TINYINT,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notNull: {
          msg: 'Please enter todo',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter todo');
          }
        },
        len: {
          args: [2, 200],
          msg: 'Todo must be between 2 and 200 characters',
        },
      },
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: 'Priority should be integer',
        },
        min: {
          args: 1,
          msg: 'Priority can minimum 1',
        },
        max: {
          args: 5,
          msg: 'Priority can maximum 5',
        },
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: [ACTIVE, COMPLETED],
      defaultValue: ACTIVE,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter due date',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter due date');
          }
        },
      },
    },
  });
  Todo.associate = function (models) {
    Todo.belongsTo(models.User, { as: 'user' });
    Todo.belongsTo(models.Group, {
      as: 'group',
      onDelete: 'cascade',
    });
  };
  return Todo;
};
