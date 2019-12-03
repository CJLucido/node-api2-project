const express = require("express")

const Posts = require('../db')

const router = express.Router()

router.use(express.json())

//GETS
//ALL X'd

router.get("/", (req, res)=>{
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log("This is GET ALL error", err)
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

//BY POST ID X'd


router.get("/:id", (req, res) => {
    const id = req.params.id


    Posts.findById(id)
    .then(post => {
        if(post.length < 1){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }else{
            res.status(200).json(post)
        }
        
    })
    .catch(err => {
        console.log("This is GET POST ID error", err)
        res.status(500).json({error: "The post information could not be retrieved;Error retrieving post by id"})
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

//POST POST X'd

router.post('/', (req, res)=>{
    let postAcquireId = req.body

    if(
        (postAcquireId.hasOwnProperty('title') && postAcquireId.hasOwnProperty('contents'))
         && (postAcquireId.contents !== null && postAcquireId.title !== null))
         {
            postAcquireId = req.body

    Posts.insert(postAcquireId)
    .then(id => {
       const newPost = Object.assign({}, id, postAcquireId)
        res.status(201).json(newPost)
    //     const createdPost = (id) => Posts.findById(id).then(post => {
    //         res.status(200).json(post)
    //     })
    //    createdPost(id) //returns empty array before the database can give it the post object 

    //returning the id lets me know that it was successful anyway so a new object from assignment of incoming and outgoing is the equivalent of the returned post 
    })
    .catch(err => {
        console.log("This is POST POST error", err)
        res.status(500).json({error: "Error creating post"})
    })

}else{
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
}
})



//POST SUBROUTE: COMMENTS

router.post('/:id/comments', (req, res)=>{
    let commentBody = req.body

    let matchingPost = Posts.find().find(post => post.id)

    let foundId = true

    if(matchingPost.id === commentBody.post_id){
         foundId = true
    }else{
         foundId =false
    }

    if(
        (commentBody.hasOwnProperty('text') && commentBody.hasOwnProperty('post_id'))
         && (commentBody.text !== null && commentBody.post_id !== null))
         {
            commentBody = req.body

    Posts.insertComment(commentBody)
    .then(commentNewId => {
       
            res.status(201).json(commentNewId)
       
            
    })
    .catch(err => {
        console.log("This is POST COMMENT error", err)
        res.status(500).json({error:"There was an error while saving the comment to the database; Error commenting, server-side"})
    })

}else if (commentBody.hasOwnProperty('post_id') && //commentBody.post_id !== null

foundId === true
) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
}else{
    res.status(404).json({message: "Post Id not found for commenting, The post with the specified ID does not exist."})
}


})








module.exports = router