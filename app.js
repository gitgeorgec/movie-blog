const searchBtn =  document.querySelectorAll(".search__button")
const content = document.querySelector(".content")
const jumbo = document.querySelector(".jumbotron")
const navbar = document.querySelector(".navbar")
const contentTitle = document.querySelector(".content__title")

const url ="https://api.themoviedb.org/3/search/movie?api_key=e162dc571aea1100fab3e5a190e6abd3"

searchBtn.forEach(btn=>{
    btn.addEventListener("click", handleSearch)
})

function handleSearch(e){
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
    fetch(`${url}&query=${movie}`)
    .then(res=>res.json())
    .then(res=>{
        content.innerHTML=""
        res.results.forEach(data=>{
            const movieCard = document.createElement("div")
            movieCard.classList.add("content__card")
            movieCard.innerHTML=`
            <img src="https://image.tmdb.org/t/p/w400/${data.poster_path}" alt="no pic" class="content__card__img">
            <h3 class="content__card__title">${data.original_title}</h3>
            <p class="content__card__text">${data.overview}</p>
            `
            content.appendChild(movieCard)
        })
    })
    this.parentElement.querySelector(".search__input").value =""
}