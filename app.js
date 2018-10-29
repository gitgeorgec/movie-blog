const express = require("express")
const mongoose = require("mongoose")
const bodyParser  = require("body-parser")
const app = express()
const axios = require('axios')
const PORT = process.env.PORT||3000
const indexRoutes = require("./routes/index")
const postRoutes = require("./routes/posts")
let apikey=""
try {
    const Code = require("./code")
    apikey = Code.apikey
    mongoose.connect(Code.dbUrl,{ useNewUrlParser: true })
} catch (error) {
    apikey = process.env.APIKEY
    mongoose.connect(process.env.DATABASEURL)
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))
app.set("view engine", "ejs")

app.use(indexRoutes)
app.use("/posts", postRoutes)

app.get("/search", (req, res)=>{
    res.render("search")
})

app.get("/login/:username", function(req, res){
    const username = req.params.username
    res.render("user", {LoginUser:{username}})
})


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

