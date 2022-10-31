/**
** @author Victor Krenzel (stu#)
** @file server.js
** @desc WEB 322 Assignment
**
** @date Halloween 2022 🎃
*/

const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// const multer = require('multer')

// Load Handlebars
const hbs = require('express-handlebars')

// Express settings
const app = express()

/** 
 * @desc Import register route
 * @see {@link './routes/register.routes.js'}
 **/
const user = require('./routes/user')

// Init API
app.use('/user', user)

// Parser settings
app.use(cors())
app.use(cookieParser())
app.use(session({
    secret: 'webhost322',
    saveUninitialized: false,
    resave: false
}))

// View Engine Setup
app.set('view engine', '.hbs')
app.set('views', __dirname + '/views/partials')
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultView: 'default',
    layoutDir: __dirname + '/views/pages',
    partialsDir: __dirname + '/views/partials',
}))

// Render index.hbs (main route)
app.get('/', (req, res) => res.redirect('user'))

// Define PORT
const PORT = process.env.PORT || 8080
const date = new Date().toLocaleString()
const onStart = port => console.log(`[${date}] Connected on localhost:${port}`)
app.listen(PORT, onStart(PORT))