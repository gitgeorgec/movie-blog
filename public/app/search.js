const searchForm =  document.querySelectorAll(".search")
const searchBtn =  document.querySelectorAll(".search__button")
const content = document.querySelector(".content")
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
    movieCard.dataset.img =`https://image.tmdb.org/t/p/w200/${data.poster_path}`
    movieCard.dataset.title = data.original_title
    movieCard.dataset.overview = data.overview
    movieCard.innerHTML=`
    <div class="placeholder" >
        <img src=${movieCard.dataset.img} alt="no pic" class="content__card__img">
    </div>
    <h3 class="content__card__title">${ movieCard.dataset.title}</h3>
    <label>
        <input type="checkbox" class="content__card__text_toggle" hidden>
        <p class="content__card__text">${movieCard.dataset.overview}</p>
    </label>
    `
    content.appendChild(movieCard)
    movieCard.querySelector(".placeholder").addEventListener("click",handleMoreInfo)
    movieCard.querySelector(".content__card__title").addEventListener("click",handleMoreInfo)
    setTimeout(()=>{
        movieCard.classList.remove("hide")
    },200)
}

function recentMovie(){
    const url ="/recentMovie/"+page
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        if(page===1)content.innerHTML=""
        res.results.forEach(data=>createContetCard(data))
    })
}

function handleSearch(e){
    const url ="/searchMovie"
    const contentCard = document.querySelectorAll(".content__card")
    if(this.parentElement){
        movie = this.parentElement.querySelector(".search__input").value
        e.preventDefault()
        this.parentElement.querySelector(".search__input").value =""
        contentCard.forEach(card=>card.classList.add("hide"))
        setTimeout(()=>{
            contentCard.forEach(card=>card.remove())
        },500)
        contentTitle.textContent=`serach result for "${movie}"`
        contentTitle.appendChild(document.createElement("hr"))
    }
    fetch(`${url}/${movie}/${page}`)
    .then(res=> {
        if(page===1)content.innerHTML=""
        if (res.status >= 400 && res.status < 600) {
            const blank =document.createElement("div")
            blank.innerText = "not found"
            content.appendChild(blank)
            throw new Error("Bad response from server");
        } 
        return res.json();
    })
    .then(res=>{
        if(res.total_results === 0){
            const blank =document.createElement("div")
            blank.innerText = "not found"
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
    if(windowY>totalY-800&&totalY>window.innerHeight){
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

function handleMoreInfo(){
    const movieCard =this.parentElement
    const movieId = movieCard.id
    const imgUrl = movieCard.dataset.img
    const title = movieCard.dataset.title
    const overview = movieCard.dataset.overview
    show.classList.remove("hide")
    showContent.innerHTML=`
    <form class="post" method="POST" action="posts/new">
        <h4>${title}</h4>
        <p style="text-align:left">
            <img src=${imgUrl} style="float:left">
            ${overview}
        </p>
        <input type="text" name="movieId" value="${movieId}" hidden>
        <input type="text" name="img" value="${imgUrl}" hidden>
        <input type="text" name="title" value="${title}" hidden>
        <button type="submit" style="text-align: end">write a new movie review</button>
    </form>
    <hr style="width:100%; height:3px">
    `
    const url =`/getVideo/${movieId}`
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        console.log(res.results)
        if(res.results.length===0){
            const notFound = document.createElement("p")
            notFound.innerText = "NOT FOUND VIDEO "
            showContent.appendChild(notFound)
        } else{
            const movieTrailer =document.createElement("div")
            movieTrailer.classList.add("trailer")
            res.results.forEach(video=>{
                const videoCard = document.createElement("iframe")
                videoCard.classList.add("show__content__card")
                videoUrl = `https://www.youtube.com/embed/${video.key}`
                videoCard.src = videoUrl
                movieTrailer.appendChild(videoCard)
                console.log(movieTrailer)
            })
            showContent.appendChild(movieTrailer)
        }
    })
}

function closeShow(){
    show.classList.add("hide")
    showContent.innerHTML=""
}

searchBtn.forEach(btn=>{
    btn.addEventListener("click", ()=>{page=1})
    btn.addEventListener("click", handleSearch)
    btn.addEventListener("click", ()=>{
        window.removeEventListener("scroll", dbRecentMovie)
        window.removeEventListener("scroll", dbSearchMovie)
    })
    btn.addEventListener("click",()=>window.scrollTo({top: 0,}))
})

showCloseBtn.addEventListener("click",closeShow)
window.addEventListener("scroll", dbRecentMovie)
recentMovie()

// window.addEventListener("scroll",toggleSearch)
// function toggleSearch(){
//     if(window.scrollY>=window.innerHeight){
//         searchForm[0].classList.remove("hide")
//         window.removeEventListener("scroll",toggleSearch)
//     }
// }