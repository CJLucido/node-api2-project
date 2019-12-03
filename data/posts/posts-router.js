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
    })
})

















////SUBROUTES: COMMENTS









module.exports = router