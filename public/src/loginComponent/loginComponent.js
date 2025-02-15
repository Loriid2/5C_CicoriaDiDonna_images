export const generateLoginComponent = (parentElement) => {
    let token;
    let isLogged;
    let privateClass;
    let formID ;

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            fetch("https://ws.cipiaceinfo.it/credential/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "key": token
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(r => r.json())
            .then(data => resolve(data.result))
            .catch(err => reject(err.result));
        });
    };

    return {
        build: (inputToken, inputPrivateClass) => {
            token = inputToken;
            isLogged = sessionStorage.getItem("logged") || false;
            privateClass = inputPrivateClass;
            formID = idForm ;

            /*
            if (isLogged) {
                document.getElementById("loginContainer").classList.add("d-none");
                document.querySelectorAll("." + privateClass).forEach(e => {
                    e.classList.remove("d-none");
                });
            }
                */
        },
        render: () => {
            console.log("render") ; 
            const html = `<form id="loginForm" class="form-inline">
                            <div class="row">
                                <div class="col">
                                    <input type="text" id="usernameInput" class="form-control" placeholder="Username">
                                </div>
                                <div class="col">
                                    <input type="password" id="passwordInput" class="form-control sm" placeholder="Password">
                                </div>
                                <div id="loginResultLabel"></div>
                            </div>
                        </form>`;
            parentElement.innerHTML = html;

            document.getElementById("Footer").innerHTML = `<button id="closeButtonLogin" type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                                    <button id="submitButtonLogin" type="button" class="btn btn-success" data-bs-dismiss="modal">Submit</button>`;

            console.log(document.getElementById("Footer").innerHTML) ;

            document.getElementById("submitButtonLogin").onclick = () => {
                const username = document.getElementById("usernameInput").value;
                const password = document.getElementById("passwordInput").value;

                if (username && password) {
                    login(username, password)
                    .then(r => {
                        let loginResultLabel = document.getElementById("loginResultLabel") ;
                        if (r) {
                            sessionStorage.setItem("logged", true);
                            isLogged = true;
                            document.getElementById("usernameInput").value = "";
                            document.getElementById("passwordInput").value = "";

                            document.querySelectorAll("." + privateClass).forEach(e => {
                                e.classList.remove("d-none");
                            });
                            
                            loginResultLabel.classList.add("text-success") ;
                            loginResultLabel.classList.remove("text-danger") ;
                            loginResultLabel.innerText = "Login effettuato con successo" ;

                            setTimeout(() => {
                                document.getElementById("loginContainer").classList.add("d-none");
                            }, 1500) ;

                        } else {
                            loginResultLabel.classList.add("text-danger") ;
                            loginResultLabel.classList.remove("text-success") ;
                            loginResultLabel.innerText = "Nome utente o password errati!" ;
                        }
                    })
                    .catch(err => {
                        console.log(err) ;
                    });
                }
            };

            document.getElementById("registerButton").onclick = () => {
                const username = document.getElementById("usernameInput").value;
                const password = document.getElementById("passwordInput").value;

                if (username && password) {
                    register(username, password)
                    .then(r => {
                        if (r) {
                            console.log("registrato e loggato") ;
                            sessionStorage.setItem("logged", true);
                            isLogged = true;
                            document.getElementById("usernameInput").value = "";
                            document.getElementById("passwordInput").value = "";

                            document.querySelectorAll("." + privateClass).forEach(e => {
                                e.classList.remove("d-none");
                            });
                        
                            loginResultLabel.classList.add("text-success") ;
                            loginResultLabel.classList.remove("text-danger") ;
                            loginResultLabel.innerText = "Registrazione e login effettuati con successo" ;

                            setTimeout(() => {
                                document.getElementById("loginContainer").classList.add("d-none");
                                console.log("eugwuwheeufwe") ;
                            }, 1500) ;

                        }
                    })
                    .catch(err => {
                        console.log(err) ;
                    });
                }
            };
        },
        isLogged: () => {
            return isLogged;
        }
    };
};