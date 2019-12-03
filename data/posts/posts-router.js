const express = require("express")

const Posts = require('../db')

const router = express.Router()

router.use(express.json())

//GETS
//ALL

router.get("/", (req, res)=>{
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log("This is GET ALL error", err)
        res.status(500).json({error: "Error retrieving posts"})
    })
})

//BY POST ID


router.get("/:id", (req, res) => {
    const id = req.params.id

    Posts.findById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        console.log("This is GET POST ID error", err)
        res.status(500).json({error: "Error retrieving post by id"})
    })
})

//GET SUBROUTE COMMENTS


router.get("/:id/comments", (req,res)=>{
    const postId = req.params.id

    Posts.findPostComments(postId)
    .then(comments => {
        res.status(200).json(comments)
    })
    .catch(err => {
        console.log("This is GET POST'S COMMENTS error", err)
        res.status(500).json({error: "Error retrieving post's comments"})
    })
})














////SUBROUTES: COMMENTS









module.exports = router