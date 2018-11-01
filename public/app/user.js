const collectionTitle = document.querySelectorAll(".collection__title>*")
const collectionItem = document.querySelectorAll(".collection__item")
const searchForm =  document.querySelectorAll(".search")
const searchBtn =  document.querySelectorAll(".search__button")
const contentTitle = document.querySelector(".content__title")
const content = document.querySelector(".content")
let page = 1


function handleClick(){
    this.dataset.link
    collectionItem.forEach(content=>{
        if(content.id !== this.dataset.link){
            content.classList.add("none")
        }else{
            content.classList.remove("none")
        }
    })
}


collectionTitle.forEach(title=>{
    title.addEventListener("click",handleClick)
})
