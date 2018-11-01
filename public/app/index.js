const show = document.querySelector(".show")
const showContent = document.querySelector(".show__content")
const showCloseBtn = show.querySelector(".close")
const content = document.querySelector("#content1")

function createContetCard(data){
    const movieCard = document.createElement("div")
    movieCard.classList.add("content__card")
    movieCard.classList.add("hide")
    movieCard.id = data.id
    movieCard.dataset.img =`https://image.tmdb.org/t/p/w200/${data.poster_path}`
    movieCard.dataset.title = data.original_title
    movieCard.dataset.overview = data.overview
    movieCard.innerHTML=`
    <div class="placeholder small">
            <img src="https://image.tmdb.org/t/p/w200/${data.poster_path}" alt="no pic" height="180px" width="120px" class="content__card__img">
    </div>
    <h3 class="content__card__title">${ movieCard.dataset.title}</h3>
    `
    content.appendChild(movieCard)
    movieCard.querySelector(".placeholder").addEventListener("click",handleMoreInfo)
    movieCard.querySelector(".content__card__title").addEventListener("click",handleMoreInfo)
    setTimeout(()=>{
        movieCard.classList.remove("hide")
    },200)
}
function handleMoreInfo(){
    const movieCard =this.parentElement
    const movieId = movieCard.id
    const imgUrl = movieCard.dataset.img
    const title = movieCard.dataset.title
    const overview = movieCard.dataset.overview
    show.classList.remove("hide")
    showContent.innerHTML=`
    <h3>${title}</h3>
    <p style="text-align:left; text-shadow: 3px 3px 0 black">
        <img src=${imgUrl} style="float:left; margin:0 15px">
        ${overview}
    </p>
    <form class="post" method="POST" action="posts/new">
        <input type="text" name="movieId" value="${movieId}" hidden>
        <input type="text" name="img" value="${imgUrl}" hidden>
        <input type="text" name="title" value="${title}" hidden>
        <button type="submit" class="submit_btn btn" style="font-size:2rem">start posting</button>
    </form>
    <hr style="width:95%; height:3px; background:white">
    `
    const url =`/getVideo/${movieId}`
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
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
            })
            const trailer = document.createElement("h4")
            trailer.innerText = "MOVIE TRAILER"
            showContent.appendChild(trailer)
            showContent.appendChild(movieTrailer)
        }
    })
}

function recentMovie(){
    const url ="/recentMovie/1"
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        content.innerHTML=""
        for(let i=0; i<4; i++){
            createContetCard(res.results[i])
        }
    })
}

function closeShow(){
    show.classList.add("hide")
    showContent.innerHTML=""
}
showCloseBtn.addEventListener("click",closeShow)
recentMovie()