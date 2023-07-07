import { DataTypes } from 'sequelize';
import sequelize from '../models';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8-general-ci',
  }
);

export default User;
