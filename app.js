const searchBtn =  document.querySelectorAll(".search__button")
const content = document.querySelector(".content")
const jumbo = document.querySelector(".jumbotron")
const navbar = document.querySelector(".navbar")
const contentTitle = document.querySelector(".content__title")
let page = 1

searchBtn.forEach(btn=>{
    btn.addEventListener("click", handleSearch)
    btn.addEventListener("click", ()=>{page=1})
    window.removeEventListener("scroll", handleScoll)
})

function createContetCard(data){
    const movieCard = document.createElement("div")
    movieCard.classList.add("content__card")
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
    e.preventDefault()
    const contentCard = document.querySelectorAll(".content__card")
    const movie = this.parentElement.querySelector(".search__input").value
    contentTitle.textContent=`serach result for "${movie}"`
    contentTitle.appendChild(document.createElement("hr"))
    jumbo.classList.add("hide")
    contentCard.forEach(card=>card.classList.add("hide"))
    navbar.querySelector(".search").classList.remove("hide")
    setTimeout(()=>{
        contentCard.forEach(card=>card.remove())
        jumbo.style="display:none"
    },500)
    fetch(`${url}&query=${movie}&page=${page}`)
    .then(res=> {
        if (res.status >= 400 && res.status < 600) {
            if(page===1)content.innerHTML=""
            throw new Error("Bad response from server");
        } 
        return res.json();
    })
    .then(res=>{
        content.innerHTML=""
        res.results.forEach(data=>createContetCard(data))
    })
    .catch(err=>{
        console.log(err)
    })
    this.parentElement.querySelector(".search__input").value =""
}

function handleScoll(fn){
    totalY = document.body.scrollHeight
    windowY = window.scrollY+window.innerHeight   
    if(page===10)return
    if(windowY>totalY-500){
            console.log("touch",page)
            page++
            fn()
    }
}

function debounce(func, wait=100, immediate = true){
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

window.addEventListener("scroll", debounce(()=>handleScoll(recentMovie)))
recentMovie()

