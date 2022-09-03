const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user", 
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female", "prefernottosay"),
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
      },
      imgId: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.STRING,
      },
      skillInterests: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      published: {
        type: Sequelize.BOOLEAN,
      },
      followers_len: {
        type: Sequelize.INTEGER
      },
      following_len: {
        type: Sequelize.INTEGER
      }
    }
  );
  User.addHook(
    "beforeCreate",
    (user) => (user.password = bcrypt.hashSync(user.password, 10))
  );
  return User;
}; 
