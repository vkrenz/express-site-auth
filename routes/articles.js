const router = require('express').Router()

// Mongo DB Settings
const mongoose = require('mongoose')
const url = "mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322"
mongoose.connect(url)
// MongoDB - Define Article Schema
const Article = mongoose.model("articles", new mongoose.Schema({
    "articleID": {
        "type": Number,
        "unique": true
    },
    "name": String,
    "date": {
        "type": Date,
        "default": new Date().toLocaleString()
    },
    "author": String,
    "authorEmail": {
        "type": String,
        "default": "N/A"
    },
    "rating": {
        "type": Number,
        "default": 0
    },
    "content": String
    })
)

// Create a test article
Article.exists({articleID: 1}, (err, article) => {
    if(err) {
        console.log(err)
    }else{
        console.log(article)
        if(!article) {
            console.log("Test Article not found! Creating one...")
            const testArticle = new Article({
                articleID: 1,
                name: "This Is A Test Article! Read Now!",
                author: "Victor Krenzel",
                authorEmail: "vkrenzel@myseneca.ca",
                rating: 5,
                content: 'This is some test content...'
            }).save().then(() => {
                console.log("Test Article Created!")
            })
        }
    }
})

router.get('/', (req, res) =>{
    Article.find({/** All Articles */}, (err, articles) => {
        if(err) {
            console.log(err)
        }else{
            const articlesArr = articles.map(article => ({
                articleID: article.articleID,
                name: article.name,
                author: article.author,
                authorEmail: article.authorEmail,
                rating: article.rating,
                content: article.content
            }))
            console.log(articlesArr)
            res.render('articles', {
                layout: false,
                articles: articlesArr
            })
        }
    })    
})

router.get('/:articleID', (req, res) =>{
    const articleID = parseInt(req.params.articleNumber)
    res.render('article', {
        articleNumber: req.params.articleNumber,
        layout: false
    })
})

module.exports = router