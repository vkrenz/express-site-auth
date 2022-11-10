const router = require('express').Router()

// Mongo DB Settings
const mongoose = require('mongoose')
const url = "mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322"
mongoose.connect(url)
const defaultArticleImgURL = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
// MongoDB - Define Article Schema
const Article = mongoose.model("articles", new mongoose.Schema({
    "articleImgURL": {
        "type": String,
        "default": defaultArticleImgURL
    },
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
                content: article.content,
                articleImgURL: article.articleImgURL
            }))
            // console.log(articlesArr)
            res.render('articles', {
                layout: false,
                articles: articlesArr,
            })
        }
    })    
})

router.get('/article/:articleID', (req, res) =>{
    const articleID = parseInt(req.params.articleNumber)
    Article.findOne({articleID: articleID}, (err, article) => {
        if(err) {
            console.log(err)
        }else{
            res.render('article', {
                layout: false,
                article: article,
            })
        }
    }) 
})

module.exports = router