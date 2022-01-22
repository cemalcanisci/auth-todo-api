module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.TINYINT,
    },
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
  });

  Group.associate = function (models) {
    Group.belongsTo(models.User, { as: 'user' });
  };

  return Group;
};
