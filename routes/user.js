/**
 * @file user.js
 * @desc ✨ Where all the magic happens ✨
 * ==> user database (mongoDB)
 * ==> user registration
 * ==> user login
 * ==> user dashboard
 * 
 * @date ❄️ November 4, 2022 ❄️
 * @TODO ==> Implement EXPRESS-SESSION
 * @TODO ==> Change 'Users_Test' Collection ==> 'Users' in the User schema
 * @TODO ==> Style user dashboard
 * Changelog
 * ==> Cleaned POST code up
 * ==> Login/Register works! 😃
 * ==> Made login form pretty
 * ==> User-doesn't-exist error links to pre-filled register
 * ==> User-already-exists error links to pre-filled login
 * ==> Made register form pretty
 * ==> Login page shows current userbase
 */

const router = require('express').Router()

// Body Parser settings
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))

// Express-session settings
const session = require('express-session')
router.use(session({
    secret: 'web322-senecacollege-ca',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// Mongo DB Settings
const mongoose = require('mongoose')
const url = "mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322"
mongoose.connect(url)
const defaultPFPURL = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"

// MongoDB - Define User Schema
// TODO: Change 'Users_Test' ==> 'Users'
const User = mongoose.model("Users_Test", new mongoose.Schema({
    "createdAt": {
        "type": Date,
        "default": new Date().toLocaleString(),
    },
    "userType": {
        "type": String,
        "default": "user"
    },
    "username": {
        "type": String,
        "required": true,
        "unique": true
    },
    "email": {
        "type": String,
        "required": true,
    },
    "password": {
        "type": String,
        "required": true
    },
    "fullName": {
        "type": String,
        "required": true
    },
    "pfpURL": {
        "type": String,
        "default": defaultPFPURL
    },
    "phoneNumber": String, 
    "companyName": {
        "type": String,
        "required": true
    },
    "country": String,
    "city": String,
    "postalCode": String
    })
)

User.exists({username: "admin-vkrenzel"}, (err, user) => {
    if(err) {
        console.log(err)
    } else {
        console.log(user)
        if(!user) {
            // Create admin user
            console.log("Admin User not found! Creating one...")
            const adminUser = new User({
                userType: "admin",
                username: "admin-vkrenzel",
                email: "vkrenzel@outlook.com",
                password: "admin",
                fullName: "Victor Krenzel",
                phoneNumber: "1112223333",
                companyName: "Seneca College",
                country: "Canada",
                city: "Toronto",
                postalCode: "M2M 1G1"
            }).save().then(() => {
                console.log("Admin User Created!")
            })
        }
    }
})

// Express Validator
const { check, validationResult } = require('express-validator')

router.get('/', (req, res) => {
    res.redirect('/user/login')
})

router.get('/register', (req, res) => {
    res.render('register', { layout: false })
})

router.get('/register/:username', (req, res) => {
    const { passedUsername } = req.params
    res.render('register', {
        layout: false,
        passedUsername: passedUsername
    })
})

/**
 * @function ROUTER-POST-REGISTER
 * @desc "localhost:8080/user/auth/register"
 * ==> Validates user input, @see registerValidationRules,
 * ==> Checks if a user exists in mongoDB, if not...
 * ==> Creates a new user in mongoDB collection 'Users_Test',
 * ==> Redirects to user dashboard @see /user/dash/:username
 */

const registerValidationRules = [
    check('username').isLength({ min: 3}).withMessage('Username must be minimum 3 characters'),
    check('email').isEmail().normalizeEmail().withMessage('Email is invalid'),
    check('password').isLength({ min : 5}).withMessage('Password must be minimum 5 characters'),
    check('confirm_password').equals('password').withMessage('Passwords do not match')
]

router.post('/auth/register', registerValidationRules, (req, res) => {
    const errors = validationResult(req)
    const err = errors.array()
    const { username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode  } = req.body
    // req.session.user = req.body
    if (!errors.isEmpty()) {
        console.log(errors)
        renderRegisterPage(res, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)
        console.log(`password: ${password} confirm_password: ${confirm_password}`)
    }else{
        // Validate username
        if(password == username) {
            const Err = 'Password cannot match username'
            console.log(Err)
            renderRegisterPageErr(res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)
        }else{
            User.findOne({username: username}, (Err, user) => {
                if(Err) {
                    console.log(Err)
                    renderRegisterPageErr(res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)  
                }else{
                    if(user != null) {
                        console.log(`Username: ${username} already exists bro`)
                        Err = `Looks like '<strong>${username}</strong>' already exists. <a href="/user/login/${username}" class="alert-link">Log In?</a>`
                        console.log(user)
                        renderRegisterPageErr(res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)        
                    }else{
                        console.log(`${username} does not exist. Creating new user...`)
                        createUser(username, email, password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)
                        console.log(user)
                        // Redirect to the dashboard
                        res.redirect(`/user/dash/${username}`)
                        console.log(user)  
                    }
                }
            })
        }
    }
})

const createUser = (username, email, password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode) => {
    new User({
        username: username,
        email: email,
        password: password,
        fullName: fullName,
        pfpURL: pfpURL == "" ? defaultPFPURL : pfpURL,
        phoneNumber: phoneNumber,
        companyName: companyName,
        country: country,
        city: city,
        postalCode: postalCode
    }).save().then(() => {
        console.log(`New User (${username})`)
    }).catch(err => {
        console.log(`Error: ${err}`)
    })
}

const renderRegisterPage = (res, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode) => {
    res.render('register', {
        layout: false,
        err: err,
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password,
        fullName: fullName,
        pfpURL: pfpURL,
        phoneNumber: phoneNumber,
        companyName: companyName,
        country: country,
        city: city,
        postalCode: postalCode
    })
}

const renderRegisterPageErr = (res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode) => {
    res.render('register', {
        layout: false,
        Err: Err,
        err: err,
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password,
        fullName: fullName,
        pfpURL: pfpURL,
        phoneNumber: phoneNumber,
        companyName: companyName,
        country: country,
        city: city,
        postalCode: postalCode
    })
}

// Doesn't work :(
// const userCount = Object.keys(User.countDocuments({})).length
// console.log(userCount)

router.get('/login', (req, res) => {
    User.countDocuments({/** All documents */}, (err, count) => {
        if(err) {
            console.log(err)
        }else{
            res.render('login', {
                layout: false,
                count: count
            })
        }
    })
})

router.get('/login/:username', (req, res) => {
    const { passedUsername } = req.params
    User.countDocuments({/** All Documents */}, (err, count) => {
        if(err) {
            console.log(err)
        }else{
            res.render('login', {
                layout: false,
                passedUsername: passedUsername,
                count: count
            })
        }
    })
})

/**
 * @function ROUTER-POST-LOGIN
 * @desc "localhost:8080/user/auth/login"
 * ==> Validates user input, @see loginValidationRules,
 * ==> Checks if a user exists in mongoDB,
 * ==> Checks if password matches database password,
 * ==> Redirects to user dashboard @see /user/dash/:username
 */

const loginValidationRules = [
    check('username').isLength({ min: 3}).withMessage('Username must be minimum 3 characters'),
    check('password').isLength({ min: 5}).withMessage('Password must be minimum 5 characters long')
]

router.post('/auth/login', loginValidationRules, (req, res) => {
    const errors = validationResult(req)
    const err = errors.array()
    const { username, password } = req.body
    if (!errors.isEmpty()) {
        console.log(errors)
        renderLoginPage(res, err, username, password)
    }else{
        // Validate username first...
        User.findOne({username: username}, (Err, user) => {
            if(Err) {
                console.log(Err)
                renderLoginPageErr(res, Err, err, username, password)
            }else if(user != null) {
                // Validate if password matches...
                if(password == user.password) {
                    console.log('Password matches! :D')
                    res.redirect(`/user/dash/${username}`)
                }else{
                    console.log('Password doesn\'t match :(')
                    Err = 'Incorrect password'
                    renderLoginPageErr(res, Err, err, username, password)
                    // console.log(`input: ${password}, user: ${user.password}`)
                }
            }else{
                Err = `'<strong>${username}</strong>' does not exist. <a href="/user/register/${username}" class="alert-link">Sign Up?</a>`
                console.log(`${username} does not exist`)
                renderLoginPageErr(res, Err, err, username, password)
            }
        })
    }
})

const renderLoginPageErr = (res, Err, err, username, password) => {
    console.log("ERR RENDERED")
    res.render('login', {
        layout: false,
        Err: Err,
        err: err,
        username: username,
        password: password
    })
}

const renderLoginPage = (res, err, username, password) => {
    console.log("NO ERR RENDERED")
    res.render('login', {
        layout: false,
        err: err,
        username: username,
        password: password
    })
}

/**
 * @function ROUTER-GET-USER-DASHBOARD
 * @desc 'localhost:/user/dash/username'
 * ==> Check if user exists in mongoDB,
 * ==> Render a user-specific dashboard page
 */

router.get('/dash/:username', (req, res) => {
    const genericCoverPhotoPATH = 'img/genericCoverPhotoPATH'
    const { username } = req.params
    User.exists({username: username}, (err, user) => {
        if(err) {
            console.log(err)
            // res.send(err, ':(')
        }else if(user == null){
            const Err = `'<strong>${username}</strong>' does not exist. <a href="/user/register/${username}" class="alert-link">Sign Up?</a>`
            res.render('login', {
                layout: false,
                Err: Err
            })
        }else{
            User.findOne({username: username}, (err, user) => {
                if(err) {
                    console.log(err)
                    res.render('dash', {
                        layout: false,
                        err: err
                    })
                }else{
                    res.render('dash', { 
                        layout: false ,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        pfpURL: user.pfpURL,
                        phoneNumber: user.phoneNumber,
                        companyName: user.companyName,
                        country: user.country,
                        city: user.city,
                        postalCode: user.postalCode
                    })
                }
            })
        }
    })
})

module.exports = router, { User }