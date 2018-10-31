const Post = require("../models/post")
const Comment = require("../models/comment")
var middlewareObj = {};


middlewareObj.checkCommentOwnership =function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err|| !foundComment){
                res.redirect("back")
            }else {
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect("back")
                }
            }
        })
    }else{
        res.redirect("back")
    }
}

middlewareObj.checkPostOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Post.findById(req.params.commentId, function(err, foundPost){
            if(err|| !foundPost){
                res.redirect("back")
            }else {
                if(foundPost.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect("back")
                }
            }
        })
    }else{
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}




module.exports = middlewareObj
