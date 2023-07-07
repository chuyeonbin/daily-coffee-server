export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: { type: DataTypes.STRING(100), allowNull: false, unique: false },
      nickname: { type: DataTypes.STRING(20), allowNull: false, unique: false },
    },
    {
      timestamp: true,
      charset: 'utf8',
      collate: 'utf8-general-ci',
    }
  );

  return User;
};
