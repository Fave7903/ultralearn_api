module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "your MYSQL password",
    DB: "ultralearn",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };