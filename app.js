const express = require("express")
const mongoose = require("mongoose")
const bodyParser  = require("body-parser")
const app = express()
const axios = require('axios')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const methodOverride = require("method-override")
const indexRoutes = require("./routes/index")
const postRoutes = require("./routes/posts")
const commentRoutes = require("./routes/comments")
const User = require("./models/user")


const PORT = process.env.PORT||3000
let apikey=""
try {
    const Code = require("./code")
    apikey = Code.apikey
    mongoose.connect(Code.dbUrl,{ useNewUrlParser: true })
    // set session
    app.use(require("express-session")({
        secret:Code.salt,
        resave:false,
        saveUninitialized: false
    }));
} catch (error) {
    apikey = process.env.APIKEY
    mongoose.connect(process.env.DATABASEURL)
    app.use(require("express-session")({
        secret:process.env.salt,
        resave:false,
        saveUninitialized: false
    }));

}

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(methodOverride("_method"))

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

app.use(indexRoutes)
app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)

//apiCall
function apicall(url,res){
    return axios.get(url)
    .then(response=>{
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        } 
        return response
    })
    .then(response=>{
        res.send(response.data)
    })
    .catch(error=>console.log(error))
}

app.get("/recentMovie/:page", function(req,res){
    const page = req.params.page
    const url =`https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&language=en-US&page=${page}`
    apicall(url,res)
})

app.get("/searchMovie/:movie/:page", function(req,res){
    const movie = req.params.movie
    const page = req.params.page
    console.log("search "+movie)
    console.log("search "+page)
    const url =`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${movie}&page=${page}`
    apicall(url,res)
})

app.get("/getVideo/:id", function(req,res){
    const id = req.params.id
    const url =`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apikey}`
    apicall(url,res)
})

app.listen(PORT,process.env.IP, function(){
    console.log("Serve has Started")
});

