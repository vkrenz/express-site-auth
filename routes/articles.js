const router = require('express').Router()

// MongoDB settings
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322")

// MongoDB - Define Article Schema
const Schema = mongoose.Schema
const articleSchema = new Schema({
    "articleID": Number,
    "name": String,
    "date": {
        "type": Date,
        "default": new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    "author": String,
    "authorEmail": {
        "type": String,
        "default": "N/A"
    },
    "rating": {
        "default": 0,
        "max": 5
    },
    "content": String
})

const Article = mongoose.model("web322_articles", articleSchema)

router.get('/', (req, res) =>{
    res.render('article_index')
})

router.get('/:articleNumber', (req, res) =>{
    res.render('article', {
        articleNumber: req.params.articleNumber
    })
})

module.exports = router