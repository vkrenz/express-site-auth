/**
 * @file user.js
 * @desc Router which handles: 
 * ==> user registration
 * ==> user login
 * ==> user dashboard
 * 
 * @date ❄️ November 1, 2022 ❄️
 */

const router = require('express').Router()

// Body Parser settings
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))

const session = require('express-session')
router.use(session({
    secret: 'web322-senecacollege-ca',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// Mongo DB Settings
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322")
const defaultPFPURL = "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png"

// MongoDB - Define User Schema
const User = mongoose.model("Users", new mongoose.Schema({
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

/**
 * @function ROUTER-POST-REGISTER
 * @desc "localhost:8080/user/auth/register"
 * ==> Validates user input,
 * ==> Checks if a user exists in mongoDB,
 * ==> Creates a new user in mongoDB collection,
 * ==> Redirects to user dashboard @see /user/dash/:username
 */

router.post('/auth/register', [
    // Validation Rules
    check('username', 'Username must be minimum 3 characters').isLength({ min: 3}),
    check('email', 'Email is invalid').isEmail().normalizeEmail(),
    check('password', 'Password must be minimum 5 characters').isLength({ min : 5}),
    check('confirm_password', 'Passwords do not match').equals('password')
], (req, res) => {
    const errors = validationResult(req)
    const err = errors.array()
    const { username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode  } = req.body
    req.session.user = req.body
    if (!errors.isEmpty()) {
        console.log(errors)
        renderRegisterPage(res, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)
    }else{
        // Validate username
        User.exists({username: username}, (Err, user) => {
            if(Err) {
                console.log(Err)
                renderRegisterPage(res, Err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)  
            }else{
                if(user != null) {
                    console.log(`Username: ${username} already exists bro`)
                    const userTaken = `Username: ${username} is already taken`
                    console.log(user)
                    renderRegisterPageUserTaken(userTaken, res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode)        
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

const renderRegisterPage = (res, Err, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode) => {
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

const renderRegisterPageUserTaken = (userTaken, res, err, username, email, password, confirm_password, fullName, pfpURL, phoneNumber, companyName, country, city, postalCode) => {
    res.render('register', {
        layout: false,
        userTaken: userTaken,
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

router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

/**
 * @function ROUTER-POST-LOGIN
 * @desc "localhost:8080/user/auth/login"
 * ==> Validates user input,
 * ==> Checks if a user exists in mongoDB,
 * ==> Checks if password matches database password,
 * ==> Redirects to user dashboard @see /user/dash?u=:username
 */

router.post('/auth/login', [
    // Validation Rules
    check('username', 'Username must be minimum 3-12 characters').isLength({ min: 3}),
    check('password', 'Password must be 5-12 characters long').isLength({ min: 5}),
], (req, res) => {
    const errors = validationResult(req)
    const err = errors.array()
    if (!errors.isEmpty() || !User.exists({username: req.body.username})) {
        console.log(errors)
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
            res.redirect(`/user/dash/${username}`)
        }
    }
})

/**
 * @function ROUTER-GET-USER-DASHBOARD
 * @desc 'localhost:/user/dash/username'
 * ==> Check if user exists in mongoDB,
 * ==> Render a user-specific dashboard page
 */

router.get('/dash/:username', (req, res) => {
    const { username } = req.params
    User.exists({username: username}, (err, user) => {
        if(err) {
            console.log(err)
            res.send(err, ':(')
        }else if(user == null){
            const error_DNE = `User: ${username} doesn't exist :((`
            res.render('login', {
                layout: false,
                error_DNE: error_DNE
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
module.exports = router