const express = require("express")
const app = express()
const axios = require('axios')
const PORT = process.env.PORT||3000
let apikey=""

const comments=[
    {_id:"1", movie:"335983",img:"https://image.tmdb.org/t/p/w200//2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",user:"Tim" ,title:"超好看的拉" ,message:"t頭家晚夠性。有未照告天取人天林時？你時西。開吸天緊我林的黃於作結子復，但生須學戲牛古心對物、而然時實心公，本那足是未便期使由我的很亮我常林交處？的子媽除臺局富親，什眼給氣後洋女術間者言發！背我位母配，座傳禮陽一信因你北點而成。", commits:[
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛"},
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
    ]},
    {_id:"2", movie:"332562",img:"https://image.tmdb.org/t/p/w200//lNkDYKmrVem1J0aAfCnQlJOCKnT.jpg",user:"Tom" ,title:"難看死勒" ,message:"種故比決一。組三原。怎於能她少人酒回，流適觀動合顯創把看雖這感長到愛經？起北類？舉力長明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性用以歷有究上民種喜民動的外打園可處港。",commits:[
    ]},
    {_id:"3", movie:"369972",img:"https://image.tmdb.org/t/p/w200//2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg",user:"Rocky" ,title:"一般般" ,message:"牛水如一場士、知到口天空天請好們路弟在文下文畫亞兒司至他裝該民高雲我傳果？度花麼學流接心體市人處、施設高。上奇轉的新問分極，能文日學於以以濟整目是帶如辦早我讀全在成早遊委知難金？",commits:[
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
        {user:"tom", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
    ]},
    {_id:"4", movie:"369972",img:"https://image.tmdb.org/t/p/w200//4nKoB6wMVXfsYgRZK5lHZ5VMQ6J.jpg",user:"Rocky" ,title:"普普通通" ,message:"牛水如一場士、知到口天空天請好們路弟在文下文畫亞兒司至他裝該民高雲我傳果？度花麼學流接心體市人處、施設高。上奇轉的新問分極，能文日學於以以濟整目是帶如辦早我讀全在成早遊委知難金？",commits:[
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
        {user:"tom", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
    ]},
    {_id:"5", movie:"369972",img:"https://image.tmdb.org/t/p/w200//5LYSsOPzuP13201qSzMjNxi8FxN.jpg",user:"Rocky" ,title:"難看死勒" ,message:"牛水如一場士、知到口天空天請好們路弟在文下文畫亞兒司至他裝該民高雲我傳果？度花麼學流接心體市人處、施設高。上奇轉的新問分極，能文日學於以以濟整目是帶如辦早我讀全在成早遊委知難金？",commits:[
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
        {user:"tom", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
    ]},
    {_id:"6", movie:"369972",img:"https://image.tmdb.org/t/p/w200//9kB56ZdMB6RgY5QtX9Bar45jCeI.jpg",user:"Rocky" ,title:"超好看的拉" ,message:"牛水如一場士、知到口天空天請好們路弟在文下文畫亞兒司至他裝該民高雲我傳果？度花麼學流接心體市人處、施設高。上奇轉的新問分極，能文日學於以以濟整目是帶如辦早我讀全在成早遊委知難金？",commits:[
        {user:"jack", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
        {user:"tom", message:"明人西：市實什沒、三那口，因比時多視一裡斯傳？展議驚產變對響向就布都叫臺不不了的最相石程校？思血那由商的強底，身友有春的必心早唱教就或電建牛廣。性"},
    ]},
]

try {
    apikey = require("./code")
} catch (error) {
    apikey = process.env.APIKEY
}



app.use(express.static('public'))
app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/login", function(req, res){
    res.render("login")
})
app.get("/home", function(req, res){
    res.render("home",{comments});
})

app.post("/new/:id", (req, res)=>{
    const Id = req.params.id
    res.render("new")
})
app.get("/search", (req, res)=>{
    res.render("search")
})

app.get("/post/:commentId",function(req,res){
    const Id = req.params.commentId
    const post = comments.find(item=>item._id===Id)
    res.render("post",{post})
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



app.listen(PORT,process.env.IP);

