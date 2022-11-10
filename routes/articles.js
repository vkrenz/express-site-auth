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
        "default": null
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

// new Article({
//     articleID: 3,
//     name: "What is Meta? The meaning behind the social metaverse company",
//     author: "Gemma Ryles",
//     authorEmail: null,
//     rating: 3,
//     content: "Meta describes itself as a company that builds technologies that help people connect and find communities, as well as grow businesses. Meta has been marketing itself as a social technology company, offering services like virtual reality (VR), augmented reality (AR) and Smart Glasses, the latter is the latest endeavour it’s waded into. Meta has five core principles. They are giving people a voice: building connections across communities, making technology accessible, keeping people safe by protecting privacy and promoting economic opportunity for business to create jobs for a better economy. These principles are intended to ensure that Meta is a safe place to reside in for all users, promoting and sharing ideas and thoughts in an open environment. Meta is currently building up a VR social platform called Horizon Worlds. To learn even more about Horizon Worlds, you can check out our explainer. Horizon Worlds is a social hub that you can experience via VR and includes several destinations within the Metaverse, all of which have distinct features and goals.",
//     articleImgURL: "https://www.trustedreviews.com/wp-content/uploads/sites/54/2021/11/Meta-image-920x518.png"
// }).save()

router.get('/', (req, res) =>{
    // Displays all articles
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

router.get('/read/:articleID', (req, res) =>{
    const articleID = parseInt(req.params.articleID)
    Article.findOne({articleID: articleID}, (err, article) => {
        if(err) {
            console.log(err)
        }else{
            var stars = ''
            for(var i = 0; i < article.rating; i++) {
                stars += '<i class="fa-solid fa-star"></i>'
            }
            res.render('read', {
                layout: false,
                name: article.name,
                author: article.author,
                rating: stars,
                content: article.content
            })
        }
    }) 
})

module.exports = router