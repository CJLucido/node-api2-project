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

//DELETE POSTS BY ID

router.delete("/:id", (req,res)=>{
    const postId = req.params.id
    const delPost = Posts.findById(postId).then(post => {
        res.status(200).json(post)
    }).catch(err => {
        console.log("This is GET POST ID error in DEL", err)
        res.status(500).json({error: "Error retrieving post by id during DEL, server-side"})
    })

    Posts.remove(postId)
    .then(delPostCount => {
        if(delPostCount > 0){
            delPost
        }else{
            res.status(404).json({message: "Post not found"})
        }
    })
    .catch(err => {
        console.log("This is DELETE POST error", err)
        res.status(500).json({error: "Error deleting, server-side"})
    })
})


//PUT POST BY ID

router.put('/:id', (req, res)=>{
    const postId = req.params.id
    const updata = req.body

    Posts.update(postId, updata)
    .then(updateCount => {
        if(updateCount > 0) {
            res.status(200).json({message: `update to post ${postId} successful`})
        }else{
            res.status(404).json({error: `could not find post${postId}, not updated`})
        }
    })
    .catch(err => {
        console.log("This is PUT POST error", err)
        res.status(500).json({error:"Error updating, server-side"})
    })

})











////SUBROUTES: COMMENTS









module.exports = router