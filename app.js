const searchForm =  document.querySelectorAll(".search")
const searchBtn =  document.querySelectorAll(".search__button")
const content = document.querySelector(".content")
const jumbo = document.querySelector(".jumbotron")
const navbar = document.querySelector(".navbar")
const contentTitle = document.querySelector(".content__title")
const show = document.querySelector(".show")
const showContent = document.querySelector(".show__content")
const showCloseBtn = show.querySelector(".close")
let page = 1
let movie =""
let dbRecentMovie =debounce(()=>handleScoll(recentMovie))
let dbSearchMovie =debounce(()=>handleScoll(handleSearch))

function createContetCard(data){
    const movieCard = document.createElement("div")
    movieCard.classList.add("content__card")
    movieCard.classList.add("hide")
    movieCard.id = data.id
    movieCard.innerHTML=`
    <img src="https://image.tmdb.org/t/p/w300/${data.poster_path}" alt="no pic" class="content__card__img">
    <h3 class="content__card__title">${data.original_title}</h3>
    <label>
        <input type="checkbox" class="content__card__text_toggle" hidden>
        <p class="content__card__text">${data.overview}</p>
    </label>
    `
    content.appendChild(movieCard)
    movieCard.querySelector(".content__card__img").addEventListener("click",handleMoreInfo)
    movieCard.querySelector(".content__card__title").addEventListener("click",handleMoreInfo)
    setTimeout(()=>{
        movieCard.classList.remove("hide")
    },200)
}

function recentMovie(){
    const url ="https://api.themoviedb.org/3/movie/now_playing?api_key=e162dc571aea1100fab3e5a190e6abd3&language=en-US&page="+page
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        if(page===1)content.innerHTML=""
        res.results.forEach(data=>createContetCard(data))
    })
}

function handleSearch(e){
    const url ="https://api.themoviedb.org/3/search/movie?api_key=e162dc571aea1100fab3e5a190e6abd3"
    const contentCard = document.querySelectorAll(".content__card")
    if(this.parentElement){
        movie = this.parentElement.querySelector(".search__input").value
        e.preventDefault()
        this.parentElement.querySelector(".search__input").value =""
        contentCard.forEach(card=>card.classList.add("hide"))
        setTimeout(()=>{
            contentCard.forEach(card=>card.remove())
            jumbo.style="display:none"
        },500)
        contentTitle.textContent=`serach result for "${movie}"`
        contentTitle.appendChild(document.createElement("hr"))
        jumbo.classList.add("hide")
        navbar.querySelector(".search").classList.remove("hide")
    }
    fetch(`${url}&query=${movie}&page=${page}`)
    .then(res=> {
        if(page===1)content.innerHTML=""
        if (res.status >= 400 && res.status < 600) {
            throw new Error("Bad response from server");
        } 
        return res.json();
    })
    .then(res=>{
        if(res.total_results === 0){
            const blank =document.createElement("div")
            blank.style.height = "100vh"
            content.appendChild(blank)
        }
        res.results.forEach(data=>createContetCard(data))
        window.addEventListener("scroll", dbSearchMovie)
    })
    .catch(err=>{
        const blank =document.createElement("div")
        blank.style.height = "100vh"
        content.appendChild(blank)
        console.log(err)
    })
}

function handleScoll(fn){
    totalY = document.body.scrollHeight
    windowY = window.scrollY+window.innerHeight   
    if(page===10)return
    if(windowY>totalY-500&&totalY>window.innerHeight){
        page++
        fn()
    }
}

function debounce(func, wait=50, immediate = true){
    var timeout;
    return function(){
        var context = this, args= arguments;
        var later = function(){
            timeout = null
            if(!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout;
        clearTimeout(timeout)
        timeout = setTimeout(later, wait);
        if(callNow) func.apply(this, args)
    }
}

function toggleSearch(){
    if(window.scrollY>=window.innerHeight){
        searchForm[0].classList.remove("hide")
        window.removeEventListener("scroll",toggleSearch)
    }
}

function handleMoreInfo(){
    const id = this.parentElement.id
    show.classList.remove("hide")
    showContent.innerHTML=""   
    const url =`https://api.themoviedb.org/3/movie/${id}/videos?api_key=e162dc571aea1100fab3e5a190e6abd3`
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        if(res.results.length===0){
            showContent.innerHTML = "NOT FOUND VIDEO "
        }
        res.results.forEach(video=>{
            const videoCard = document.createElement("iframe")
            videoCard.classList.add("show__content__card")
            videoUrl = `https://www.youtube.com/embed/${video.key}`
            videoCard.src = videoUrl
            showContent.appendChild(videoCard)
        })
    })
}

function closeShow(){
    show.classList.add("hide")
    showContent.innerHTML=""
}

searchBtn.forEach(btn=>{
    btn.addEventListener("click", handleSearch)
    btn.addEventListener("click", ()=>{page=1})
    btn.addEventListener("click", ()=>{
        window.removeEventListener("scroll", dbRecentMovie)
        window.removeEventListener("scroll", dbSearchMovie)
        window.removeEventListener("scroll",toggleSearch)
    })
    btn.addEventListener("click",()=>window.scrollTo({top: 0,}))
})

showCloseBtn.addEventListener("click",closeShow)
window.addEventListener("scroll", dbRecentMovie)
window.addEventListener("scroll",toggleSearch)
recentMovie()

