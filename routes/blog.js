const router = require('express').Router()

// Mongo DB Settings
const mongoose = require('mongoose')
const url = "mongodb+srv://dbVkrenzel:QnzXuxUfGkRec92j@senecaweb.53svswz.mongodb.net/web322"
mongoose.connect(url)
const defaultBlogImgURL = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
// MongoDB - Define Blog_Entries Schema
const Blog = mongoose.model("blogs", new mongoose.Schema({
    "blogImgURL": {
        "type": String,
        "default": defaultBlogImgURL
    },
    "blogID": {
        "type": Number,
        "unique": true
    },
    "name": String,
    "date": {
        "type": Date,
        "default": new Date().toLocaleString()
    },
    "category": {
        "type": String,
        "default": "General"
    },
    "isHero": {
        "type": Boolean,
        "default": false
    },
    "content": String
    })
)

// Create a test blog_entry
Blog.exists({blogID: 1}, (err, entry) => {
    if(err) {
        console.log(err)
    }else{
        console.log(entry)
        if(!entry) {
            console.log("Test Blog Entry not found! Creating one...")
            const testBlogEntry = new Blog({
                blogID: 1,
                name: "Test Blog Entry! Check It Out!",
                isHero: true,
                content: 'This is some generic place holder text. This is for Seneca College\'s Web322 Class Assignment.'
            }).save().then(() => {
                console.log("Test Blog Entry Created!")
            })
        }
    }
})

// new Blog({
//     blogID: 2,
//     name: "Blockchain Facts: What Is It, How It Works, and How It Can Be Used",
//     content: "What Is a Blockchain?A blockchain is a distributed database or ledger that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format. Blockchains are best known for their crucial role in cryptocurrency systems, such as Bitcoin, for maintaining a secure and decentralized record of transactions. The innovation with a blockchain is that it guarantees the fidelity and security of a record of data and generates trust without the need for a trusted third party.<br>One key difference between a typical database and a blockchain is how the data is structured. A blockchain collects information together in groups, known as blocks, that hold sets of information. Blocks have certain storage capacities and, when filled, are closed and linked to the previously filled block, forming a chain of data known as the blockchain. All new information that follows that freshly added block is compiled into a newly formed block that will then also be added to the chain once filled.<br>A database usually structures its data into tables, whereas a blockchain, as its name implies, structures its data into chunks (blocks) that are strung together. This data structure inherently makes an irreversible timeline of data when implemented in a decentralized nature. When a block is filled, it is set in stone and becomes a part of this timeline. Each block in the chain is given an exact timestamp when it is added to the chain.",
//     blogEntryImgURL: "https://www.investopedia.com/thmb/wuuss_5lSKqGckNngtP1__7qEk4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Blockchain_final-086b5b7b9ef74ecf9f20fe627dba1e34.png"
// }).save()

router.get('/', (req, res) =>{
    // Displays all blog entries
    // Convert Blog Entries obj ==> Array
    var entriesArr = []
    Blog.find({/** All Blog Entries */}, (err, entries) => {
        if(err) {
            console.log(err)
        }else{
            entriesArr = entries.map(entry => ({
                blogImgURL: entry.blogImgURL,
                blogID: entry.blogID,
                name: entry.name,
                date: entry.date,
                category: entry.category,
                isHero: entry.isHero,
                content: entry.content
            }))
            // Then
            // entriesArr.forEach(entry => console.log(entry.name))
            res.render('blog', {
                layout: false,
                entries: entriesArr,
            })
        }
    })  
})

module.exports = router