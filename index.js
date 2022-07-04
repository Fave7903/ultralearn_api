const express = require('express')


const cors = require('cors')
var cookieParser = require('cookie-parser')

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const fs = require('fs')
const { v1: uuidv1 } = require('uuid')
const expressValidator = require('express-validator');
const app = express()

dotenv.config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err.message))

const PORT = process.env.PORT || 5000
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(expressValidator())
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', postRoutes)
app.use(express.static("public"))
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: 'Unauthorized!'})
  }
})

app.listen(PORT, () => console.log(`A Node js API is listening on port: ${PORT}`))