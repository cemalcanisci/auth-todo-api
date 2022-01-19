module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notNull: {
          msg: 'Please enter group name',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter group name');
          }
        },
        len: {
          args: [2, 50],
          msg: 'Name must be between 2 and 50 characters',
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
  });

  Group.associate = function (models) {
    Group.belongsTo(models.User, { as: 'addedBy', foreignKey: 'userId' });
    Group.hasMany(models.Todo, {
      as: 'todos',
      foreignKey: 'groupId',
    });
  };

  return Group;
};
