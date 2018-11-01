var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    text: String,
    movieId: String,
    movieTitle: String,
    imgUrl: String,
    watchPlace: String,
    watchTime: Object,
    rate: Number,
    time:Object,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);