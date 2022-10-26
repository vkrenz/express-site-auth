const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended : false })

// Router
const router = express.Router()

// Express Validator
const { check, validationResult } = require('express-validator')

// url '/user/auth?=login' (post/login)
router.post('/auth?=login', urlencodedParser, [
    // Validation Rules
    check('username', 'Username must be minimum 3 characters').isLength({ min: 3 }),
    // Password must be at least 5 characters...
    check('password', 'Password must be 5 characters long').isLength({ min : 5 }),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        console.log(errors)
        const err = errors.array()
        res.render('login', {
            layout: false,
            err: err,
        })
    } else {
        const { username, email } = req.body
        findUser(email, password) ?
        res.redirect(301, `/dash/${username}`) :
        res.status(401).end().message('Cannot Find User')
    }
})

// url '/user/auth?=register' (post/register)
router.post('/auth?=register', urlencodedParser, [
    // Validation Rules
    check('username', 'Username must be minimum 3 characters').isLength({ min: 3 }),
    check('email', 'Email is invalid').isEmail().normalizeEmail(),
    // Password must be at least 5 characters...
    check('password', 'Password must be 5 characters long').isLength({ min : 5 }),
    // Check if 'confirm_password' matches 'password' (or req.body.password)
    check('confirm_password', 'Passwords do not match').equals('password')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        console.log(errors)
        const err = errors.array()
        res.render('register', {
            layout: false,
            err: err,
        })
    } else {
        res.redirect('/user/login')
        // const { username, email } = req.body
        // findUser(email, password) ?
        // res.redirect(301, `/dash/${username}`) :
        // res.status(401).end()
    }
})


router.get('/', (req, res) => {
    res.redirect('/user/login')
})

router.get('/register', (req, res) => {
    res.render('register', { layout: false })
})

router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})


// Dashboard Route
router.get('/dash:username/', (req, res) => {
    const { username } = req.params
    res.render('dash', { 
        layout: false ,
        username: username
    })
})

// User DB
const users = [
    {
        username: 'vkrenzel',
        email: 'vkrenzel@outlook.com',
        password: 'password'
    },
    {
        username: 'bigboi55',
        email: 'big.boy@hotmail.com',
        password: 'BigBoy111222'
    }
]

const findUser = (email, password) => users.some(user => user.email === email && user.password === password)

module.exports = router