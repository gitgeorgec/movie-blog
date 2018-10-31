const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
var middleware = require("../middleware")

router.post("/:postId", middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.postId, function(err,foundPost){
        if(err){
            console.log(err)
            res.redirect("/posts/"+req.params.postId)
        }else {
            Comment.create({
                text:req.body.comment_message,
                time: new Date()
            }, function(err,comment){
                if(err){
                    console.log(err)
                    res.redirect("/posts/"+req.params.postId)
                }else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    foundPost.comments.push(comment);
                    foundPost.save()
                    res.redirect("/posts/"+req.params.postId)
                }
            })
        }
    })
})

router.put("/:commentId",middleware.checkCommentOwnership, function(req, res){
    console.log(req.params.commentId)
    console.log(req.body.comment_message)
    Comment.findByIdAndUpdate(req.params.commentId,{text:req.body.comment_message} ,function(err,foundComment){
        if(err){
            console.log(err)
            res.redirect("back")
        }else{
            console.log("success")
            res.redirect("back")
        }
    })
})

router.delete("/:commentId",middleware.checkCommentOwnership, function(req, res){
    const postId = req.body.postId
    Post.findById(postId, function(err, foundPost){
        if(err){
            console.log(err)
        }else{
            const newComments = foundPost.comments.filter(i=>{
                return !i.equals(req.params.commentId)
            })
            foundPost.comments = newComments
            Comment.findByIdAndRemove(req.params.commentId, function(err){
                if(err){
                    console.log(err)
                }
                foundPost.save()
                res.redirect("back")
            })
        }
    })
})

module.exports = router;