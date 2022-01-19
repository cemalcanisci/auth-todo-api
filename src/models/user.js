module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter your first name',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter your first name');
          }
        },
        len: {
          args: [2, 50],
          msg: 'First Name must be between 2 and 50 characters',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        notNull: {
          msg: 'Please enter your last name',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter your last name');
          }
        },
        len: {
          args: [2, 50],
          msg: 'Last Name must be between 2 and 50 characters',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [4, 150],
          msg: 'Password must be between 4 and 150 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: '',
      validate: {
        notNull: {
          msg: 'Please enter your email',
        },
        checkNull(value) {
          if (!value) {
            throw new Error('Please enter your email');
          }
        },
        isEmail: {
          msg: 'Email is not valid',
        },
      },
    },
  });

  User.associate = function (models) {
    User.hasMany(models.Group, { as: 'groups', foreignKey: 'userId' });
    User.hasMany(models.Todo, { as: 'todos', foreignKey: 'userId' });
  };

  return User;
};
