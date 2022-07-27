const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
// const fs = require('fs')
const { v1: uuidv1 } = require('uuid')
const expressValidator = require('express-validator');
const app = express()





dotenv.config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err.message))

const PORT = process.env.PORT || 5000

app.use(cors())

app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

/// include route files
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', postRoutes)

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });



// glob error parser
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: 'Unauthorized!'})
  }
})

app.listen(PORT, () => console.log(`A Node js API is listening on port: ${PORT}`))