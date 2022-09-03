const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const app = express()
 const path = require('path');
require('dotenv').config();
const db =  require('./models')
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




// glob error parser
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: 'Unauthorized!'})
  }
})


app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({force: true})
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`A Node js API is listening on port: ${PORT}`)
})