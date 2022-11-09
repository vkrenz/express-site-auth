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
                content: `Facebook is an online social media and social networking service owned by American company Meta Platforms. Founded in 2004 by Mark Zuckerberg with fellow Harvard College students and roommates Eduardo Saverin, Andrew McCollum, Dustin Moskovitz, and Chris Hughes, its name comes from the face book directories often given to American university students. Membership was initially limited to Harvard students, gradually expanding to other North American universities and, since 2006, anyone over 13 years old. As of July 2022, Facebook claimed 2.93 billion monthly active users,[6] and ranked third worldwide among the most visited websites as of July 2022.[7] It was the most downloaded mobile app of the 2010s.[8]
                Facebook can be accessed from devices with Internet connectivity, such as personal computers, tablets and smartphones. After registering, users can create a profile revealing information about themselves. They can post text, photos and multimedia which are shared with any other users who have agreed to be their "friend" or, with different privacy settings, publicly. Users can also communicate directly with each other with Facebook Messenger, join common-interest groups, and receive notifications on the activities of their Facebook friends and the pages they follow.
                The subject of numerous controversies, Facebook has often been criticized over issues such as user privacy (as with the Cambridge Analytica data scandal), political manipulation (as with the 2016 U.S. elections) and mass surveillance.[9] Facebook has also been subject to criticism over psychological effects such as addiction and low self-esteem, and various controversies over content such as fake news, conspiracy theories, copyright infringement, and hate speech.[10] Commentators have accused Facebook of willingly facilitating the spread of such content,[11][12][13][14][15][16] as well as exaggerating its number of users to appeal to advertisers.[17]`
            }).save().then(() => {
                console.log("Test Article Created!")
            })
        }
    }
})

router.get('/', (req, res) =>{
    Article.find({/** All Articles */}, (err, articles) => {
        const articlesArr = 
        if(err) {
            console.log(err)
        }else{
            res.render('articles', {
                layout: false,
                articles:
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