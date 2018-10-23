const express = require("express")
const app = express()
const axios = require('axios')
const PORT = process.env.PORT||3000
let apikey=""

try {
    apikey = require("./code")
} catch (error) {
    apikey = process.env.APIKEY
}


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

app.use(express.static('public'))
app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("home");
});

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



app.listen(PORT,process.env.IP);

