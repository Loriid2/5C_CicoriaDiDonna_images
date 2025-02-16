import { generateLoginComponent } from "./src/loginComponent/loginComponent.js";
import { createNavigator } from "./src/navigatorComponent/navigator.js";

const carouselInner = document.querySelector('#carouselInner');
const adminButton = document.querySelector('#adminButton');
const navigator = createNavigator();
location.href = "#home";
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const inputFile = document.querySelector('#file');
    const button = document.querySelector("#buttonUpload");
    const link = document.querySelector("#link");
    const fileListContainer = document.querySelector("#fileList");

const loginComponent = generateLoginComponent(document.getElementById('loginModalBody')) ;
let images = [];

const loginFormSetup = {
	"username": ["text", "input margin"],
	"password": ["password", "input margin"],
};

/*
fetch("./public/conf.json")
.then(r => r.json())
.then(data => {
   console.log("fetch conf") ;

   loginComponent.build(data.cache.token, 'private') ;
   loginComponent.render() ;
   loginComponent.onsubmit(() => {
	   console.log("submit") ;
   }) ;
});
*/
const interval = window.setInterval(function(){
	if (loginComponent.isLogged()) {
		document.querySelector(".loginButton").classList.add("hide") ;
		document.querySelector("#adminPage").classList.remove("hide") ;
		console.log(document.querySelector(".loginButton"));
		loginComponent.render();
		clearInterval(interval);
	}
}, 2000);

loginComponent.build("5597c861-7ea7-4f3b-be50-2c9f43e31aac", 'private');
loginComponent.render();
if (loginComponent.isLogged()) {
	document.querySelector(".loginButton").classList.add("hide") ;
	document.querySelector("#adminPage").classList.remove("hide") ;
	console.log(document.querySelector(".loginButton"));
	loginComponent.render();
	clearInterval(interval);
}

const send = (img) => {
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
const remove = (id) => {
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

const render = () => {
	carouselInner.innerHTML = "";
	images.forEach((img, index) => {
		if (index == 0) {
			carouselInner.innerHTML += `
        <div class="carousel-item active">
            <img src="${img.url}" class="d-block w-50"  alt="...">
        </div>`
		} else {
			carouselInner.innerHTML += `
        <div class="carousel-item">
            <img src="${img.url}" class="d-block w-50" alt="...">
        </div>`
		}
	});
	console.log(carouselInner.innerHTML);
}
getImages();
render();

(async () => {
    
    const loadFileList =  () => {
            fetch("/image")
                .then(res => {return res.json();})
                .then(files => {
					console.log(files.images);
			
					let htmlContent = '';
					files.images.forEach((fileUrl, index) => {
						htmlContent += `
							<li style="display: flex; align-items: center; gap: 10px;">
								<a href="${fileUrl.url}" target="_blank">
									<img src='${fileUrl.url}' width='30px' height='30px' class='d-block'> 
									<p>${fileUrl.url}</p>
								</a>
								<button id='eliminaButton${index}' class='eliminaButton'>elimina</button>
							</li>
						`;
					});
					
					fileListContainer.innerHTML = htmlContent;
					

					console.log(fileListContainer.innerHTML);
                });
				
    };

	const handleSubmit  = async () => {
		const formData = new FormData();
		formData.append("file", inputFile.files[0]);
	  
		try {
		  const response = await fetch(`/image/add`, {
			method: "POST",
			body: formData,
		  });
		  const result = await response.json();
		  console.log("Risultato della POST:", result);
		  link.href = result.url;
		  loadFileList();
		} catch (e) {
		  console.log(e);
		}
	  };
	  
	button.onclick = handleSubmit;

    

    loadFileList();
	getImages();
	render();
})();