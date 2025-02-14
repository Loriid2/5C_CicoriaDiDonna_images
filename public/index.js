import {generateModalForm} from "./src/formComponent/formComponent.js" ;

const carouselInner = document.querySelector('#carouselInner');
const adminButton = document.querySelector('#adminButton');

const loginModal = new bootstrap.Modal(document.getElementById('loginModal')) ;

const loginForm = generateModalForm(document.getElementById('loginModalBody')) ;
let images = [];

const loginFormSetup = {
    "username": ["text", "input margin"],
    "password": ["password", "input margin"],
} ;
loginForm.build(loginFormSetup, "loginModal");
//console.log(loginForm) ;
loginForm.render(null);
loginForm.onsubmit(() => {
  
}) ;
const send=(img)=>{
  console.log(img);
    fetch(`/image/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(img),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Risultato della POST:", result);
        });
}
const getImages = () => {
    fetch("/image")
    .then((response) => response.json())
    .then((data) => {
       images = data.images;
       console.log(images);
       render();
    }); 
}
const remove = (id)=>{
    fetch(`/image/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          //logica della delete lato client
        });
}

const render=()=>{
    carouselInner.innerHTML = "";
    images.forEach((img, index) => {
      if(index==0){
        carouselInner.innerHTML += `
        <div class="carousel-item active">
            <img src="${img.url}" class="d-block w-50"  alt="...">
        </div>`
      }else{
        carouselInner.innerHTML += `
        <div class="carousel-item">
            <img src="${img.url}" class="d-block w-50" alt="...">
        </div>`
      }
    });
    console.log(carouselInner.innerHTML);
}
render();
getImages();


