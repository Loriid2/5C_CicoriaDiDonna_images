import {generateModalForm} from "./src/formComponent/formComponent.js" ;

const carousel = document.querySelector('#carousel');
const adminButton = document.querySelector('#adminButton');

const loginModal = new bootstrap.Modal(document.getElementById('loginModal')) ;

const loginForm = generateModalForm(document.getElementById('loginModalBody')) ;


const loginFormSetup = {
    "username": ["text", "input-group"],
    "password": ["password", "input-group"],
} ;
loginForm.build(loginFormSetup, "loginModal");
//console.log(loginForm) ;
loginForm.render(null);
loginForm.onsubmit(() => {}) ;
