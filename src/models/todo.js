const { STATUS } = require('../constants/enums');
const { ACTIVE, COMPLETED } = STATUS;

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
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
          args: 10,
          msg: 'Priority can maximum 10',
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
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
  });
  Todo.associate = function (models) {
    Todo.belongsTo(models.User, { as: 'addedBy', foreignKey: 'userId' });
    Todo.belongsTo(models.Group, {
      as: 'group',
      foreignKey: 'groupId',
      onDelete: 'cascade',
    });
  };
  return Todo;
};
