const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended : false })

// Router
const router = express.Router()

// Express Validator
const { check, validationResult } = require('express-validator')

// '/user/auth'
router.post('/auth', urlencodedParser, [
    // Validation Rules
    check('email', 'Email is invalid').isEmail().normalizeEmail(),
    // Password must be at least 5 characters...
    check('password', 'Password must be 5 characters long').isLength({ min : 5 })
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        console.log(errors)
        const err = errors.array()
        res.render('user', {
            layout: false,
            err: err,
        })
    } else {
        const email = req.body.email
        res.render('user', {
            layout: false,
            email: email
        })
    }

})

router.get('/', (req, res) => {
    res.render('user', { layout: false })
})

module.exports = router