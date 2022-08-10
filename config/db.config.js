const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

module.exports = {
    HOST:  process.env.MYSQL_HOST,
    USER:  process.env.MYSQL_USERNAME,
    PASSWORD:  process.env.MYSQL_PASSWORD,
    DB: process.env.MYSQL_DATABASE,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };