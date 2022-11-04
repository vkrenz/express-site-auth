/**
* @author Victor Krenzel (102446176)
* @file server.js
* @desc WEB 322 Assignment
*
* @date ❄️ November 3, 2022 ❄️
* @todo Implement article.js
* Changelog
* ==> Declared static path
* ==> Added a favicon.ico
*/

// Express settings
const express = require('express')
const app = express()

// General Imports
const hbs = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
// const multer = require('multer')


// General app settings
const favicon = require('serve-favicon')
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'webhost322',
    saveUninitialized: false,
    resave: false
}))

// Parser settings
app.use(cors())
app.use(cookieParser())

// User Router Import
const user = require('./routes/user')
app.use('/user', user)

// UserDB Import
const User = require('./routes/user')

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
app.get('/', (req, res) => res.redirect('/home'))

app.get('/home', (req, res) => {
    res.render('index', { layout: false })
})

// Define PORT
const PORT = process.env.PORT || 8080
const date = new Date().toLocaleString()
const onStart = port => console.log(`[${date}] Connected on localhost:${port}`)
app.listen(PORT, onStart(PORT))