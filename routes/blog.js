const router = require('express').Router()

// Mongo DB Settings
const mongoose = require('mongoose')
const url = "mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322"
mongoose.connect(url)
// MongoDB - Define Article Schema
// const Article = mongoose.model("articles", new mongoose.Schema({
//     "articleImgURL": {
//         "type": String,
//         "default": defaultArticleImgURL
//     },
//     "articleID": {
//         "type": Number,
//         "unique": true
//     },
//     "name": String,
//     "date": {
//         "type": Date,
//         "default": new Date().toLocaleString()
//     },
//     "author": String,
//     "authorEmail": {
//         "type": String,
//         "default": null
//     },
//     "rating": {
//         "type": Number,
//         "default": 0
//     },
//     "content": String
//     })
// )

// Create a test article
// Article.exists({articleID: 1}, (err, article) => {
//     if(err) {
//         console.log(err)
//     }else{
//         console.log(article)
//         if(!article) {
//             console.log("Test Article not found! Creating one...")
//             const testArticle = new Article({
//                 articleID: 1,
//                 name: "This Is A Test Article! Read Now!",
//                 author: "Victor Krenzel",
//                 authorEmail: "vkrenzel@myseneca.ca",
//                 rating: 5,
//                 content: 'This is some test content...'
//             }).save().then(() => {
//                 console.log("Test Article Created!")
//             })
//         }
//     }
// })

// new Article({
//     articleID: 4,
//     name: "Blockchain Facts: What Is It, How It Works, and How It Can Be Used",
//     author: "ADAM HAYES",
//     authorEmail: null,
//     rating: 4,
//     content: "What Is a Blockchain?A blockchain is a distributed database or ledger that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format. Blockchains are best known for their crucial role in cryptocurrency systems, such as Bitcoin, for maintaining a secure and decentralized record of transactions. The innovation with a blockchain is that it guarantees the fidelity and security of a record of data and generates trust without the need for a trusted third party.<br>One key difference between a typical database and a blockchain is how the data is structured. A blockchain collects information together in groups, known as blocks, that hold sets of information. Blocks have certain storage capacities and, when filled, are closed and linked to the previously filled block, forming a chain of data known as the blockchain. All new information that follows that freshly added block is compiled into a newly formed block that will then also be added to the chain once filled.<br>A database usually structures its data into tables, whereas a blockchain, as its name implies, structures its data into chunks (blocks) that are strung together. This data structure inherently makes an irreversible timeline of data when implemented in a decentralized nature. When a block is filled, it is set in stone and becomes a part of this timeline. Each block in the chain is given an exact timestamp when it is added to the chain.",
//     articleImgURL: "https://www.investopedia.com/thmb/wuuss_5lSKqGckNngtP1__7qEk4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Blockchain_final-086b5b7b9ef74ecf9f20fe627dba1e34.png"
// }).save()

router.get('/', (req, res) =>{
    // Displays all blogposts
    // Conver BlogPosts obj ==> Array
    // var articlesArr = []
    // Article.find({/** All Articles */}, (err, articles) => {
    //     if(err) {
    //         console.log(err)
    //     }else{
    //         articlesArr = articles.map(article => ({
    //             articleID: article.articleID,
    //             name: article.name,
    //             author: article.author,
    //             authorEmail: article.authorEmail,
    //             rating: article.rating,
    //             content: article.content,
    //             articleImgURL: article.articleImgURL
    //         }))
    //         // Then
    //     }
    // })  
    res.render('blog', {
        layout: false,
        // articles: articlesArr,
    })
})

module.exports = router