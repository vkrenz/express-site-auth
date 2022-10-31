/**
 * @file user.js
 * @desc Router which handles: 
 * => user registration
 * => user login
 * => user dashboard
 */

const router = require('express').Router()

// Body Parser settings
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))

const session = require('express-session')
router.use(session({
    secret: 'web322-senecacollege-ca-users',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// Mongo DB Settings
const { mongoClient } = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322")

// MongoDB - Define User Schema
const User = mongoose.model("Users", new mongoose.Schema({
    "userID": {
        "type": Number,
        "unique": true,
        "default": 1
    },
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
        "unique": true
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
        "default": "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png"
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

User.exists({username: "admin-vkrenzel"}, (err, res) => {
    if(err) {
        console.log(err)
    } else {
        console.log(res)
        if(!res) {
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

/**
 * @function PostRegister
 */
// url '/user/auth/register' (post/register)
router.post('/auth/register', [
    // Validation Rules
    check('username', 'Username must be 3-12 characters').isLength({ min: 3, max: 12 }),
    check('email', 'Email is invalid').isEmail().normalizeEmail(),
    check('password', 'Password must be 5-12 characters and include ').isLength({ min : 5, max: 12 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").matches('confirm_password'),
    check('confirm_password', 'Passwords do not match').equals('password')
], (req, res) => {
    const errors = validationResult(req)
    const { username, email, password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode  } = req.body
    req.session.user = req.body
    if (!errors.isEmpty()) {
        console.log(errors)
        const err = errors.array()
        res.render('register', {
            layout: false,
            err: err
        })
    }else if(errors.isEmpty()) {
        // Validate username
        User.exists({username: username}, (err, user) => {
            if(err) {
                console.log(err)
                res.render('register', {
                    layout: false,
                    err: err
                })      
            }else{
                console.log(`${username} already exists bro`)
                const userTaken = `${username} is already taken`
                console.log(user)
                res.render('register', {
                    layout: false,
                    userTaken: userTaken
                })          
            }
        })
    }else{
        console.log(`${username} does not exist. Creating new user...`)
        createUser(username, email, password, fullName, pfpURL, phoneNumber, companyName, country, city)
        // Redirect to the dashboard
        res.redirect(`/dash/${username}`)
    }
})

const createUser = (username, email, password, fullName, pfpURL, phoneNumber, companyName, country, city) => {
    User.create({
        username: username,
        email: email,
        password: password,
        fullName: fullName,
        pfpURL: pfpURL,
        phoneNumber: phoneNumber,
        companyName: companyName,
        country: country,
        city: city
    }).save().then(() => {
        console.log(`New User (${username})`)
    }).catch(err => {
        console.log(`Error: ${err}`)
    })
}

router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

/**
 * @function PostLogin
 */
// url '/user/auth/login' (post/login)
router.post('/auth/login', [
    // Validation Rules
    check('username', 'Username must be minimum 3-12 characters').isLength({ min: 3, max: 12}),
    check('password', 'Password must be 5-12 characters long').isLength({ min: 5, max: 12}),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty() || !User.exists({username: req.body.username})) {
        // return res.status(422).jsonp(errors.array())
        console.log(errors)
        const err = errors.array()
        if(!User.exists({username: req.body.username})) {
            couldNotFindUser = "Could not find user"
            res.render('login', {
                layout: false,
                couldNotFindUser: couldNotFindUser
            })
        } else {
            res.render('login', {
                layout: false,
                err: err,
            })
        }
    } else {
        const { username, password } = req.body
        console.log(User.exists({username: username}) ? "User found!" : "User not found :(")
        if(User.exists({username: username})) {
            res.redirect(`/dash/${username}`)
        }
    }
})

// Dashboard Route
router.get('/dash/:username', (req, res) => {
    const { username } = req.params
    const { email, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode } = req.session.user
    res.render('dash', { 
        layout: false ,
        username: username,
        email: email,
        fullName: fullName,
        pfpURL: pfpURL,
        phoneNumber: phoneNumber,
        companyName: companyName,
        country: country,
        city: city,
        postalCode: postalCode
    })
})

// const findUser = (email, password) => users.some(user => user.email === email && user.password === password)

module.exports = router