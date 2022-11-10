/**
* @author Victor Krenzel (102446176)
* @file server.js
* @desc WEB 322 Assignment
* ==> The main server file for the app
* ==> Handles the main route (/home)
* ==> Handles all the general app settings
* 
*
* @date ❄️ November 7, 2022 ❄️
* @TODAY ARTICLE.JS PAGE
* @TODO Implement scrollmagic.js
* Changelog
* ==> Declared static path
* ==> Added a favicon.ico
* ==> Index.css created in public dir
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

// Articles Router Import
const articles = require('./routes/articles')
app.use('/articles', articles)


// View Engine Setup
app.set('view engine', '.hbs')
app.set('views', __dirname + '/views/partials')
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultView: 'default',
    layoutDir: __dirname + '/views/pages',
    partialsDir: __dirname + '/views/partials'
    // helpers: {
    //     'times': function(n, block) {
    //         var accum = '';
    //         for(var i = 0; i < n; ++i)
    //             accum += block.fn(i);
    //         return accum;
    //     }
    // }
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