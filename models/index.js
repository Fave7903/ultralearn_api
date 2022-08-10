const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle 
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.js")(sequelize, Sequelize);
db.post = require("./post.js")(sequelize, Sequelize);
db.follower = require("./follower.js")(sequelize, Sequelize);
db.comment = require("./comment.js")(sequelize, Sequelize);
db.user.hasMany(db.post)
db.user.hasMany(db.follower)
db.post.belongsTo(db.user)
db.follower.belongsTo(db.user)
  
module.exports = db; 