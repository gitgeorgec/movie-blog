const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user")
const passport = require("passport")

router.get("/", function(req, res){
    Post.find({}, null, {sort: {time: -1}},function(err, allposts){
        if(err){
            console.log(err)
        }else {
            res.render("index",{allposts});
        }
    })
})

router.get("/search", (req, res)=>{
    res.render("search")
})

router.get("/signup",function(req, res){
    res.render("signup")
})

router.post("/signup", function(req, res){
    const newUser = new User({username:req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.redirect("/signup")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/")
        })
    })
})

router.get("/signup/:username", function(req, res){
    User.find({username:req.params.username}, function(err, user){
        if(err || user.length === 0){
            res.send("not found")
        }else {
            res.send("found one")
        }
    })
})

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }),function(req,res){
});

router.get("/login/:username", function(req, res){
    const username = req.params.username
    res.render("user", {LoginUser:{username}})
})


router.get("/logout", function(req,res){
    req.logout();
    // req.flash("success", "Logged you out")
    res.redirect("/");
});

router.get("/user", (req, res)=>{
    Post.find({"author.username":req.user.username},(err,foundPosts)=>{
        if(err){
            console.log(err)
        }else {
            res.render("user", {post:foundPosts})
        }
    })
})

router.put("/user", (req, res)=>{
    console.log(req.body.newPassword)
    User.findByIdAndUpdate(req.user._id).then(function(foundUser){
        foundUser.setPassword(req.body.newPassword, function(){
            console.log("success")
            foundUser.save()
            res.redirect("/logout")
        })
    })
})
module.exports = router;