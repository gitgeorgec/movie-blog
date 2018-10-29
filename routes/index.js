var express = require("express");
var router = express.Router();
const Post = require("../models/post");

router.get("/", function(req, res){
    res.render("landing");
})

router.get("/index", function(req, res){
    Post.find({}, function(err, allposts){
        if(err){
            console.log(err)
        }else {
            res.render("index",{allposts});
        }
    })
})

router.get("/login", function(req,res){
    res.render("login");
});

module.exports = router;