var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    text: String,
    author: String,
    movieId: String,
    movieTitle: String,
    imgUrl: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);