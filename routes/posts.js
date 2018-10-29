const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/", function(req, res){
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err)
        }else {
            res.render("posts/index", {allPosts: allPosts})
        }
    })
})

router.post("/", function(req,res){
    const movieId = req.body.movieId
    const movieTitle = req.body.movieTitle
    const imgUrl = req.body.imgUrl
    const title = req.body.Title
    const text = req.body.text
    const author = req.body.author
    const newPost = {
        movieId:movieId, 
        movieTitle:movieTitle,
        imgUrl:imgUrl,
        title:title, 
        author:author, 
        text:text}
    console.log(req.body)
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else {
            console.log(newlyCreated)
            res.redirect("posts/")
        }
    })
})

router.post("/new", function(req, res){
    const movieId = req.body.movieId
    const movieTitle = req.body.title
    const imgUrl = req.body.img
    res.render("posts/new",{movieId, movieTitle, imgUrl})   
})

router.get("/:id", function(req,res){
    const id = req.params.id
    Post.findById(id,function(err, foundPost){
        if(err){
            console.log(err)
        }else{
            console.log(foundPost)
            res.render("posts/show", {post:foundPost})  
        }
    })  
})

module.exports = router;