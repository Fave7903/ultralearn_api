module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("like", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    return Like;
  };