import {generateModalForm} from "./src/formComponent/formComponent.js" ;

const carousel = document.querySelector('#carousel');
const adminButton = document.querySelector('#adminButton');

const loginModal = new bootstrap.Modal(document.getElementById('loginModal')) ;

const loginForm = generateModalForm(document.getElementById('loginModalBody')) ;


const loginFormSetup = {
    "username": ["text", "input margin"],
    "password": ["password", "input margin"],
} ;
loginForm.build(loginFormSetup, "loginModal");
//console.log(loginForm) ;
loginForm.render(null);
loginForm.onsubmit(() => {}) ;
const send=(img)=>{
    fetch("/todo/add", {
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
       // logica della get lato client
    }); 
}
const remove = (id)=>{
    fetch(`"/image/${id}`, {
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