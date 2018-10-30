const express = require("express");
const router = express.Router();
const Post = require("../models/post");
var middleware = require("../middleware")

router.get("/", function(req, res){
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err)
        }else {
            res.render("posts/index", {allPosts: allPosts})
        }
    })
})

router.post("/",middleware.isLoggedIn, function(req,res){
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
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else {
            res.redirect("posts/")
        }
    })
})

router.post("/new",middleware.isLoggedIn, function(req, res){
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
            res.render("posts/show", {post:foundPost})  
        }
    })  
})

module.exports = router;