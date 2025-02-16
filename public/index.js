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

const interval = window.setInterval(function(){
	if (loginComponent.isLogged()) {
		document.querySelector(".loginButton").classList.add("hide") ;
		document.querySelector("#adminPage").classList.remove("hide") ;
		loginComponent.render();
		clearInterval(interval);
	}
}, 2000);

fetch("/conf.json")
.then(r => r.json())
.then(data => {
	loginComponent.build(data.cache.token, 'private');
	loginComponent.render();
	if (loginComponent.isLogged()) {
		document.querySelector(".loginButton").classList.add("hide") ;
		document.querySelector("#adminPage").classList.remove("hide") ;
		loginComponent.render();
		clearInterval(interval);
	}
});


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
const remove = async (id) => {
	fetch(`/image/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	})
	.then((response) => response.json())
	.then((data) => {
		console.log(data) ;
		render() ;
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
			
					let htmlContent = `
					<table class="table table-striped table-bordered table-hover margin">
						<thead class="table-dark">
							<tr>
								<th>Anteprima</th>
								<th>Link</th>
								<th>Azione</th>
							</tr>
						</thead>
						<tbody>`;
					files.images.forEach((fileUrl, index) => {
						htmlContent += `
									<tr>
										<td style="text-align: center; vertical-align: middle;">
											<img src="${fileUrl.url}" width="30px" height="30px" class="d-block">
										</td>
										<td style="vertical-align: middle;">
											<a href="${fileUrl.url}" target="_blank">${fileUrl.url}</a>
										</td>
										<td style="text-align: center; vertical-align: middle;">
											<button id="${fileUrl.id}" class="eliminaButton btn btn-danger">Elimina</button>
										</td>
									</tr>`;
					});
					htmlContent += '</tbody></table>' ;
					
					fileListContainer.innerHTML = htmlContent;
					console.log(fileListContainer.innerHTML);


					document.querySelectorAll('.eliminaButton').forEach((e) => {
						console.log(e);
						e.onclick = async () => {
							await remove(e.id) ;
							await render() ;
							await loadFileList() ;
						}
					})
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