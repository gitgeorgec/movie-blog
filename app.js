const searchBtn =  document.querySelectorAll(".search__button")
const searchTarget = 
console.log(searchBtn)

searchBtn.forEach(btn=>{
    btn.addEventListener("click", handleSearch)
})

function handleSearch(){
    const movie = this.parentElement.querySelector(".search__input").value
    alert(movie)
}