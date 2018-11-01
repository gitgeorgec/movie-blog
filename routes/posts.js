const express = require("express");
const router = express.Router();
const Post = require("../models/post");
var middleware = require("../middleware")

router.get("/", function(req, res){
    Post.find({}, null, {sort: {time: -1}},function(err, allPosts){
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
    const watchPlace = req.body.watchPlace
    const watchTime = req.body.watchTime
    const rate = req.body.rate
    const time = new Date
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newPost = {
        movieId:movieId, 
        movieTitle:movieTitle,
        imgUrl:imgUrl,
        title:title, 
        time:time,
        author:author, 
        text:text,
        watchPlace:watchPlace,
        watchTime:watchTime,
        rate:rate
    }
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else {
            console.log(newlyCreated)
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
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err)
            res.redirect("back")
        }else{
            res.render("posts/show", {post:foundPost})  
        }
    })  
})

router.get("/:id/edit",middleware.checkPostOwnership, function(req,res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err)
            res.redirect("/posts")
        }else{
            res.render("posts/edit", {Post:foundPost})
        }
    })
})

router.put("/:id", middleware.checkPostOwnership,function(req, res){
    const title = req.body.Title
    const text = req.body.text
    const time = new Date
    Post.findByIdAndUpdate(req.params.id, {
        title:title,
        text:text,
        time:time
    }, function(err, UpdatePost){
        if(err){
            console.log(err)
            res.redirect("/posts")
        }else {
            res.redirect("/posts/" +req.params.id)
        }
    })
})

router.delete("/:id", middleware.checkPostOwnership,function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
            res.redirect("/posts/")
        }else{
            res.redirect("/posts/")
        }
    })
    // res.send(`delete ${req.params.id}`)
})



module.exports = router;